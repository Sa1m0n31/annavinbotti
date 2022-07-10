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
require('../passport')(passport);

const sendVerificationEmail = (email, token, response) => {
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

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Zweryfikuj swoje konto w naszym sklepie',
        html: '<h2>Cieszymy się, że jesteś z nami!</h2> ' +
            '<p>W celu weryfikacji Twojego konta, kliknij w poniższy link: </p> ' +
            `<a href="` + process.env.API_URL + `/weryfikacja?token=${token}">` + process.env.API_URL + `/weryfikacja?token=${token}</a>` +
            `<p>Pozdrawiamy</p>` +
            `<p>Zespół AnnaVinbotti</p>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        response.send({
            result: 1
        });
    });
}

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
                        got.post(`${process.env.API_URL}:5000/newsletter/add`, {
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
                            })
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
                WHERE u.id = $1`;
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
                    JOIN addresses a ON u.address = a.id
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

module.exports = router;
