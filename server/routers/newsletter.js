const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer  = require('multer')
const upload = multer({ dest: 'media/blog' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const emailTemplate = require("./others").emailTemplate;
const { v4: uuidv4 } = require('uuid');

let transporter = nodemailer.createTransport(smtpTransport ({
   auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
   },
   host: process.env.EMAIL_HOST,
   secureConnection: true,
   port: 465,
   tls: {
      rejectUnauthorized: false
   },
}));

router.get('/', (request, response) => {
   const query = 'SELECT * FROM newsletter WHERE active = TRUE';

   dbSelectQuery(query, [], response);
});

router.post('/verify', (request, response) => {
   const { token } = request.body;

   const query = `SELECT email FROM newsletter_verification WHERE token = $1`;
   const values = [token];

   db.query(query, values, (err, res) => {
      if(res?.rows?.length) {
         const email = res.rows[0].email;
         const deleteToken = uuidv4();
         const query = 'INSERT INTO newsletter_delete VALUES ($1, $2)';
         const values = [email, deleteToken];

         db.query(query, values, (err, res) => {
            if(res) {
               const query = 'UPDATE newsletter SET active = TRUE WHERE email = $1';
               const values = [email];

               dbInsertQuery(query, values, response);
            }
            else {
               response.status(500).end();
            }
         })
      }
      else {
         response.status(400).end();
      }
   });
});

router.delete('/delete', (request, response) => {
   const { token } = request.query;

   if(token) {
      const query = 'DELETE FROM newsletter WHERE email = (SELECT email FROM delete_newsletter WHERE token = $1) IS TRUE RETURNING *';
      const values = [token];

      db.query(query, values, (err, res) => {
         if(res?.rows?.length) {
            response.status(201).end();
         }
         else {
            response.status(400).end();
         }
      });
   }
   else {
      response.status(400).end();
   }
});

router.post('/add', (request, response) => {
   const { email } = request.body;

   // Check registered but not confirmed newsletter subscribers
   const query = `SELECT id FROM newsletter WHERE email = $1 AND active = FALSE`;
   const values = [email];

   db.query(query, values, (err, res) => {
      if(res?.rows?.length) {
         // Add new verification token and send it
         const token = uuidv4();
         const query = `INSERT INTO newsletter_verification VALUES ($1, $2, NOW() + INTERVAL '3 DAY')`;
         const values = [email, token];

         db.query(query, values, (err, res) => {
            if(res) {
               let mailOptions = {
                  from: process.env.EMAIL_ADDRESS_WITH_NAME,
                  to: email,
                  subject: 'Potwierdź swoją subskrypcję newslettera',
                  html: emailTemplate('Dziękujemy za zapisanie się do naszego newslettera',
                      'Kliknij w poniższy link, aby potwierdzić swój zapis do newslettera i być na bieżąco ze światem Anna Vinbotti!',
                      `${process.env.API_URL}/potwierdzenie-subskrypcji-newslettera?token=${token}`,
                      'Potwierdź subskrypcję'
                  )
               }

               transporter.sendMail(mailOptions, function(error, info) {
                  if(error) {
                     response.status(500).end();
                  }
                  else {
                     response.status(201).end();
                  }
               });
            }
            else {
               response.status(500).end();
            }
         });
      }
      else {
         // Insert new user to newsletter
         const query = `INSERT INTO newsletter VALUES (nextval('newsletter_seq'), $1, FALSE)`;
         const values = [email];

         db.query(query, values, (err, res) => {
            if(res) {
               // New user inserted
               const token = uuidv4();
               const query = `INSERT INTO newsletter_verification VALUES ($1, $2, NOW() + INTERVAL '3 DAY')`;
               const values = [email, token];

               db.query(query, values, (err, res) => {
                  if(res) {
                     let mailOptions = {
                        from: process.env.EMAIL_ADDRESS_WITH_NAME,
                        to: email,
                        subject: 'Potwierdź swoją subskrypcję newslettera',
                        html: emailTemplate('Dziękujemy za zapisanie się do naszego newslettera',
                            'Kliknij w poniższy link, aby potwierdzić swój zapis do newslettera i być na bieżąco ze światem Anna Vinbotti!',
                            `${process.env.API_URL}/potwierdzenie-subskrypcji-newslettera?token=${token}`,
                            'Potwierdź subskrypcję'
                        )
                     }

                     transporter.sendMail(mailOptions, function(error, info) {
                        if(error) {
                           response.status(500).end();
                        }
                        else {
                           response.status(201).end();
                        }
                     });
                  }
                  else {
                     response.status(500).end();
                  }
               });
            }
            else {
               // User already registered and active
               if(err.code === '23505') {
                  response.status(400).end();
               }
               else {
                  response.status(500).end();
               }
            }
         });
      }
   });
});

module.exports = router;
