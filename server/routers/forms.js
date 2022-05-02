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

router.post('/add-input', (request, response) => {
   const { type, question, placeholder } = request.body;

   if(question) {
       const query = `INSERT INTO inputs VALUES(nextval('inputs_seq'), $1, $2, $3)`;
       const values = [type, question, placeholder];

       dbInsertQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

router.post('/add', (request, response) => {
   const { title, type, inputs } = request.body;

   if(title && type && inputs) {
       /* Add form to FORMS table */
       const query = `INSERT INTO forms VALUES(nextval('forms_seq'), $1, $2) RETURNING id`;
       const values = [title, type];

       db.query(query, values, (err, res) => {
          if(res) {
              if(res.rows) {
                  /* Add inputs to FORM_INPUTS table */
                  const formId = res.rows[0].id;
                  const inputsArray = inputs.split(';');
                  inputsArray.forEach(async (item, index, array) => {
                      const query = `INSERT INTO form_inputs VALUES ($1, $2)`;
                      const values = [formId, parseInt(item)];

                      await db.query(query, values, (err, res) => {
                          if(res) {
                              if(index === array.length - 1) {
                                  response.status(201).end();
                              }
                          }
                          else {
                              response.status(500).end();
                          }
                      });
                  });
              }
              else {
                  response.status(500).end();
              }
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

router.patch('/update', (request, response) => {
   const { id, type, title, inputs } = request.body;

   if(type && title && inputs) {
       /* Update form in FORMS table */
       const query = 'UPDATE forms SET title = $1, type = $2 WHERE id = $3';
       const values = [title, type, id];

       db.query(query, values, (err, res) => {
          if(res) {
              /* Delete previous inputs from FORM_INPUTS table */
              const query = 'DELETE FROM form_inputs WHERE form = $1';
              const values = [id];

              db.query(query, values, (err, res) => {
                  /* Add inputs to FORM_INPUTS table */
                  const formId = res.rows[0].id;
                  const inputsArray = inputs.split(';');
                  inputsArray.forEach(async (item, index, array) => {
                      const query = `INSERT INTO form_inputs VALUES ($1, $2)`;
                      const values = [formId, parseInt(item)];

                      await db.query(query, values, (err, res) => {
                          if(res) {
                              if(index === array.length - 1) {
                                  response.status(201).end();
                              }
                          }
                          else {
                              response.status(500).end();
                          }
                      });
                  });
              });
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

router.patch('/update-input', (request, response) => {
   const { id, type, question, placeholder } = request.body;

   if(id && type && question) {
       const query = `UPDATE inputs SET type = $1, question = $2, placeholder = $3 WHERE id = $4`;
       const values = [type, question, placeholder, id];

       dbInsertQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

router.delete('/delete', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'UPDATE forms SET hidden = TRUE WHERE id = $1';
        const values = [id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

module.exports = router;
