const express = require("express");
const router = express.Router();
const db = require("../database/db");
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/get-all-products-stocks', (request, response) => {
   const query = `SELECT * FROM stocks s JOIN products_stocks ps ON s.id = ps.stock`;

   dbSelectQuery(query, [], response);
});

router.get('/get-all-addons-stocks', (request, response) => {
    const query = `SELECT * FROM stocks s JOIN addons_stocks as ON s.id = as.stock`;

    dbSelectQuery(query, [], response);
});

router.get('/get-product-stock-details', (request, response) => {
   const id = request.query.id;

   const query = `SELECT s.id, s.name, s.counter, p.name as product_name 
                    FROM stocks s 
                    JOIN products_stocks ps ON s.id = ps.stock 
                    JOIN products p ON ps.product = p.id  
                    WHERE s.id = $1`;
   const values = [id];

   dbSelectQuery(query, values, response);
});

router.get('/get-addon-stock-details', (request, response) => {
    const id = request.query.id;

    const query = `SELECT s.id, s.name, s.counter, ao.name as addon_option_name, a.name as addon_name  
                    FROM stocks s 
                    JOIN addons_stocks as ON s.id = as.stock 
                    JOIN addons_options ao ON as.addon_option = ao.id 
                    JOIN addons a ON ao.addon = a.id  
                    WHERE s.id = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.post('/add-product-stock', (request, response) => {
   const { stockName, counter, products } = request.body;

   if(products) {
       const productsArray = products.split(';');

       const query = 'INSERT INTO stocks VALUES (nextval("stocks_seq"), $1, $2) RETURNING id';
       const values = [stockName, counter];

       try {
           db.query(query, values, (err, res) => {
               if(res) {
                   const stockId = res.rows[0].id;

                   const query = 'INSERT INTO products_stocks VALUES ($1, $2)';
                   let values = [];

                   productsArray.forEach(async (item, index, array) => {
                       values = [parseInt(item), stockId];

                       if(index === array.length-1) {
                           db.query(query, values, (err, res) => {
                              if(res) {
                                  response.status(201).end();
                              }
                              else {
                                  response.status(500).end();
                              }
                           });
                       }
                       else {
                           await db.query(query, values);
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

router.post('/add-addons-stock', (request, response) => {
    const { stockName, counter, addonsOptions } = request.body;

    if(addonsOptions) {
        const addonsOptionsArray = addonsOptions.split(';');

        const query = 'INSERT INTO stocks VALUES (nextval("stocks_seq"), $1, $2) RETURNING id';
        const values = [stockName, counter];

        try {
            db.query(query, values, (err, res) => {
                if(res) {
                    const stockId = res.rows[0].id;

                    const query = 'INSERT INTO addons_stocks VALUES ($1, $2)';
                    let values = [];

                    addonsOptionsArray.forEach(async (item, index, array) => {
                        values = [parseInt(item), stockId];

                        if(index === array.length-1) {
                            db.query(query, values, (err, res) => {
                                if(res) {
                                    response.status(201).end();
                                }
                                else {
                                    response.status(500).end();
                                }
                            });
                        }
                        else {
                            await db.query(query, values);
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
                    response.status(201).end();
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
                    response.status(201).end();
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
            response.status(201).end();
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
            response.status(201).end();
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
                FROM addons_stocks as  
                WHERE s.id = as.stock AND as.addon_option = $2`;
        values = [decrement, addonOption];
    }
    else {
        query = `UPDATE stocks s 
                SET counter = counter - 1 
                FROM addons_stocks as  
                WHERE s.id = as.stock AND as.addon_option = $1`;
        values = [addonOption];
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

module.exports = router;
