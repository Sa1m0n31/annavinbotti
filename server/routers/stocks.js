const express = require("express");
const router = express.Router();
const db = require("../database/db");
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const emailTemplate = require("./others").emailTemplate;

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

const checkWaitlists = (response) => {
    const query = `SELECT p.id, s.counter, w.email, (SELECT COUNT(*)
                    FROM addons_for_products afp
                    LEFT OUTER JOIN addons_options ao ON afp.addon = ao.addon
                    LEFT OUTER JOIN addons_stocks ad_stocks ON ad_stocks.addon_option = ao.id
                    LEFT OUTER JOIN stocks s ON s.id = ad_stocks.stock
                    WHERE afp.product = p.id AND ao.hidden = FALSE AND s.counter <= 0) as addons_not_available
                    FROM products p 
                    JOIN products_stocks ps ON ps.product = p.id
                    JOIN stocks s ON s.id = ps.stock 
                    JOIN waitlist w ON w.product = p.id
                    WHERE p.hidden = FALSE AND s.counter > 0`;

    console.log('checking waitlists');

    db.query(query, [], async (err, res) => {
        if(res) {
            let emails = res.rows;
            if(emails) {
                const waitlistRowsToDelete = emails.filter((item) => {
                    return parseInt(item.addons_not_available) === 0;
                });

                console.log(waitlistRowsToDelete);

                emails = await emails.filter((item) => {
                    return parseInt(item.addons_not_available) === 0;
                }).map((item) => {
                    return item.email;
                });

                if(emails?.length) {
                    let mailOptions = {
                        from: process.env.EMAIL_ADDRESS,
                        to: [],
                        bcc: emails,
                        subject: 'Twój produkt jest już dostępny!',
                        html: emailTemplate('Dobra wiadomość!',
                            'Twój produkt jest już dostępny w naszym sklepie. Wejdź w poniższy link i zarezerwuj:',
                            `${process.env.API_URL}/sklep`,
                            'Przejdź do sklepu'
                        )
                    }

                    await transporter.sendMail(mailOptions, function(error, info) {
                        console.log(error);
                        if(error) {
                            response.status(500).end();
                        }
                        else {
                            waitlistRowsToDelete.forEach(async (item, index, array) => {
                                const query = 'DELETE FROM waitlist WHERE product = $1 AND email = $2';
                                const values = [item.id, item.email];

                                if(index === array.length-1) {
                                    await dbInsertQuery(query, values, response);
                                }
                                else {
                                    await dbInsertQuery(query, values);
                                }
                            })
                        }
                    });
                }
                else {
                    response.status(201).end();
                }
            }
        }
    });
}

router.get('/get-all-stocks', (request, response) => {
    const query = `SELECT * FROM stocks`;

    dbSelectQuery(query, [], response);
});

router.get('/get-all-products-stocks', (request, response) => {
   const query = `SELECT s.id, s.name, s.counter FROM stocks s JOIN products_stocks ps ON s.id = ps.stock GROUP BY(s.id, s.name, s.counter)`;

   dbSelectQuery(query, [], response);
});

router.get('/get-all-addons-stocks', (request, response) => {
    const query = `SELECT s.id, s.name, s.counter FROM stocks s JOIN addons_stocks ast ON s.id = ast.stock GROUP BY(s.id, s.name, s.counter)`;

    dbSelectQuery(query, [], response);
});

router.get('/get-product-stock-details', (request, response) => {
   const id = request.query.id;

   const query = `SELECT s.id, p.id as product_id, s.name, s.counter, p.name_pl as product_name
                    FROM stocks s
                    JOIN products_stocks ps ON s.id = ps.stock
                    JOIN products p ON ps.product = p.id
                    WHERE s.id = $1`;
   const values = [parseInt(id)];

   dbSelectQuery(query, values, response);
});

