const express = require("express");
const router = express.Router();
const db = require("../database/db");
const got = require('got');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/addons' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.post('/add', (request, response) => {
   const { namePl, nameEn, type, options } = request.body;

   const query = `INSERT INTO addons VALUES (nextval('addons_seq'), $1, $2, $3, FALSE) RETURNING id`;
   const values = [namePl, nameEn, type];

   db.query(query, values, (err, res) => {
       console.log(err);
       if(res) {
           if(res.rows) {
               const id = res.rows[0].id;
               if(id) {
                   response.status(201);
                   response.send({
                       result: id
                   });
               }
               else {
                   response.status(500).end();
               }
           }
           else {
               response.status(500).end();
           }
       }
       else {
           response.status(500).end();
       }
   })
});

router.post('/add-option', upload.single('image'), (request, response) => {
    const { addon, namePl, nameEn, color, oldImage } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;

        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3, $4, FALSE)`;
        const values = [namePl, nameEn, addon, filename];

        dbInsertQuery(query, values, response);
    }
    else if(oldImage && oldImage?.toString() !== 'null') {
        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3, $4, FALSE)`;
        const values = [namePl, nameEn, addon, oldImage];

        dbInsertQuery(query, values, response);
    }
    else if(color) {
        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3, $4, FALSE)`;
        const values = [namePl, nameEn, addon, color];

        dbInsertQuery(query, values, response);
    }
    else {
        const query = `INSERT INTO addons_options VALUES (nextval('addons_options_seq'), $1, $2, $3, NULL, FALSE)`;
        const values = [namePl, nameEn, addon]

        dbInsertQuery(query, values, response);
    }
});

router.patch('/update', (request, response) => {
   const { id, namePl, nameEn, type } = request.body;

   const query = 'UPDATE addons SET name_pl = $1, name_en = $2, addon_type = $3 WHERE id = $4';
   const values = [namePl, nameEn, type, id];

   dbInsertQuery(query, values, response);
});

router.patch('/update-option', upload.single("image"), (request, response) => {
    const { id, addon, namePl, nameEn, color } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;

        const query = `UPDATE addons_options SET addon = $1, name_pl = $2, name_en = $3, image = $4 WHERE id = $5`;
        const values = [addon, namePl, nameEn, filename, id];

        dbInsertQuery(query, values, response);
    }
    else if(color) {
        const query = `UPDATE addons_options SET addon = $1, name_pl = $2, name_en = $3, image = $4 WHERE id = $5`;
        const values = [addon, namePl, nameEn, color, id];

        dbInsertQuery(query, values, response);
    }
    else {
        const query = `UPDATE addons_options SET addon = $1, name_pl = $2, name_en = $3, image = NULL WHERE id = $4`;
        const values = [addon, namePl, nameEn, id];

        dbInsertQuery(query, values, response);
    }
});

router.get('/get-options-by-addon', (request, response) => {
   const id = request.query.id;

   const query = `SELECT ao.id, ao.name_pl, ao.name_en, ao.image 
                    FROM addons_options ao 
                    JOIN addons a ON a.id = ao.addon 
                    WHERE a.id = $1 AND ao.hidden = FALSE 
                    ORDER BY ao.id`;
   const values = [id];

   dbSelectQuery(query, values, response);
});

router.get('/get-addons-by-product', (request, response) => {
    const id = request.query.id;

    const query = `SELECT a.id, a.name_pl as addon_name, ao.name_pl as option_name, ao.image as option_image 
                    FROM addons a 
                    LEFT OUTER JOIN addons_options ao ON a.id = ao.addon 
                    LEFT OUTER JOIN addons_for_products afp ON afp.option = ao.id 
                    WHERE afp.product = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.get('/all', (request, response) => {
   const query = 'SELECT * FROM addons WHERE hidden = FALSE ORDER BY id';

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

router.delete('/delete', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'UPDATE addons SET hidden = TRUE WHERE id = $1';
        const values = [id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.delete('/delete-addon-options', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'UPDATE addons_options SET hidden = TRUE WHERE addon = $1';
        const values = [id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

module.exports = router;
