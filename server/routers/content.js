const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer  = require('multer')
const upload = multer({ dest: 'media/blog' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/get-terms-pl', (request, response) => {
   const query = `SELECT field, value_pl FROM content WHERE field = 'terms_of_service' OR field='privacy_policy'`;

   dbSelectQuery(query, [], response);
});

router.get('/get-terms-en', (request, response) => {
    const query = `SELECT field, value_en FROM content WHERE field = 'terms_of_service' OR field='privacy_policy'`;

    dbSelectQuery(query, [], response);
});

router.put('/update-terms-pl', (request, response) => {
   const { terms, policy } = request.body;

   const query = `UPDATE content SET value_pl = CASE
                   WHEN field = 'terms_of_service' THEN $1
                   WHEN field = 'privacy_policy' THEN $2
                   END WHERE field IN ('terms_of_service','privacy_policy')`;
   const values = [terms, policy];

    dbInsertQuery(query, values, response);
});

router.put('/update-terms-en', (request, response) => {
    const { terms, policy } = request.body;

    const query = `UPDATE content SET value_en = CASE
                   WHEN field = 'terms_of_service' THEN $1
                   WHEN field = 'privacy_policy' THEN $2
                   END WHERE field IN ('terms_of_service','privacy_policy')`;
    const values = [terms, policy];

    dbInsertQuery(query, values, response);
});

router.get('/get-newsletter-stats', (request, response) => {
   const query = 'SELECT COUNT(*) as counter FROM newsletter WHERE active = TRUE';

   dbSelectQuery(query, [], response);
});

router.get('/get-orders-stats', (request, response) => {
    const query = 'SELECT COUNT(*) as counter FROM orders';

    dbSelectQuery(query, [], response);
});

router.get('/get-clients-stats', (request, response) => {
   const query = 'SELECT COUNT(*) as counter FROM users WHERE active = TRUE';

   dbSelectQuery(query, [], response);
});

router.get('/get-products-stats', (request, response) => {
   const query = 'SELECT COUNT(*) as counter FROM products WHERE hidden = FALSE';

   dbSelectQuery(query, [], response);
});

router.get('/get-blog-stats', (request, response) => {
    const query = 'SELECT COUNT(*) as counter FROM articles WHERE hidden = FALSE';

    dbSelectQuery(query, [], response);
});

router.get('/get-waitlist-stats', (request, response) => {
    const query = 'SELECT COUNT(*) as counter FROM waitlist';

    dbSelectQuery(query, [], response);
});


module.exports = router;
