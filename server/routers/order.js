const express = require("express");
const router = express.Router();
const db = require("../database/db");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/all', (request, response) => {
   const query = `SELECT o.id, u.first_name, u.last_name, o.date FROM orders o JOIN users u ON o.user = u.id WHERE hidden = FALSE`;

   dbSelectQuery(query, [], response);
});

router.get('/', (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = `SELECT o.id, o.date, u.first_name, u.last_name, u.email, u.phone_number, 
                    o.status, da.city as delivery_city, da.street as delivery_street, da.postal_code as delivery_postal_code, da.building as delivery_building,
                    da.flat as delivery_flat, ua.city as user_city, ua.street as user_street, ua.postal_code as user_postal_code, ua.building as user_building,
                    ua.flat as user_flat, o.nip, o.company_name, p.name_pl as product_name, p.price, t.name_pl as type, 
                    ao.name_pl as addon_option_name, a.name_pl as addon_name 
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

router.post('/add', (request, response) => {
    const { user, userAddress, deliveryAddress, nip, companyName } = request.body;
    const id = uuidv4();
    const query = 'INSERT INTO orders VALUES ($1, $2, $3, $4, $5, $6, 1)';
    const values = [id, user, userAddress, deliveryAddress, nip, companyName];

    dbInsertQuery(query, values, response);
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
   const query = 'SELECT * FROM order_statuses';

   dbSelectQuery(query, [], response);
});

module.exports = router;
