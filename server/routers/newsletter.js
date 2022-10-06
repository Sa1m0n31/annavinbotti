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
const newsletterTemplate = require("./others").newsletterTemplate;
const getNewsletterBottom = require("./others").getNewsletterBottom;
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
               const query = `UPDATE newsletter SET active = TRUE, register_date = NOW() + INTERVAL '4 HOUR' WHERE email = $1`;
               const values = [email];

               db.query(query, values, (err, res) => {
                  console.log(err);
                  if(res) {
                     let mailOptions = {
                        from: process.env.EMAIL_ADDRESS_WITH_NAME,
                        to: email,
                        subject: 'Dziękujemy, że jesteś z nami',
                        html: `<div style="background: #053A26; padding: 25px;">
                          <img style="margin: 10px auto 30px; width: 90%; display: block;" src="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/image?url=/media/static/newsletter-po-zapisie.JPG" alt="anna-vinbotti" />  
                          <img style="margin: 0 auto 30px; width: 90%; max-width: 250px; display: block;" src="https://3539440eeef81ec8ea0242ac120002.anna-vinbotti.com/image?url=/media/static/logo.png" alt="logo" />
                          <p style="color: #B9A16B;">
                              Dziękujemy, że razem z nami chcesz odkrywać skarby, jakie może zaoferować prawdziwe szewskie rękodzieło. Dawne rękodzieło to przede wszystkim kilkudziesięcioletnie doświadczenie, kilka dni pracy nad jedną parą obuwia oraz przedwojenna technika wykonania, już niemalże zapomniana.
                          </p>
                          <p style="color: #B9A16B;">
                          Cieszymy się, że tak jak my chcesz przemierzać świat w butach inspirowanych modą vintage. Bo but to nie tylko przedmiot codziennego użytku, zwyczajny element garderoby, to coś znacznie głębszego, niemalże symbolicznego.
                          </p>
                          <p style="color: #B9A16B; margin-top: 40px;">Zostań z nami,</p>
                          <p style="color: #B9A16B;">Zespół Anna Vinbotti</p>
                          
                          ${getNewsletterBottom(deleteToken)}
                          </div>`
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
      const query = 'DELETE FROM newsletter WHERE email = (SELECT email FROM newsletter_delete WHERE token = $1) IS TRUE RETURNING *';
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
         const query = `INSERT INTO newsletter VALUES (nextval('newsletter_seq'), $1, FALSE, NOW() + INTERVAL '4 HOUR')`;
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

router.post('/send-test-newsletter', (request, response) => {
   const { title, newsletterContent } = request.body;

   if(title && newsletterContent) {
      let mailOptions = {
         from: process.env.EMAIL_ADDRESS_WITH_NAME,
         to: process.env.ADMIN_MAIL_ADDRESS,
         subject: title,
         html: `<head>
<style>
* {
color: #B9A16B !important;
}
</style>
</head>
<body>
${newsletterTemplate(newsletterContent)}
</body>`
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
      response.status(400).end();
   }
});

router.post('/save-work-in-progress', (request, response) => {
   const { title, content } = request.body;

   const query = `UPDATE newsletter_mails SET title = $1, content = $2 WHERE in_progress = TRUE`;
   const values = [title, content];

   dbInsertQuery(query, values, response);
});

router.post('/send-resignation-link', (request, response) => {
   const { email } = request.body;

   const query = `SELECT token FROM newsletter_delete WHERE email = $1`;
   const values = [email];

   db.query(query, values, (err, res) => {
      if(res?.rows?.length) {
         const token = res.rows[0].token;

         let mailOptions = {
            from: process.env.EMAIL_ADDRESS_WITH_NAME,
            to: email,
            subject: 'Zrezygnuj z subskrypcji newslettera',
            html: `<body>
<div style="background: #053A26; padding: 25px;">
<p style="color: #B9A16B; margin-bottom: 30px;">Dzień dobry,</p>
<p style="color: #B9A16B; font-size: 15px;">
    Jeśli chcesz wypisać się z newslettera, kliknij 
    <a href="${process.env.WEBSITE_URL}/zrezygnuj-z-newslettera?token=${token}" 
    style="text-decoration: underline; color: #B9A16B; font-weight: 700;">TUTAJ</a>.
</p>
<p style="color: #B9A16B; margin-top: 40px;">Pozdrawiamy,</p>
<p style="color: #B9A16B;">Zespół Anna Vinbotti</p>
</div>
</body>`
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
         response.status(400).end();
      }
   });
});

router.get('/get-newsletter-in-progress', (request, response) => {
   const query = `SELECT * FROM newsletter_mails WHERE in_progress = TRUE`;

   dbSelectQuery(query, [], response);
})

router.post('/send', (request, response) => {
   const { title, newsletterContent } = request.body;

   if(title && newsletterContent) {
      // Clear newsletter in progress
      const query = `UPDATE newsletter_mails SET title = '', content = '' WHERE in_progress = TRUE`;

      db.query(query, [], (err, res) => {
         // Save email to database
         const query = `INSERT INTO newsletter_mails VALUES (nextval("newsletter_mail_seq"), $1, $2, NOW(), FALSE)`;
         const values = [title, newsletterContent];

         db.query(query, values, (err, res) => {
            // Send newsletter email
            const query = `SELECT email FROM newsletter WHERE active = TRUE`;

            db.query(query, [], (err, res) => {
               if(res) {
                  const emails = res?.rows?.map((item) => (item.email));

                  let mailOptions = {
                     from: process.env.EMAIL_ADDRESS_WITH_NAME,
                     to: [],
                     bcc: emails,
                     subject: title,
                     html: `<head>
<style>
* {
color: #B9A16B !important;
}
</style>
</head>
<body>
${newsletterTemplate(newsletterContent)}
</body>`
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
         });
      });
   }
   else {
      response.status(400).end();
   }
});

router.post('/send-email-to-clients', (request, response) => {
   const { title, content } = request.body;

   if(title && content) {
      const query = `SELECT email FROM users WHERE active = TRUE`;

      db.query(query, [], (err, res) => {
         if(res) {
            const emails = res?.rows?.map((item) => (item.email));

            let mailOptions = {
               from: process.env.EMAIL_ADDRESS_WITH_NAME,
               to: [],
               bcc: emails,
               subject: title,
               html: `<head>
<style>
* {
color: #B9A16B !important;
}
</style>
</head>
<body>
${newsletterTemplate(content, false)}
</body>`
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
      response.status(400).end();
   }
})

module.exports = router;
