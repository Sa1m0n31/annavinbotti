const express = require("express");
const router = express.Router();
const db = require("../database/db");
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

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
                                  response.send({
                                      result: 1
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

module.exports = router;
