const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/addons' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.post('/add', (request, response) => {
   const { addonName, addonType } = request.body;

   const query = `INSERT INTO addons VALUES (nextval('addons_seq'), $1, $2) RETURNING id`;
   const values = [addonName, addonType];

   dbInsertQuery(query, values, response);
});

router.post('/add-option', upload.single('image'), (request, response) => {
    const { addon, option, color } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;

        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3)`;
        const values = [addon, option, filename];

        dbInsertQuery(query, values, response);
    }
    else if(color) {
        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3)`;
        const values = [addon, option, color];

        dbInsertQuery(query, values, response);
    }
    else {
        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, NULL)`;
        const values = [addon, option]

        dbInsertQuery(query, values, response);
    }
});

router.patch('/update', (request, response) => {
   const { id, name, type } = request.body;

   const query = 'UPDATE addons SET name = $1, type = $2 WHERE id = $3';
   const values = [name, type, id];

   dbInsertQuery(query, values, response);
});

router.patch('/update-addon', upload.single("image"), (request, response) => {
    const { id, addon, option, color } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;

        const query = `UPDATE addons_options SET addon = $1, name = $2, image = $3 WHERE id = $4`;
        const values = [addon, option, filename, id];

        dbInsertQuery(query, values, response);
    }
    else if(color) {
        const query = `UPDATE addons_options SET addon = $1, name = $2, image = $3 WHERE id = $4`;
        const values = [addon, option, color, id];

        dbInsertQuery(query, values, response);
    }
    else {
        const query = `UPDATE addons_options SET addon = $1, name = $2, image = NULL WHERE id = $4`;
        const values = [addon, option, id];

        dbInsertQuery(query, values, response);
    }
});

router.get('/get-options-by-addon', (request, response) => {
   const id = request.query.id;

   const query = 'SELECT ao.id, ao.name, ao,image FROM addons_options ao JOIN addons a ON a.id = ao.addon WHERE a.id = $1';
   const values = [id];

   dbSelectQuery(query, values, response);
});

router.get('/get-addons-by-product', (request, response) => {
    const id = request.query.id;

    const query = `SELECT a.name as addon_name, ao.name as option_name, ao.image as option_image 
                    FROM addons a 
                    LEFT OUTER JOIN addons_options ao ON a.id = ao.addon 
                    LEFT OUTER JOIN addons_for_products afp ON afp.option = ao.id 
                    WHERE afp.product = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.get('/all', (request, response) => {
   const query = 'SELECT * FROM addons WHERE hidden = FALSE';

   dbSelectQuery(query, [], response);
});

router.get('/all-options', (request, response) => {
    const query = 'SELECT * FROM addons_options WHERE hidden = FALSE';

    dbSelectQuery(query, [], response);
});

router.get('/get', (request, response) => {
   const id = request.query.id;

   const query = 'SELECT * FROM addons WHERE id = $1 AND hidden = FALSE';
   const values = [id];

   dbSelectQuery(query, values, response);
});

router.get('/get-option', (request, response) => {
    const id = request.query.id;

    const query = 'SELECT * FROM addons_options WHERE id = $1 AND hidden = FALSE';
    const values = [id];

    dbSelectQuery(query, values, response);
});

module.exports = router;
