const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { v4: uuidv4 } = require('uuid');
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const passport = require('passport');
const crypto = require('crypto');
const got = require('got');
const emailTemplate = require("./others");
require('../passport')(passport);

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

const sendVerificationEmail = (email, token, response) => {
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Cieszymy się, że jesteś z nami!',
        html: emailTemplate('Aktywuj swoje konto',
            'W celu weryfikacji Twojego konta, kliknij w poniższy link:',
            `${process.env.API_URL}/weryfikacja?token=${token}`,
            'Aktywuj konto'
        )
    }

    transporter.sendMail(mailOptions, function(error, info) {
        response.send({
            result: 1
        });
    });
}

router.post('/verify-account', (request, response) => {
   const { token } = request.body;

   const query = `SELECT * FROM account_verification WHERE token = $1`;
   const values = [token];

   db.query(query, values, (err, res) => {
      if(res?.rows?.length) {
          const email = res.rows[0].email;

          const query = 'UPDATE users SET active = TRUE WHERE email = $1';
          const values = [email];

          dbInsertQuery(query, values, response);
      }
      else {
          response.status(400).end();
      }
   });
});

router.post("/register", (request, response) => {
    const { login, email, password, newsletter } = request.body;

    /* Password hash */
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    const query = `INSERT INTO users VALUES (nextval('users_id_sequence'), $1, $2, $3, NULL, NULL, NULL, NULL, false) RETURNING email`;
    const values = [email, login, hash];

    db.query(query, values, (err, res) => {
        if(res) {
            const insertedUserEmail = res.rows[0].email;
            const token = uuidv4();
            const query = 'INSERT INTO account_verification VALUES ($1, $2, NOW())';
            const values = [insertedUserEmail, token];
            db.query(query, values, (err, res) => {
                if(res) {
                    if(newsletter === 'true') {
                        got.post(`${process.env.API_URL}/newsletter/add`, {
                            json: {
                                email
                            },
                            responseType: 'json',
                        })
                            .then(() => {
                                sendVerificationEmail(email, token, response);
                            })
                            .catch(() => {
                                sendVerificationEmail(email, token, response);
                            });
                    }
                    else {
                        sendVerificationEmail(email, token, response);
                    }
                }
                else {
                    response.send({
                        result: 0
                    })
                }
            });
        }
        else {
            if(err.constraint === 'login_unique') {
                response.send({
                    result: -1
                });
            }
            else if(err.constraint === 'email_unique') {
                response.send({
                    result: -2
                });
            }
            else {
                response.send({
                    result: 0
                });
            }

        }
    });
});

router.put('/change-password', (request, response) => {
   const { password, email } = request.body;

   const hash = crypto.createHash('sha256').update(password).digest('hex');
   const query = `UPDATE users SET password = $1 WHERE email = $2`;
   const values = [hash, email];

   dbInsertQuery(query, values, response);
});

router.put('/update-user-data', (request, response) => {
    const { id, address, firstName, lastName, email, phoneNumber, street, building, flat, postalCode, city } = request.body;

    const query = `UPDATE addresses SET street = $1, building = $2, flat = $3, postal_code = $4, city = $5 WHERE id = $6`;
    const values = [street, building, flat, postalCode, city, address];

    db.query(query, values, (err, res) => {
        console.log(res);
        if(res) {
            if(res.rowCount === 0) {
                const query = `INSERT INTO addresses VALUES (nextval('addresses_seq'), $1, $2, $3, $4, $5, NULL, NULL, NULL) RETURNING id`;
                const values = [city, postalCode, street, building, flat];

                db.query(query, values, (err, res) => {
                    if(res) {
                        const addressId = res.rows[0]?.id;

                        const query = 'UPDATE users SET address = $1 WHERE id = $2';
                        const values = [addressId, id];

                        db.query(query, values, (err, res) => {
                            if(res) {
                                const query = 'UPDATE users SET first_name = $1, last_name = $2, phone_number = $3, email = $4 WHERE id = $5';
                                const values = [firstName, lastName, phoneNumber, email, id];

                                dbInsertQuery(query, values, response);
                            }
                            else {
                                response.status(500).end();
                            }
                        });
                    }
                    else {
                        response.status(500).end();
                    }
                });
            }
            else {
                const query = 'UPDATE users SET first_name = $1, last_name = $2, phone_number = $3, email = $4 WHERE id = $5';
                const values = [firstName, lastName, phoneNumber, email, id];

                dbInsertQuery(query, values, response);
            }
        }
        else {
            response.status(500).end();
        }
    });
});

