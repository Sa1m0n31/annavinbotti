const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer  = require('multer')
const upload = multer({ dest: 'media/blog' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/get-field', (request, response) => {
    const field = request.query.field;

    const query = `SELECT * FROM content WHERE field = $1`;
    const values = [field];

    dbSelectQuery(query, values, response);
});

router.get('/get-terms-pl', (request, response) => {
   const query = `SELECT field, value_pl FROM content WHERE field = 'terms_of_service' OR field='privacy_policy'
        OR field='page_1' OR field='page_2' OR field='page_3' OR field='page_4' OR field='page_5' OR
         field='page_6' OR field='page_7' OR field='page_8' OR field='page_9' OR field='page_10'
   `;

   dbSelectQuery(query, [], response);
});

router.get('/get-terms-en', (request, response) => {
    const query = `SELECT field, value_en FROM content WHERE field = 'terms_of_service' OR field='privacy_policy'
        OR field='page_1' OR field='page_2' OR field='page_3' OR field='page_4' OR field='page_5' OR
         field='page_6' OR field='page_7' OR field='page_8' OR field='page_9' OR field='page_10'
    `;

    dbSelectQuery(query, [], response);
});

router.put('/update-terms-pl', (request, response) => {
   const { terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11 } = request.body;

   const query = `UPDATE content SET value_pl = CASE
                   WHEN field = 'terms_of_service' THEN $1
                   WHEN field = 'privacy_policy' THEN $2
                   WHEN field = 'page_1' THEN $3
                   WHEN field = 'page_2' THEN $4
                   WHEN field = 'page_3' THEN $5
                   WHEN field = 'page_4' THEN $6
                   WHEN field = 'page_5' THEN $7
                   WHEN field = 'page_6' THEN $8
                   WHEN field = 'page_7' THEN $9
                   WHEN field = 'page_8' THEN $10
                   WHEN field = 'page_9' THEN $11
                   WHEN field = 'page_10' THEN $12
                   WHEN field = 'page_11' THEN $13
                   END WHERE field IN ('terms_of_service','privacy_policy', 'page_1', 'page_2', 'page_3', 'page_4', 'page_5',
                     'page_6', 'page_7', 'page_8', 'page_9', 'page_10', 'page_11')`;
   const values = [terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11];

    dbInsertQuery(query, values, response);
});

router.put('/update-terms-en', (request, response) => {
    const { terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11 } = request.body;

    const query = `UPDATE content SET value_en = CASE
                   WHEN field = 'terms_of_service' THEN $1
                   WHEN field = 'privacy_policy' THEN $2
                   WHEN field = 'page_1' THEN $3
                   WHEN field = 'page_2' THEN $4
                   WHEN field = 'page_3' THEN $5
                   WHEN field = 'page_4' THEN $6
                   WHEN field = 'page_5' THEN $7
                   WHEN field = 'page_6' THEN $8
                   WHEN field = 'page_7' THEN $9
                   WHEN field = 'page_8' THEN $10
                   WHEN field = 'page_9' THEN $11
                   WHEN field = 'page_10' THEN $12
                   WHEN field = 'page_11' THEN $13
                   END WHERE field IN ('terms_of_service','privacy_policy', 'page_1', 'page_2', 'page_3', 'page_4', 'page_5',
                     'page_6', 'page_7', 'page_8', 'page_9', 'page_10', 'page_11')`;
    const values = [terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11];

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

router.get('/get-faq', (request, response) => {
   const query = `SELECT * FROM content WHERE field = 'faq'`;

   dbSelectQuery(query, [], response);
});

router.post('/update-faq', (request, response) => {
   const { content } = request.body;

   const query = `UPDATE content SET value_pl = $1 WHERE field = 'faq'`;
   const values = [content];

   dbInsertQuery(query, values, response);
});


module.exports = router;
