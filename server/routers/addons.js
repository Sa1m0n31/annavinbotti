const express = require("express");
const router = express.Router();
const db = require("../database/db");
const got = require('got');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/addons' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.post('/add', upload.single('image'), (request, response) => {
   const { namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, type } = request.body;

   let filename = null;
   if(request.file) {
       filename = request.file.filename;
   }

   const query = `INSERT INTO addons VALUES (nextval('addons_seq'), $1, $2, $3, $4, $5, $6, $7, $8, FALSE) RETURNING id`;
   const values = [namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, filename, type];

   db.query(query, values, (err, res) => {
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

router.patch('/update', upload.single('image'), (request, response) => {
   const { id, namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, image, type } = request.body;

   let query, values;
   if(request.file) {
       const filename = request.file.filename;
       query = 'UPDATE addons SET name_pl = $1, name_en = $2, info_pl = $3, info_en = $4, tooltip_pl = $5, tooltip_en = $6, image = $7, addon_type = $8 WHERE id = $9';
       values = [namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, filename, type, id];
   }
   else {
       query = 'UPDATE addons SET name_pl = $1, name_en = $2, info_pl = $3, info_en = $4, tooltip_pl = $5, tooltip_en = $6, addon_type = $7 WHERE id = $8';
       values = [namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, type, id];
   }

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

router.get('/get-all-addons-options', (request, response) => {
    const query = 'SELECT a.id as addon_id, a.name_pl as addon_name, ao.name_pl as addon_option_name, ao.id FROM addons_options ao JOIN addons a ON ao.addon = a.id WHERE ao.hidden = FALSE AND a.hidden = FALSE';

    dbSelectQuery(query, [], response);
});

router.get('/get-addons-by-product', (request, response) => {
    const id = request.query.id;

    const query = `SELECT a.id, a.name_pl as addon_name, afp.priority, afp.show_if, afp.is_equal  
                    FROM addons a 
                    LEFT OUTER JOIN addons_for_products afp ON afp.addon = a.id 
                    WHERE afp.product = $1`;
    const values = [id];

    dbSelectQuery(query, values, response);
});

router.get('/all', (request, response) => {
   const query = 'SELECT * FROM addons WHERE hidden = FALSE ORDER BY id';

   dbSelectQuery(query, [], response);
});

router.get('/all-options', (request, response) => {
    const query = 'SELECT * FROM addons_options WHERE hidden = FALSE ORDER BY addon';

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

        const queryForOptions = 'UPDATE addons_options SET hidden = TRUE WHERE addon = $1';

        db.query(query, values, (err, res) => {
           if(res) {
               dbInsertQuery(queryForOptions, values, response);
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