router.get('/get-user-orders', (request, response) => {
   const user = request.user;

   if(!user) {
       response.status(400).end();
   }
   else {
       const query = `SELECT o.id, o.date, o.status, s.product, t.id as type
                FROM orders o 
                JOIN users u ON o.user = u.id
                JOIN sells s ON o.id = s.order
                JOIN products p ON p.id = s.product
                JOIN types t ON p.type = t.id
                WHERE u.id = $1 AND o.hidden = FALSE ORDER BY date DESC`;
       const values = [user];

       dbSelectQuery(query, values, response);
   }
});

router.get('/get-user-info', (request, response) => {
   const id = request.user;

   if(!id) {
       response.status(401).end();
   }
   else {
       const query = `SELECT u.id, u.first_name, u.last_name, u.email, u.login, u.phone_number, u.address, a.city, a.street, a.postal_code, a.building, a.flat 
                    FROM users u
                    LEFT OUTER JOIN addresses a ON u.address = a.id
                    WHERE u.id = $1`;
       const values = [id];

       dbSelectQuery(query, values, response);
   }
});

router.get('/failure', (request, response) => {
    const errorMsg = request.flash().error[0];
    response.send({
        result: 0,
        msg: errorMsg
    });
});

router.get("/logout", (request, response) => {
    request.logOut();
    request.session.destroy((err) => {
        response.send({
            result: 1
        });
    });
});

router.post("/login",
    passport.authenticate('user-local', { session: true, failureFlash: true, failureRedirect: '/user/failure' }),
    (request, response) => {
        response.send({
            result: 1
        });
    }
);

router.get("/auth", (request, response) => {
    if(request.user) {
        response.status(200).end();
    }
    else {
        response.status(401).end();
    }
});

router.post('/remind-password', (request, response) => {
   const { email } = request.body;

   const query = `SELECT * FROM users WHERE email = $1`;
   const values = [email];

   db.query(query, values, (err, res) => {
      if(res) {
          if(res.rows.length) {
              const token = uuidv4();

              const query = `INSERT INTO password_verification VALUES ($1, $2, NOW() + INTERVAL '1 DAY')`;
              const values = [email, token];

              db.query(query, values, (err, res) => {
                  if(res) {
                      let mailOptions = {
                          from: process.env.EMAIL_ADDRESS,
                          to: email,
                          subject: 'Odzyskaj swoje hasło',
                          html: emailTemplate('Odzyskaj swoje hasło',
                                'Kliknij w poniższy link, aby ustawić nowe hasło do swojego konta',
                              `${process.env.API_URL}/odzyskiwanie-hasla?token=${token}`,
                              'Odzyskaj hasło'
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
              })
          }
          else {
              response.send({
                  result: 0
              });
          }
      }
      else {
          response.status(500).end();
      }
   });
});

router.post('/verify-password-token', (request, response) => {
   const { token } = request.body;

    const query = `SELECT * FROM password_verification WHERE token = $1 AND expire >= NOW()`;
    const values = [token];

    db.query(query, values, (err, res) => {
        if(res?.rows?.length) {
            const email = res.rows[0].email;

            const query = 'DELETE FROM password_verification WHERE token = $1';

            db.query(query, values, (err, res) => {
                response.status(200).send({
                    email: email
                });
            });
        }
        else {
            response.status(400).end();
        }
    });
});

module.exports = router;
