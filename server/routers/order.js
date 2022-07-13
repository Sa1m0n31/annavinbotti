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

router.get('/all', (request, response) => {
   const query = `SELECT o.id, u.first_name, u.last_name, o.date FROM orders o JOIN users u ON o.user = u.id WHERE hidden = FALSE`;

   dbSelectQuery(query, [], response);
});

router.get('/', (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = `SELECT o.id, o.date, u.first_name, u.last_name, u.email, u.phone_number, o.shipping,
                    o.status, da.city as delivery_city, da.street as delivery_street, da.postal_code as delivery_postal_code, da.building as delivery_building,
                    da.first_name as delivery_first_name, da.last_name as delivery_last_name, da.phone_number as delivery_phone_number,
                    da.flat as delivery_flat, ua.city as user_city, ua.street as user_street, ua.postal_code as user_postal_code, ua.building as user_building,
                    ua.flat as user_flat, o.nip, o.company_name, p.main_image, p.name_pl as product_name, p.name_en as product_name_en, s.price, t.name_pl as type, t.id as type_id,
                    ao.name_pl as addon_option_name, ao.name_en as addon_option_name_en, a.name_pl as addon_name, a.name_en as addon_name_en 
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

const addOrder = async (user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, response) => {
    const id = uuidv4().substring(0, 6);
    let sellsIds = [];
    const query = 'INSERT INTO orders VALUES ($1, $2, $3, $4, $5, $6, 1, false, NOW(), $7, NULL, NULL)';
    const values = [id, user.id, userAddress, deliveryAddress, nip, companyName, shipping];

    // ADD ORDER
    await db.query(query, values, (err, res) => {
        if(res) {
            sells.forEach(async (item, index, array) => {
                const query = `INSERT INTO sells VALUES (nextval('sells_seq'), $1, $2, $3) RETURNING id`;
                const values = [item.product, id, item.price];

                // ADD SELLS
                if(index === array.length-1) {
                    await db.query(query, values, (err, res) => {
                        if(res) {
                            sellsIds.push(res.rows[0].id);

                            if(addons?.length) {
                                // ADD ADDONS
                                addons.forEach(async (item, indexParent, arrayParent) => {
                                    const options = item.options;
                                    const sellIndex = item.sell;

                                    console.log(sellsIds);

                                    await options.forEach(async (item, index, array) => {
                                        const query = 'INSERT INTO sells_addons VALUES ($1, $2)';
                                        const values = [sellsIds[sellIndex], item];

                                        if((index === array.length-1) && (indexParent === arrayParent.length-1)) {
                                            await db.query(query, values, (err, res) => {
                                                if(res) {
                                                    response.status(201);
                                                    response.send({id});
                                                }
                                                else {
                                                    console.log(err);
                                                    response.status(500).end();
                                                }
                                            });
                                        }
                                        else {
                                            dbInsertQuery(query, values);
                                        }
                                    });
                                });
                            }
                            else {
                                response.status(201);
                                response.send({id});
                            }
                        }
                        else {
                            console.log(err);
                            response.status(500).end();
                        }
                    });
                }
                else {
                    await db.query(query, values, (err, res) => {
                        if(res) {
                            sellsIds.push(res.rows[0].id);
                        }
                        else {
                            console.log(err);
                            response.status(500).end();
                        }
                    })
                }
            });
        }
        else {
            console.log(err);
            response.status(500).end();
        }
    })
}

router.post('/add', (request, response) => {
    let { user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons } = request.body;

    // userAddress, deliveryAddress: { street, building, flat, postal_code, city } or integer if already exists
    // sells: { product, price }
    // addons: { sell, options : [1, 2, 3] }

    if(sells && user && userAddress && deliveryAddress) {
        try {
            // ADD ADDRESSES IF NOT EXIST
            if(isNaN(userAddress)) {
                const ad = userAddress;
                const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5) RETURNING id`;
                const values = [ad.city, ad.postal_code, ad.street, ad.building, ad.flat];

                db.query(query, values, (err, res) => {
                    if(res?.rows) {
                        userAddress = res.rows[0].id;
                        if(isNaN(deliveryAddress)) {
                            const ad = deliveryAddress;
                            const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5) RETURNING id`;
                            const values = [ad.city, ad.postal_code, ad.street, ad.building, ad.flat];

                            db.query(query, values, (err, res) => {
                                if(res?.rows) {
                                    deliveryAddress = res.rows[0].id;
                                    addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, response);
                                }
                                else {
                                    console.log(err);
                                    response.status(500).end();
                                }
                            });
                        }
                        else {
                            addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, response);
                        }
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
                            addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, response);
                        }
                        else {
                            console.log(err);
                            response.status(500).end();
                        }
                    });
                }
                else {
                    console.log('YES');
                    addOrder(user, userAddress, deliveryAddress, nip, companyName, shipping, sells, addons, response);
                }
            }
        }
        catch(err) {
            console.log('order err');
            console.log(err)
        }
    }
    else {
        response.status(400).end();
    }
});

router.put('/change-status', (request, response) => {
    const { status, id } = request.body;

    const query = 'UPDATE orders SET status = $1 WHERE id = $2';
    const values = [status, id];

    dbInsertQuery(query, values, response);
});

router.get('/get-order-forms', (request, response) => {
    const id = request.query.id;

    const query = `SELECT ff.form, ff.form_data, ff.sell, p.name_pl as product FROM filled_forms ff
                    JOIN sells s ON ff.sell = s.id
                    JOIN orders o ON o.id = s.order
                    JOIN products p ON p.id = s.product
                    WHERE o.id = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.delete('/delete', (request, response) => {
    const id = request.query.id;

    const query = 'UPDATE orders SET hidden = TRUE WHERE id = $1';
    const values = [id];

    dbInsertQuery(query, values, response);
});

router.get('/get-order-statuses', (request, response) => {
   const query = 'SELECT * FROM order_statuses ORDER BY id';

   dbSelectQuery(query, [], response);
});

router.get('/get-form-details', (request, response) => {
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

router.get('/get-form-info', (request, response) => {
    const form = request.query.form;
    const sell = request.query.sell;
});

router.post('/set-status', (req, res) => {
    const { v1, v2, v3, v4, v5, v6, v7, v8 } = req.body;

    const q1 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 1';
    const q2 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 2';
    const q3 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 3';
    const q4 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 4';
    const q5 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 5';
    const q6 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 6';
    const q7 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 7';
    const q8 = 'UPDATE order_statuses SET name_pl = $1 WHERE id = 8';

    console.log(req.body);

    db.query(q1, [v1]);
    db.query(q2, [v2]);
    db.query(q3, [v3]);
    db.query(q4, [v4]);
    db.query(q5, [v5]);
    db.query(q6, [v6]);
    db.query(q7, [v7]);
    db.query(q8, [v8]);
});

router.get('/get-number-of-first-type-forms-by-order', (request, response) => {
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

router.get('/get-number-of-second-type-forms-by-order', (request, response) => {
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

router.post('/pay', (request, response) => {
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
                                    title: `Płatność za zakupy w sklepie AnnaVinbotti`,
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
                                    console.log(err);
                                })
                        }
                        else {
                            // traditional transfer
                            response.status(201).end();
                        }
                    }
                    else {
                        console.log(err);
                        response.status(500).end();
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
            const privateKey = '25d19e0b0b4ec0ba989c94ddabc161d468d6ae1f05f0c7d4cf38a915bd68326d';

            const ownSignature = crypto.createHash(alg).update(JSON.stringify(body) + process.env.IMOJE_SHOP_KEY).digest('hex');

            // db.query(`INSERT INTO images VALUES (501, $1, 29)`, [`${ownSignature} and ${signature}`]);

            // TODO: add verification
            // if(ownSignature === signature) {
                const query = `UPDATE orders SET status = 4 WHERE id = $1`;
                const values = [body.transaction.orderId];

                db.query(query, values, (err, res) => {
                   if(res) {
                       response.status(200).send({
                           status: 'ok'
                       });
                   }
                });
            // }
        }
        catch(err) {
            response.status(500).end();
        }
    }
    else {
        response.status(400).end();
    }
});

module.exports = router;
