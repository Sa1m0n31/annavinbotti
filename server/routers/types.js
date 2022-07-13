const express = require("express");
const router = express.Router();
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/all', (request, response) => {
   const query = 'SELECT * FROM types WHERE hidden = FALSE';

   dbSelectQuery(query, [], response);
});

router.get('/get', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'SELECT * FROM types WHERE id = $1 AND hidden = FALSE';
        const values = [id];

        dbSelectQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.post('/add', (request, response) => {
    const { namePl, nameEn } = request.body;

    if(namePl && nameEn) {
        const query = `INSERT INTO types VALUES (nextval('type_seq'), $1, $2, FALSE)`;
        const values = [namePl, nameEn];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.put('/update', (request, response) => {
    const { id, namePl, nameEn } = request.body;

    if(id) {
        const query = 'UPDATE types SET name_pl = $1, name_en = $2 WHERE id = $3';
        const values = [namePl, nameEn, id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.delete('/delete', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'UPDATE types SET hidden = TRUE WHERE id = $1';
        const values = [id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.get('/get-type-by-product', (request, response) => {
   const id = request.query.id;

   if(!id) {
       response.status(400).end();
   }
   else {
       const query = 'SELECT type FROM products WHERE id = $1';
       const values = [id];

       dbSelectQuery(query, values, response);
   }
});

module.exports = router;
