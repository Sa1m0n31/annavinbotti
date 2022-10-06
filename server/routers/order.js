const express = require("express");
const router = express.Router();
const db = require("../database/db");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const got = require('got');
const authApi = require('./../apiAuth');
const basicAuth = new authApi().basicAuth;

const isElementInArray = (el, arr) => {
    return arr.findIndex((item) => {
        return item === el;
    }) !== -1;
}

let mailAfterPaymentSend = false;

let transporter = nodemailer.createTransport(smtpTransport ({
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    },
    host: process.env.EMAIL_HOST,
    secureConnection: true,
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
}));

router.get('/all', basicAuth, (request, response) => {
   const query = `SELECT o.id, COALESCE(a.first_name, u.first_name) as first_name, COALESCE(a.last_name, u.last_name) as last_name, o.date, o.status FROM orders o JOIN addresses a ON o.user_address = a.id JOIN users u ON u.id = o.user WHERE o.hidden = FALSE ORDER BY o.date DESC`;

   dbSelectQuery(query, [], response);
});

router.get('/', basicAuth, (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = `SELECT o.id, s.id as sell_id, o.date, o.delivery_number, COALESCE(ua.first_name, u.first_name) as first_name, COALESCE(ua.last_name, u.last_name) as last_name, u.email, ua.phone_number, o.shipping, p.id as product_id,
                    o.status, o.payment, da.city as delivery_city, da.street as delivery_street, da.postal_code as delivery_postal_code, da.building as delivery_building,
                    da.first_name as delivery_first_name, da.last_name as delivery_last_name, da.phone_number as delivery_phone_number,
                    da.flat as delivery_flat, ua.city as user_city, ua.street as user_street, ua.postal_code as user_postal_code, ua.building as user_building,
                    ua.flat as user_flat, o.nip, o.company_name, p.main_image, p.name_pl as product_name, p.name_en as product_name_en, s.price, t.name_pl as type, t.id as type_id,
                    ao.name_pl as addon_option_name, ao.name_en as addon_option_name_en, ao.admin_name as addon_option_admin_name, a.name_pl as addon_name, a.name_en as addon_name_en, a.admin_name as addon_admin_name  
                    FROM orders o 
                    JOIN sells s ON o.id = s.order 
                    JOIN sells_addons sa ON s.id = sa.sell 
                    JOIN users u ON o.user = u.id 
                    JOIN addresses ua ON ua.id = o.user_address 
                    JOIN addresses da ON da.id = o.delivery_address 
                    JOIN products p ON p.id = s.product 
                    JOIN types t ON p.type = t.id 
                    JOIN addons_options ao ON sa.option = ao.id 
                    JOIN addons a ON ao.addon = a.id 
                    WHERE o.id = $1 AND o.hidden = FALSE`;
       const values = [request.query.id];

       dbSelectQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

const sendStatus1Mail = (response, orderId, email) => {
    const query = `SELECT prod.name_pl as product_name, prod.type,
                    (SELECT string_agg(a.name_pl || ': ' || ao.name_pl, ';') as addon_name
                    FROM orders o
                    JOIN sells s ON s.order = o.id
                    JOIN sells_addons sa ON s.id = sa.sell
                    JOIN products p ON p.id = s.product
                    JOIN addons_options ao ON ao.id = sa.option
                    JOIN addons a ON a.id = ao.addon 
                    WHERE o.id = $1 AND s.id = sl.id
                    ) as addons
                FROM orders o
                JOIN sells sl ON sl.order = o.id
                JOIN sells_addons sa ON sl.id = sa.sell
                JOIN products prod ON prod.id = sl.product
                JOIN addons_options ao ON ao.id = sa.option
                JOIN addons a ON a.id = ao.addon
                WHERE o.id = $1
                GROUP BY (prod.name_pl, prod.type, sl.id);`;
    const values = [orderId];

    db.query(query, values, (err, res) => {
        if(res) {
            const r = res.rows;

            const formsLinksArray = r.map((item) => {
                return `<a style="margin: 5px 0; display: block; color: #B9A16B; text-decoration: underline;"
 href="${process.env.API_URL}/formularz-mierzenia-stopy?zamowienie=${orderId}&typ=${item.type}">
                        ${process.env.API_URL}/formularz-mierzenia-stopy?zamowienie=${orderId}&typ=${item.type}
</a>`
            });

            const formsLinks = formsLinksArray.join('');

            const addons = r.map((item) => {
                return item.addons.split(';').map((item) => {
                    return `<p style="color: #B9A16B; margin: 0;">
                      ${item}
                  </p>`
                }).join('');
            });

            const cart = r.map((item, index) => {
                return `<div style="margin: 10px 0; font-size: 15px;">
                  <h3 style="color: #B9A16B; font-size: 17px;">
                      ${item.product_name}
                  </h3>
                  ${addons[index]}
              </div>`
            }).join('');

            let mailOptions = {
                from: process.env.EMAIL_ADDRESS_WITH_NAME,
                to: email,
                subject: 'Otrzymaliśmy Twoją rezerwację',
                html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                    Właśnie otrzymaliśmy Twoją Rezerwację o numerze <b>#${orderId}</b> na ${r.length > 1 ? 'pary' : 'parę'} obuwia: 
                </p>
                ${cart}       
                <p style="color: #B9A16B;">
                    Czekamy <b>7 dni</b> na wypełnienie Formularza Mierzenia Stopy oraz wysłanie nam oryginalnych kartek z obrysem stopy prawej oraz lewej na nasz adres korespondencyjny. 
                </p>
                <p style="color: #B9A16B; text-align: center;">
                    Sklep Anna Vinbotti<br/>
                    Ul. Tomasza Zana 43 / lok. 2.1<br/>
                    20 – 601 Lublin
                </p>
                <p style="color: #B9A16B;">
                    Formularz Mierzenia Stopy znajduje się bezpośrednio pod
                    ${formsLinksArray?.length > 1 ? 'linkami' : 'linkiem'}:
                    
                    ${formsLinks} 
                </p>
                <p style="color: #B9A16B;">
                    Można go również otworzyć poprzez Panel Klienta:
                </p>
                <img src="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/image?url=/media/static/screen1.png" 
                style="display: block; margin: 30px auto; max-width: 90%;" alt="anna-vinbotti" />
                                
                <p style="color: #B9A16B;">
                    Przy wypełnianiu Formularza Mierzenia Stopy, prosimy postępować krok po kroku tak jak jest to opisane w artykułach na naszej stronie www:
                    
                    <a href="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/jak-mierzyc-stope-czolenka" 
                        target="_blank" 
                        style="text-decoration: underline; display: block; margin: 15px 0; text-transform: uppercase; color: #B9A16B; font-weight: 700;">
                        Jak mierzyć stopę - czółenka
                    </a>
                    <a href="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/jak-mierzyc-stope-oficerki" 
                        target="_blank" 
                        style="text-decoration: underline; display: block; margin: 15px 0; text-transform: uppercase; color: #B9A16B; font-weight: 700;">
                        Jak mierzyć stopę - oficerki
                    </a>
                </p>
                <p style="color: #B9A16B;">
                    Zastrzegamy, że w przypadku braku wypełnienia Formularza oraz dostarczenia nam obrysów, rezerwacja zostanie anulowana. 
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
            }

            transporter.sendMail(mailOptions, function(error, info) {
                response.status(201);
                response.send({
                    id: orderId
                });
            });
        }
        else {
            response.status(500).end();
        }
    });
}

router.put('/update-order-delivery-number', basicAuth,  (request, response) => {
   const { deliveryNumber, orderId } = request.body;

   const query = `UPDATE orders SET delivery_number = $1 WHERE id = $2`;
   const values = [deliveryNumber, orderId];

   dbInsertQuery(query, values, response);
});

const validateStocks = async (sells, addons) => {
    // sells: { product, price, amount }
    // addons: { sell, options : [1, 2, 3] }

    const res = await got.get(`${process.env.API_URL}/stocks/get-product-stock-table`, {
        headers: {
            Authorization: `Basic ${process.env.API_AUTH_HEADER}`
        },
    });
    const resAddons = await got.get(`${process.env.API_URL}/stocks/get-addon-stock-table`, {
        headers: {
            Authorization: `Basic ${process.env.API_AUTH_HEADER}`
        },
    });

    let productsStocksTable = JSON.parse(res.body).result; // { id, counter, product }
    let addonsStocksTable = JSON.parse(resAddons.body).result; // { id, stock }

    let i = 0;

    for(const sell of sells) {
        const currentSellAddons = addons.find((item) => (item.sell === i))?.options;

        // Subtract from products stocks
        productsStocksTable = productsStocksTable.map((item) => {
            const productStockId = item.id;

            // Subtract from all rows with the same stockId
            const productsWithTheSameStockId = productsStocksTable.filter((item) => {
                return item.id === productStockId;
            }).map((item) => (item.product));

            if(isElementInArray(sell.product, productsWithTheSameStockId)) {
                let newCounter = item.counter - sell.amount;
                return {...item,
                    counter: newCounter
                };
            }
            else {
                return item;
            }
        });

        // Subtract from addons stocks
        addonsStocksTable = addonsStocksTable.map((item) => {
            let stock = item.stock;

            for(const addon of currentSellAddons) {
                if(addon === item.id) {
                    stock = stock - sell.amount;
                }
            }

            return {...item,
                stock: stock
            }
        });

        i++;
    }

    const zeroProductsStocksAfterSubtraction = productsStocksTable.filter((item) => (item.counter < 0)).length;
    const zeroAddonsStocksAfterSubtraction = addonsStocksTable.filter((item) => (item.stock < 0)).length;

    return zeroProductsStocksAfterSubtraction === 0 && zeroAddonsStocksAfterSubtraction === 0;
}

const addOrder = async (user, userAddress, deliveryAddress, nip, companyName, shipping, oldSells, oldAddons, newsletter, response) => {
    const id = uuidv4().substring(0, 6);
    let sellsIds = [];

    let sells = [], addons = [];

    // Add if multiple identical (product + addons) products
    for(let i=0; i<oldSells.length; i++) {
        for(let j=0; j<oldSells[i].amount; j++) {
            sells.push(oldSells[i]);
        }
    }
    for(let i=0; i<oldAddons.length; i++) {
        for(let j=0; j<oldSells[i].amount; j++) {
            addons.push(oldAddons[i]);
        }
    }

    console.log(addons);

    // Validate stocks
    const productsAvailable = await validateStocks(oldSells, oldAddons);

    if(productsAvailable) {
        const query = `INSERT INTO orders VALUES ($1, $2, $3, $4, $5, $6, 1, false, NOW() + INTERVAL '4 HOUR', $7, NULL, NULL, NULL) RETURNING id`;
        const values = [id, user.id, userAddress, deliveryAddress, nip, companyName, shipping];

        // Add to newsletter
        if(newsletter === 'true') {
            const query = 'SELECT email FROM users WHERE id = $1 AND email NOT IN (SELECT email FROM newsletter WHERE active = TRUE)';
            const values = [user.id];

            await db.query(query, values, async(err, res) => {
                if(res?.rows?.length) {
                    const email = res?.rows[0]?.email;
                    if(email) {
                        await got.post(`${process.env.API_URL}/newsletter-api/add`, {
                            json: {
                                email
                            },
                            headers: {
                                Authorization: `Basic ${process.env.API_AUTH_HEADER}`
                            },
                            responseType: 'json',
                        });
                    }
                }
            });
        }

        // ADD ORDER
        await db.query(query, values, (err, res) => {
            if(res) {
                const orderId = res.rows[0].id;
                const query = `INSERT INTO order_status_changes VALUES ($1, $2, NOW() + INTERVAL '4 HOUR')`;
                const values = [orderId, 1];

                let i = 0;

                db.query(query, values, async (err, res) => {
                    for(const item of sells) {
                        const query = `INSERT INTO sells VALUES (nextval('sells_seq'), $1, $2, $3) RETURNING id`;
                        const values = [item.product, id, item.price];

                        const insertSellResult = await db.query(query, values);
                        sellsIds.push(insertSellResult.rows[0].id);
                        console.log(sellsIds);
                        let j = 0;

                        // When all sells inserted
                        if(sellsIds.length === addons.length) {
                            // ADD ADDONS
                            for(const item of addons) {
                                const options = item.options;
                                let k = 0;

                                for(const item of options) {
                                    const query = 'INSERT INTO sells_addons VALUES ($1, $2)';
                                    const values = [sellsIds[j], item];

                                    if((k === options.length-1) && (j === addons.length-1)) {
                                        await db.query(query, values, (err, res) => {
                                            if(res) {
                                                // Send notification to admin
                                                let mailOptions = {
                                                    from: process.env.EMAIL_ADDRESS_WITH_NAME,
                                                    to: process.env.ADMIN_MAIL_ADDRESS,
                                                    subject: 'Ktoś złożył rezerwację',
                                                    html: `<head>
                                                        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
                                                        <style>
                                                        * {
                                                        font-family: 'Roboto', sans-serif;
                                                        font-size: 16px;
                                                        }
                                                        </style>
                                                        </head>
                                                        <div style="background: #053A26; padding: 25px;">
                                                            <p style="color: #B9A16B;">
                                                                Ktoś złożył właśnie rezerwację na obuwie w sklepie Anna Vinbotti. Zaloguj się do panelu administratora, by sprawdzić szczegóły.
                                                            </p>
                                                            <p style="color: #B9A16B;">
                                                                ${nip ? 'Klient prosi o fakturę VAT na swoje zamówienie.' : ''}
                                                            </p>
                                                            <a style="color: #B9A16B; margin: 10px 0; text-decoration: underline;" href="${process.env.WEBSITE_URL}/vzh2sffqjn">
                                                                Zaloguj się do panelu admina
                                                            </a>
                                                        </div>`
                                                }

                                                transporter.sendMail(mailOptions, function(error, info) {
                                                    // Send status mail
                                                    sendStatus1Mail(response, id, user.email);
                                                });
                                            }
                                            else {
                                                response.status(500).end();
                                            }
                                        });
                                    }
                                    else {
                                        await db.query(query, values);
                                    }

                                    k += 1;
                                }
                                j += 1;
                            }
                        }
                        i += 1;
                    }
                });
            }
            else {
                response.status(500).end();
            }
        })
    }
    else {
        response.status(403).end();
    }
}

router.get('/get-order-status-changes', basicAuth,  (request, response) => {
   const { id } = request.query;

   if(id) {
       const query = `SELECT * FROM order_status_changes o WHERE o.order = $1`;
       const values = [id];

       dbSelectQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

router.post('/add', basicAuth,  (request, response) => {
    let { user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, newsletter } = request.body;

    // userAddress, deliveryAddress: { street, building, flat, postal_code, city } or integer if already exists
    // sells: { product, price, amount }
    // addons: { sell, options : [1, 2, 3] }

    if(sells && user && userAddress && deliveryAddress) {
        try {
            // ADD ADDRESSES IF NOT EXIST
            if(isNaN(userAddress)) {
                // USER ADDRESS
                const ad = userAddress;
                const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
                const values = [ad.city, ad.postal_code, ad.street, ad.building, ad.flat, ad.firstName, ad.lastName, ad.phoneNumber];

                db.query(query, values, (err, res) => {
                    if(res?.rows) {
                        userAddress = res.rows[0].id;

                        // UPDATE USER DATA (first and last name necessary for payment process)
                        const query = `UPDATE users SET first_name = $1, last_name = $2, address = $3, phone_number = $4 WHERE id = $5`;
                        const values = [ad.firstName, ad.lastName, userAddress, ad.phoneNumber, request.user];

                        db.query(query, values, (err, res) => {
                            if(res) {
                                if(isNaN(deliveryAddress)) {
                                    const ad = deliveryAddress;
                                    const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
                                    const values = [ad.city, ad.postal_code, ad.street, ad.building, ad.flat, ad.firstName, ad.lastName, ad.phoneNumber];

                                    db.query(query, values, (err, res) => {
                                        if(res?.rows) {
                                            deliveryAddress = res.rows[0].id;
                                            addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, newsletter, response);
                                        }
                                        else {
                                            console.log(err);
                                            response.status(500).end();
                                        }
                                    });
                                }
                                else {
                                    addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, newsletter, response);
                                }
                            }
                            else {
                                console.log(err);
                                response.status(500).end();
                            }
                        });
                    }
                    else {
                        console.log(err);
                        response.status(500).end();
                    }
                });
            }
            else {
                if(isNaN(deliveryAddress)) {
                    const ad = deliveryAddress;
                    const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5) RETURNING id`;
                    const values = [ad.city, ad.postal_code, ad.street, ad.building, ad.flat];

                    db.query(query, values, (err, res) => {
                        if(res?.rows) {
                            deliveryAddress = res.rows[0].id;
                            addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, newsletter, response);
                        }
                        else {
                            response.status(500).end();
                        }
                    });
                }
                else {
                    addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, newsletter, response);
                }
            }
        }
        catch(err) {
            console.log(err)
        }
    }
    else {
        response.status(400).end();
    }
});

const sendStatus3Email = (email, response, orderId) => {
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
        to: email,
        subject: 'Oczekiwanie na płatność',
        html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                   Poniższa wiadomość dotyczy rezerwacji o numerze #${orderId}.
                </p>  
                <p style="color: #B9A16B;">
                    Miło nam poinformować, że pomyślnie zweryfikowaliśmy dostarczone informacje, dotyczące wymiaru stóp.
                </p>
                <p style="color: #B9A16B;">
                    Zamówienie zostanie przyjęte do realizacji po zaksięgowaniu płatności.
                </p>
                <p style="color: #B9A16B;">
                    Prosimy o dokonanie płatności na stronie anna-vinbotti.com, w zakładce Panel Klienta/Zamówienia.
                </p>
                <a style="text-decoration: none; background: #B9A16B; 
                    color: #222; width: 350px; max-width: 80vw; display: block; box-sizing: content-box; border-radius: 30px; 
                    padding: 10px 0; height: 20px; min-height: 20px; 
                    text-align: center; margin: 20px auto 10px; text-transform: uppercase;
                    font-weight: 700;" href="${process.env.API_URL}/informacje-o-zamowieniu?id=${orderId}">
                    Zamawiam i płacę
                </a>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        response.status(201).end();
    });
}

const sendStatus4Email = (email, orderId, response = null, responseToPaymentGateway = false) => {
    const query = `SELECT prod.name_pl as product_name, prod.type,
                (SELECT string_agg(a.name_pl || ': ' || ao.name_pl, ';') as addon_name
                FROM orders o
                JOIN sells s ON s.order = o.id
                JOIN sells_addons sa ON s.id = sa.sell
                JOIN products p ON p.id = s.product
                JOIN addons_options ao ON ao.id = sa.option
                JOIN addons a ON a.id = ao.addon 
                WHERE o.id = $1 AND s.id = sl.id
                ) as addons
            FROM orders o
            JOIN sells sl ON sl.order = o.id
            JOIN sells_addons sa ON sl.id = sa.sell
            JOIN products prod ON prod.id = sl.product
            JOIN addons_options ao ON ao.id = sa.option
            JOIN addons a ON a.id = ao.addon
            WHERE o.id = $1
            GROUP BY (prod.name_pl, prod.type, sl.id)`;
    const values = [orderId];

    db.query(query, values, async (err, res) => {
        if(res) {
            const r = res.rows;

            const addons = await r.map((item) => {
                return item.addons.split(';').map((item) => {
                    return `<p style="color: #B9A16B; margin: 0;">
                      ${item}
                  </p>`
                }).join('');
            });

            const cart = await r.map((item, index) => {
                return `<div style="margin: 10px 0; font-size: 15px;">
                  <h3 style="color: #B9A16B; font-size: 17px;">
                      ${item.product_name}
                  </h3>
                  ${addons[index]}
              </div>`
            }).join('');

            let mailOptions = {
                from: process.env.EMAIL_ADDRESS_WITH_NAME,
                to: email,
                subject: 'Zamówienie przyjęto do realizacji',
                html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                    Dziękujemy za dokonanie płatności. Miło nam poinformować, że zamówienie o numerze #${orderId} zostało przyjęte do realizacji.
                    </p>
                    <p style="color: #B9A16B;">
                    Zamówienie dotyczy ${cart?.length > 1 ? 'następujących produktów' : 'następującego produktu'}:
                </p>
                ${cart}       
                <p style="color: #B9A16B;">
                    Przystępujemy do pracy nad kopytem oraz wykonaniem Buta Do Miary.  
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
            }

            await transporter.sendMail(mailOptions, function(error, info) {
                if(!responseToPaymentGateway) {
                    response.status(201).end();
                }
                else {
                    // Send notification to admin
                    let mailOptions = {
                        from: process.env.EMAIL_ADDRESS_WITH_NAME,
                        to: process.env.ADMIN_MAIL_ADDRESS,
                        subject: 'Zamówienie zostało opłacone przez klienta',
                        html: `<head>
                                                        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
                                                        <style>
                                                        * {
                                                        font-family: 'Roboto', sans-serif;
                                                        font-size: 16px;
                                                        }
                                                        </style>
                                                        </head>
                                                        <div style="background: #053A26; padding: 25px;">
                                                            <p style="color: #B9A16B;">
                                                                Klient opłacił zamówienie o id ${orderId}. Aby sprawdzić szczegóły zamówienia, zaloguj się do panelu administratora.
                                                            </p>
                                                            <a style="color: #B9A16B; margin: 10px 0; text-decoration: underline;" href="${process.env.WEBSITE_URL}/vzh2sffqjn">
                                                                Zaloguj się do panelu admina
                                                            </a>
                                                        </div>`
                    }

                    transporter.sendMail(mailOptions, function(error, info) {
                        // Response to payment gateway
                        response.status(200).send({
                            status: 'ok'
                        });
                    });
                }
            });
        }
        else {
            if(response) {
                response.status(500).end();
            }
        }
    });
}

const sendStatus5Email = (email, orderId, response) => {
    const query = `SELECT shipping, delivery_number FROM orders WHERE id = $1`;
    const values = [orderId];

    db.query(query, values, (err, res) => {
       if(res) {
           const r = res.rows[0];
           const deliveryNumber = r.delivery_number;

           const query = `SELECT prod.name_pl as product_name, prod.id,
                (SELECT string_agg(a.name_pl || ': ' || ao.name_pl, ';') as addon_name
                FROM orders o
                JOIN sells s ON s.order = o.id
                JOIN sells_addons sa ON s.id = sa.sell
                JOIN products p ON p.id = s.product
                JOIN addons_options ao ON ao.id = sa.option
                JOIN addons a ON a.id = ao.addon 
                WHERE o.id = $1 AND p.name_pl = prod.name_pl
                ) as addons
            FROM orders o
            JOIN sells s ON s.order = o.id
            JOIN sells_addons sa ON s.id = sa.sell
            JOIN products prod ON prod.id = s.product
            JOIN addons_options ao ON ao.id = sa.option
            JOIN addons a ON a.id = ao.addon
            WHERE o.id = $1
            GROUP BY (prod.name_pl, prod.id, s.id)`;
           const values = [orderId];

           db.query(query, values, (err, res) => {
              if(res) {
                  const r = res.rows;

                  function onlyUnique(value, index, self) {
                      return self.indexOf(value) === index;
                  }

                  const formsLinksArray = r.map((item) => {
                      return `<a style="margin: 5px 0; display: block; color: #B9A16B; text-decoration: underline;"
 href="${process.env.API_URL}/formularz-weryfikacji-buta?zamowienie=${orderId}&model=${item.id}">
                        ${process.env.API_URL}/formularz-weryfikacji-buta?zamowienie=${orderId}&model=${item.id}
</a>`
                  }).filter(onlyUnique);

                  const formsLinks = formsLinksArray.join('');

                  let mailOptions = {
                      from: process.env.EMAIL_ADDRESS_WITH_NAME,
                      to: email,
                      subject: 'But do miary został wysłany',
                      html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                 <p style="color: #B9A16B;">
                   Poniższa wiadomość dotyczy zamówienia o numerze #${orderId}.
                </p>  
                <p style="color: #B9A16B;">
                   But Do Miary jest gotowy i został wysłany kurierem. Numer przesyłki to ${deliveryNumber}.
                </p>  
                <p style="color: #B9A16B;">
                   But Do Miary w żaden sposób nie odzwierciedla jakości oraz wykończenia Buta Finalnego. Nie odzwierciedla również dodatków, jakie zostały wybrane, na przykład koloru skóry. Ten but służy tylko i wyłącznie do weryfikacji, czy podane wymiary stopy są odpowiednie i czy możemy przystąpić do realizacji Buta Finalnego.
                </p>  
                <p style="color: #B9A16B;">
                   Po otrzymaniu przesyłki prosimy o przymierzenie Buta do Miary i sprawdzenie, czy jego rozmiar jest odpowiedni. Zalecane jest aby chwilkę w nim pochodzić, tak aby móc stwierdzić, czy nie jest za luźny, lub też nigdzie nie uciska. Jeżeli jest to but na obcasie, warto w miarę możliwości na lewą stopę założyć but o obcasie w podobnej wysokości.
                </p>  
                
                <p style="color: #B9A16B;">
                   Prosimy również o wypełnienie ${formsLinksArray?.length > 1 ? 'Formularzy' : 'Formularza'} Buta do Miary, ${formsLinksArray?.length > 1 ? 'znajdującego' : 'znajdujących'} się w Panelu Klienta. 
                </p>  
                
                 ${formsLinks}
                 
                 <img src="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/image?url=/media/static/screen2.png" 
                style="display: block; margin: 30px auto; max-width: 90%;" alt="anna-vinbotti" />
                
                <p style="color: #B9A16B;">
                   Dopiero po wypełnieniu Formularza Buta Do Miary, będziemy mogli przystąpić do pracy nad Finalną Parą Obuwia.
                </p>  
                <p style="color: #B9A16B;">
                   Jeżeli istnieje taka możliwość, prosimy o odesłanie nam Buta Do Miary. W tym celu prosimy o kontakt, wówczas wyślemy kuriera po przesyłkę.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
                  }

                  transporter.sendMail(mailOptions, function(error, info) {
                      response.status(201).end();
                  });
              }
              else {
                  response.status(500).end();
              }
           });
       }
       else {
           response.status(500).end();
       }
    });
}

const sendStatus7Email = (email, response, orderId) => {
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
        to: email,
        subject: 'Realizacja finalnej pary obuwia',
        html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                   Poniższa wiadomość dotyczy zamówienia o numerze #${orderId}.
                </p>  
                <p style="color: #B9A16B;">
                    Miło nam poinformować, że przystąpiliśmy do realizacji Finalnej Pary Obuwia.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        response.status(201).end();
    });
}

const sendStatus8Email = (email, orderId, response) => {
    const query = `SELECT delivery_number FROM orders WHERE id = $1`;
    const values = [orderId];

    db.query(query, values, (err, res) => {
        if(res) {
            const deliveryNumber = res.rows[0]?.delivery_number;

            let mailOptions = {
                from: process.env.EMAIL_ADDRESS_WITH_NAME,
                to: email,
                subject: 'Finalna para obuwia została wysłana',
                html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                   Poniższa wiadomość dotyczy zamówienia o numerze #${orderId}.
                </p>  
                <p style="color: #B9A16B;">
                    Miło nam poinformować, że Finalna Para Obuwia została wysłana. Numer przesyłki to ${deliveryNumber}.
                </p>
                <p style="color: #B9A16B;">
                    Dziękujemy, że wspierasz ręczne rzemiosło.
                </p>
                <p style="color: #B9A16B;">
                    Zachęcamy do podzielenia się opinią w mediach społecznościowych i oznaczenia naszej marki.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
            }

            transporter.sendMail(mailOptions, function(error, info) {
                let mailOptions = {
                    from: process.env.EMAIL_ADDRESS_WITH_NAME,
                    to: email,
                    subject: 'Gwarancja do obuwia',
                    attachments: [
                        {
                            filename: 'Gwarancja do obuwia Anna Vinbotti.pdf',
                            path: './media/static/gwarancja.pdf'
                        }
                    ],
                    html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
font-size: 16px;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                   Poniższa wiadomość dotyczy zamówienia o numerze #${orderId}.
                </p>  
                <p style="color: #B9A16B;">
                    Nasz produkt objęty jest dwuletnią gwarancją. W załączniku znajduje się dokument.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
                }

                transporter.sendMail(mailOptions, function(error, info) {
                    response.status(201).end();
                });
            });
        }
        else {
            response.status(500).end();
        }
    });
}

router.put('/change-status', basicAuth,  (request, response) => {
    const { status, email, id } = request.body;

    const query = 'UPDATE orders SET status = $1 WHERE id = $2';
    const values = [status, id];

    db.query(query, values, (err, res) => {
        if(res) {
            const query = `INSERT INTO order_status_changes VALUES ($1, $2, NOW() + INTERVAL '4 HOUR')`;
            const values = [id, status];

            db.query(query, values, (err, res) => {
                if(status === 3) {
                    sendStatus3Email(email, response, id);
                }
                else if(status === 4) {
                    sendStatus4Email(email, id, response);
                }
                else if(status === 5) {
                    sendStatus5Email(email, id, response);
                }
                else if(status === 7) {
                    sendStatus7Email(email, response, id);
                }
                else if(status === 8) {
                    sendStatus8Email(email, id, response);
                }
                else {
                    response.status(201).end();
                }
            });
        }
        else {
            response.status(500).end();
        }
    })
});

router.get('/get-order-forms', basicAuth,  (request, response) => {
    const id = request.query.id;

    const query = `SELECT ff.form, ff.form_data, ff.sell, p.name_pl as product FROM filled_forms ff
                    JOIN sells s ON ff.sell = s.id
                    JOIN orders o ON o.id = s.order
                    JOIN products p ON p.id = s.product
                    WHERE o.id = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.delete('/delete', basicAuth, (request, response) => {
    const id = request.query.id;

    const query = 'UPDATE orders SET hidden = TRUE WHERE id = $1';
    const values = [id];

    dbInsertQuery(query, values, response);
});

router.get('/get-order-statuses', basicAuth,  (request, response) => {
   const query = 'SELECT * FROM order_statuses ORDER BY id';

   dbSelectQuery(query, [], response);
});

router.get('/get-form-details', basicAuth,  (request, response) => {
    const form = request.query.form;
    const sell = request.query.sell;

    const query = `SELECT ff.form_data, p.name_pl as product, o.id as order_id FROM filled_forms ff
                    JOIN sells s ON s.id = ff.sell
                    JOIN orders o ON o.id = s.order
                    JOIN products p ON p.id = s.product
                    WHERE ff.form = $1 AND ff.sell = $2`;
    const values = [form, sell];

    dbSelectQuery(query, values, response);
});

router.post('/set-status', basicAuth,  (req, res) => {
    const { v1, v2, v3, v4, v5, v6, v7, v8 } = req.body;

    const q1 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 1';
    const q2 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 2';
    const q3 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 3';
    const q4 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 4';
    const q5 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 5';
    const q6 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 6';
    const q7 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 7';
    const q8 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 8';

    db.query(q1, [v1]);
    db.query(q2, [v2]);
    db.query(q3, [v3]);
    db.query(q4, [v4]);
    db.query(q5, [v5]);
    db.query(q6, [v6]);
    db.query(q7, [v7]);
    db.query(q8, [v8]);
});

router.get('/get-number-of-first-type-forms-by-order', basicAuth,  (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = `SELECT t.id FROM orders o
                        JOIN sells s ON o.id = s.order
                        JOIN products p ON s.product = p.id
                        JOIN types t ON t.id = p.type
                        WHERE o.id = $1
                        GROUP BY t.id`;
       const values = [id];

       db.query(query, values, (err, res) => {
           if(res) {
               const numberOfForms = res.rows.length;
               response.send({
                   numberOfForms
               });
           }
           else {
               response.status(500).end();
           }
       });
   }
   else {
       response.status(400).end();
   }
});

router.get('/get-number-of-second-type-forms-by-order', basicAuth, (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = `SELECT s.product FROM orders o
                        JOIN sells s ON o.id = s.order
                        JOIN products p ON s.product = p.id
                        JOIN types t ON t.id = p.type
                        WHERE o.id = $1
                        GROUP BY s.product`;
        const values = [id];

        db.query(query, values, (err, res) => {
            if(res) {
                const numberOfForms = res.rows.length;
                response.send({
                    numberOfForms
                });
            }
            else {
                response.status(500).end();
            }
        })
    }
    else {
        response.status(400).end();
    }
});

router.post('/pay', basicAuth, (request, response) => {
    const { paymentMethod, orderId, firstName, lastName, email } = request.body;

    const query = `UPDATE orders SET payment = $1 WHERE id = $2 `;
    const values = [paymentMethod, orderId];

    db.query(query, values, (err, res) => {
        if(res) {
            const query = `SELECT SUM(s.price) as price FROM orders o
                        JOIN sells s ON o.id = s.order
                        WHERE o.id = $1`;
            const values = [orderId];

            db.query(query, values, (err, res) => {
                if(res) {
                    const orderPrice = res?.rows[0]?.price;
                    if(orderPrice) {
                        if(parseInt(paymentMethod) === 0) {
                            // imoje
                            got.post(`${process.env.IMOJE_API}merchant/${process.env.IMOJE_CLIENT_ID}/payment`, {
                                json: {
                                    serviceId: process.env.IMOJE_SHOP_ID,
                                    amount: parseFloat(orderPrice) * 100,
                                    currency: 'PLN',
                                    orderId: orderId,
                                    title: `Płatność za zakupy w sklepie Anna Vinbotti`,
                                    successReturnUrl: process.env.IMOJE_RETURN_URL,
                                    customer: {
                                        firstName: firstName,
                                        lastName: lastName,
                                        email: email
                                    }
                                },
                                headers: {
                                    'Authorization': `Bearer ${process.env.IMOJE_AUTH_TOKEN}`,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache'
                                }
                            })
                                .then((res) => {
                                    const paymentId = JSON.parse(res?.body)?.payment?.id;
                                    if(paymentId) {
                                        response.send({
                                            id: paymentId
                                        });
                                    }
                                    else {
                                        response.status(500).end();
                                    }
                                })
                                .catch((err) => {
                                    response.status(500).send(err);
                                })
                        }
                        else {
                            // traditional transfer
                            response.status(201).end();
                        }
                    }
                    else {
                        response.status(500).end();
                    }
                }
                else {
                    response.status(500).end();
                }
            });
        }
        else {
            response.status(500).end();
        }
    })
});

router.post('/payment-notification', (request, response) => {
    const signatureHeader = request.header('X-IMoje-Signature');
    const body = request.body;

    /*
    merchantid=9mkvs1m0a7szxlxpxkvr;serviceid=8010f629-dcc7-4391-82ab-10e6a9ddeff9;signature=6ddfd93c7d0693ddfabe9ce2bb9d171f6fc98d1af63e356cedd7b9a6e45e3b77;alg=sha256
     */

    if(signatureHeader) {
        try {
            const signature = signatureHeader.split(';')[2].split('=')[1];
            const alg = signatureHeader.split(';')[3].split('=')[1];

            const ownSignature = crypto.createHash(alg).update(JSON.stringify(body) + process.env.IMOJE_SHOP_KEY).digest('hex');

            if(ownSignature === signature && (body.transaction.status === 'settled')) {
                const query = `UPDATE orders SET status = 4 WHERE id = $1 AND status = 3`;
                const values = [body.transaction.orderId];

                db.query(query, values, (err, res) => {
                   if(res) {
                       const query = `INSERT INTO order_status_changes VALUES ($1, $2, NOW() + INTERVAL '4 HOUR')`;
                       const values = [body.transaction.orderId, 4];

                       db.query(query, values, (err, res) => {
                           const query = `SELECT u.email FROM users u JOIN orders o ON u.id = o.user WHERE o.id = $1`;
                           const values = [body.transaction.orderId];

                           db.query(query, values, (err, res) => {
                               if(res) {
                                   const email = res.rows[0]?.email;
                                   if(!mailAfterPaymentSend) {
                                       mailAfterPaymentSend = true;
                                       sendStatus4Email(email, body.transaction.orderId, response, true);
                                   }
                               }
                               else {
                                   response.status(500).end();
                               }
                           });
                       });
                   }
                   else {
                       response.status(500).end();
                   }
                });
            }
            else {
                response.status(500).end();
            }
        }
        catch(err) {
            response.status(500).end();
        }
    }
    else {
        response.status(400).end();
    }
});

router.post('/add-to-waitlist', basicAuth, (request, response) => {
   const { email, product } = request.body;

   if(email && product) {
       const query = `INSERT INTO waitlist VALUES ($1, LOWER($2), NOW())`;
       const values = [product, email];

       db.query(query, values, (err, res) => {
           if(res) {
               response.status(201).end();
           }
           else {
               if(err.code === '23505') {
                   response.send({
                       result: -1
                   });
               }
               else {
                   response.status(500).end();
               }
           }
       });
   }
   else {
       response.status(400).end();
   }
});

router.post('/reject-client-form', basicAuth, (request, response) => {
   const { data, orderId, email } = request.body;

   const query = `UPDATE orders SET status = 1 WHERE id = $1`;
   const values = [orderId];

   db.query(query, values, (err, res) => {
      if(res) {
          const query = `UPDATE filled_forms SET confirmed = FALSE WHERE form = 1 AND sell IN (
            SELECT id FROM sells WHERE sells.order = $1
          )`;
          const values = [orderId];

          db.query(query, values, (err, res) => {
              if(res) {
                  let mailOptions = {
                      from: process.env.EMAIL_ADDRESS_WITH_NAME,
                      to: email,
                      subject: 'Niepełne dane - prośba o uzupełnienie',
                      html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                    Przeanalizowaliśmy dostarczone materiały dotyczące wymiaru stóp. Niektóre dane wydają się być niepoprawne, lub zdjęcia są niewyraźne.
                </p>
                <p style="color: #B9A16B;">
                    Prośba o uzupełnienie/dostarczenie następujących info:
                </p>
                
                 <p style="color: #B9A16B;">
                    ${data}
                 </p>
                
                <p style="color: #B9A16B;">
                    Czekamy <b>7 dni roboczych</b> na powyższe informacje.  
                </p>
                <p style="color: #B9A16B;">
                    W przypadku braku ich dostarczenia, rezerwacja zostanie anulowana.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
                  }

                  transporter.sendMail(mailOptions, function(error, info) {
                      response.status(201).end();
                  });
              }
              else {
                  response.status(500).end();
              }
          })
      }
      else {
          response.status(500).end();
      }
   });
});

router.delete('/cancel-order', basicAuth, (request, response) => {
   const { id, email } = request.query;

   const query = `UPDATE orders SET status = NULL WHERE id = $1`;
   const values = [id];

   db.query(query, values, (err, res) => {
      if(res) {
          let mailOptions = {
              from: process.env.EMAIL_ADDRESS_WITH_NAME,
              to: email,
              subject: 'Rezerwacja anulowana',
              html: `<head>
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<style>
* {
font-family: 'Roboto', sans-serif;
}
</style>
</head><div style="background: #053A26; padding: 25px;">
                <p style="color: #B9A16B;">
                    Dzień dobry,
                </p>
                <p style="color: #B9A16B;">
                    Nie otrzymaliśmy wszystkich niezbędnych informacji, dotyczących wymiarów stóp, potrzebnych do dalszego procesowania Twojej rezerwacji o numerze #${id}. W związku z powyższym, rezerwacja została anulowana. 
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
          }

          transporter.sendMail(mailOptions, function(error, info) {
              response.status(201).end();
          });
      }
      else {
          response.status(500).end();
      }
   });
});

module.exports = router;