router.get('/get-addon-stock-details', (request, response) => {
    const id = request.query.id;

    const query = `SELECT s.id, s.name, s.counter, ao.name_pl as addon_option_name, a.name_pl as addon_name, ao.id as product_id
                    FROM stocks s
                    JOIN addons_stocks ast ON s.id = ast.stock
                    JOIN addons_options ao ON ast.addon_option = ao.id
                    JOIN addons a ON ao.addon = a.id
                    WHERE s.id = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.get('/check-products-stocks', (request, response) => {
    let products = request.query.products
    let excludeStock = request.query.stock;

    if(products) {
        const query = `SELECT * FROM products_stocks WHERE product = ANY ('{${products}}'::int[]) AND stock != $1`;
        const values = [excludeStock];

        try {
            db.query(query, values, (err, res) => {
                if(res) {
                    if(res.rowCount) {
                        response.send({
                            result: 0
                        });
                    }
                    else {
                        response.send({
                            result: 1
                        });
                    }
                }
                else {
                    response.status(500).end();
                }
            });
        }
        catch {
            response.status(500).end();
        }
    }
    else {
        response.status(400).end();
    }
});

router.get('/check-addons-stocks', (request, response) => {
    let options = request.query.options;
    let excludeStock = request.query.stock;

    if(options) {
        const query = `SELECT * FROM addons_stocks WHERE addon_option = ANY ('{${options}}'::int[]) AND stock != $1`;
        const values = [excludeStock];

        try {
            db.query(query, values, (err, res) => {
                if(res) {
                    if(res.rowCount) {
                        response.send({
                            result: 0
                        });
                    }
                    else {
                        response.send({
                            result: 1
                        });
                    }
                }
                else {
                    response.status(500).end();
                }
            });
        }
        catch {
            response.status(500).end();
        }
    }
    else {
        response.status(400).end();
    }
});

router.post('/add-product-stock', (request, response) => {
   const { stockName, counter, products } = request.body;

   if(products) {
       const productsArray = products.split(';');

       const query = `INSERT INTO stocks VALUES (nextval('stocks_seq'), $1, $2) RETURNING id`;
       const values = [counter, stockName];

       try {
           db.query(query, values, (err, res) => {
               if(res) {
                   const stockId = res.rows[0].id;

                   const query = 'INSERT INTO products_stocks VALUES ($1, $2)';
                   let values = [];

                   JSON.parse(productsArray).forEach(async (item, index, array) => {
                       values = [parseInt(item), stockId];

                       if(index === array.length-1) {
                           db.query(query, values, (err, res) => {
                              if(res) {
                                  checkWaitlists(response);
                              }
                              else {
                                  if(parseInt(err?.code) === 23505) {
                                      response.status(503).end();
                                  }
                                  else {
                                      response.status(500).end();
                                  }
                              }
                           })
                               ?.catch((err) => {
                                   if(parseInt(err.code) === 23505) {
                                       response.status(503).end();
                                   }
                               });
                       }
                       else {
                           await db.query(query, values)
                               ?.catch((err) => {
                                   if(parseInt(err.code) === 23505) {
                                       response.status(503).end();
                                   }
                               });
                       }
                   });
               }
               else {
                   response.status(500).end();
               }
           });
       }
       catch(err) {
           console.log(err);
           response.status(500).end();
       }
   }
   else {
       response.status(400).end();
   }
});

router.post('/add-addons-stock', (request, response) => {
    const { stockName, counter, addonsOptions } = request.body;

    if(addonsOptions) {
        const addonsOptionsArray = addonsOptions.split(';');

        const query = `INSERT INTO stocks VALUES (nextval('stocks_seq'), $1, $2) RETURNING id`;
        const values = [counter, stockName];

        try {
            db.query(query, values, (err, res) => {
                if(res) {
                    const stockId = res.rows[0].id;

                    const query = 'INSERT INTO addons_stocks VALUES ($1, $2)';
                    let values = [];

                    JSON.parse(addonsOptionsArray).forEach(async (item, index, array) => {
                        values = [parseInt(item), stockId];

                        if(index === array.length-1) {
                            db.query(query, values, (err, res) => {
                                if(res) {
                                    checkWaitlists(response);
                                }
                                else {
                                    if(parseInt(err?.code) === 23505) {
                                        response.status(503).end();
                                    }
                                    else {
                                        response.status(500).end();
                                    }
                                }
                            })
                                ?.catch((err) => {
                                    if(parseInt(err.code) === 23505) {
                                        response.status(503).end();
                                    }
                                });
                        }
                        else {
                            await db.query(query, values)
                                ?.catch((err) => {
                                    if(parseInt(err.code) === 23505) {
                                        response.status(503).end();
                                    }
                                });
                        }
                    });
                }
                else {
                    response.status(500).end();
                }
            });
        }
        catch(err) {
            response.status(500).end();
        }
    }
    else {
        response.status(400).end();
    }
});

router.delete('/delete-product-stock', (request, response) => {
    const stockId = request.query.id;

    const query = 'DELETE FROM products_stocks WHERE stock = $1';
    const values = [stockId];

    db.query(query, values, (err, res) => {
       if(res) {
           const query = 'DELETE FROM stocks WHERE id = $1';

           db.query(query, values, (err, res) => {
                if(res) {
                    checkWaitlists(response);
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
});

router.delete('/delete-addon-stock', (request, response) => {
    const stockId = request.query.id;

    const query = 'DELETE FROM addons_stocks WHERE stock = $1';
    const values = [stockId];

    db.query(query, values, (err, res) => {
        if(res) {
            const query = 'DELETE FROM stocks WHERE id = $1';

            db.query(query, values, (err, res) => {
                if(res) {
                    checkWaitlists(response);
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
});

router.put('/update-stock-counter', (request, response) => {
    const { stockId, counter } = request.body;

    const query = 'UPDATE stocks SET counter = $1 WHERE id = $2';
    const values = [counter, stockId];

    db.query(query, values, (err, res) => {
        if(res) {
            checkWaitlists(response);
        }
        else {
            response.status(500).end();
        }
    });
});

router.put('/decrement-stock-by-id', (request, response) => {
    const { stockId, decrement } = request.body;

    let query, values;

    if(decrement) {
        query = 'UPDATE stocks SET counter = counter - $1 WHERE id = $2';
        values = [decrement, stockId];
    }
    else {
        query = 'UPDATE stocks SET counter = counter - 1 WHERE id = $1';
        values = [stockId];
    }

    db.query(query, values, (err, res) => {
        if(res) {
            response.status(201).end();
        }
        else {
            response.status(500).end();
        }
    });
});

router.put('/decrement-stock-by-product', (request, response) => {
    const { product, decrement } = request.body;

    let query, values;

    if(decrement) {
        query = `UPDATE stocks s
                SET counter = counter - $1
                FROM products_stocks ps
                WHERE s.id = ps.stock AND ps.product = $2`;
        values = [decrement, product];
    }
    else {
        query = `UPDATE stocks s
                SET counter = counter - 1
                FROM products_stocks ps
                WHERE s.id = ps.stock AND ps.product = $1`;
        values = [product];
    }

    db.query(query, values, (err, res) => {
        if(res) {
            checkWaitlists(response);
        }
        else {
            response.status(500).end();
        }
    });
});

router.put('/decrement-stock-by-addon', (request, response) => {
    const { addonOption, decrement } = request.body;

    let query, values;

    if(decrement) {
        query = `UPDATE stocks s
                SET counter = counter - $1
                FROM addons_stocks ast
                WHERE s.id = ast.stock AND ast.addon_option = $2`;
        values = [decrement, addonOption];
    }
    else {
        query = `UPDATE stocks s
                SET counter = counter - 1
                FROM addons_stocks ast
                WHERE s.id = ast.stock AND ast.addon_option = $1`;
        values = [addonOption];
    }

    db.query(query, values, (err, res) => {
        if(res) {
            checkWaitlists(response);
        }
        else {
            response.status(500).end();
        }
    });
});

router.get('/get-product-stock', (request, response) => {
    const id = request.query.id;

    const query = `SELECT MIN(s.counter) as product_counter, MIN(s2.counter) as addon_counter FROM stocks s
                    LEFT OUTER JOIN products_stocks ps ON s.id = ps.stock
                    JOIN products p ON p.id = ps.product
                    LEFT OUTER JOIN addons_for_products afp ON afp.product = p.id
                    LEFT OUTER JOIN addons a ON a.id = afp.addon
                    LEFT OUTER JOIN addons_options ao ON ao.addon = a.id
                    LEFT OUTER JOIN addons_stocks ad_s ON ad_s.addon_option = ao.id
                    LEFT OUTER JOIN stocks s2 ON s2.id = ad_s.stock
                    WHERE p.id = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
})

module.exports = router;
