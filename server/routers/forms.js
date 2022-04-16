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
    const query = `SELECT id, title_pl, type FROM forms
                    WHERE hidden = FALSE`;

    dbSelectQuery(query, [], response);
});

router.get('/', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = `SELECT f.id, f.title_pl, f.type, i.question_pl, i.question_en, i.placeholder_pl, i.placeholder_en,
                    fso.input as select_input_id, fso.option 
                    FROM forms f 
                    JOIN form_inputs fi ON f.id = fi.form 
                    JOIN inputs i ON fi.input = i.id 
                    JOIN form_select_options fso ON i.id = fso.input 
                    WHERE f.hidden = FALSE AND i.hidden = FALSE`;
        const values = [id];

        dbSelectQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.delete('/delete-input', (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = 'UPDATE inputs SET hidden = TRUE WHERE id = $1';
       const values = [id];

       dbInsertQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

router.get('/filled-form-for-order', (request, response) => {
   const id = request.query.id;

   if(id) {
       const query = `SELECT p.name_pl as product, f.title_pl as form_name, ff.form_data 
                      FROM filled_forms ff 
                      JOIN forms f ON ff.form = f.id 
                      JOIN sells s ON ff.sell = s.id 
                      JOIN products p ON s.product = p.id 
                      JOIN orders ON s.order = o.id 
                      WHERE o.id = $1`;
       const values = [id];

       dbSelectQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

module.exports = router;
