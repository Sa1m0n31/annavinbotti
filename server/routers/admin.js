const express = require("express");
const router = express.Router();
const db = require("../database/db");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

router.post('/auth', (request, response) => {
   const { login, password } = request.body;

   const hash = crypto.createHash('sha256').update(password).digest('hex');

   const query = `SELECT * FROM admins WHERE login = $1 AND password = $2`;
   const values = [login, hash];

   db.query(query, values, (err, res) => {
       if(res) {
           if(res?.rows?.length) {
               // Generate 2FA code
               const authCode = Math.floor(100000 + Math.random() * 900000);

               const query = `INSERT INTO two_fa_tokens VALUES ($1, $2, NOW() + INTERVAL '5 MINUTE')`;
               const values = [login, authCode];

               db.query(query, values, (err, res) => {
                   if(res) {
                      // Send mail with 2FA code
                      let mailOptions = {
                          from: process.env.EMAIL_ADDRESS_WITH_NAME,
                          to: process.env.TWO_FA_ADDRESS,
                          subject: 'Logowanie do panelu administracyjnego Anna Vinbotti',
                          html: `<head>
                                    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
                                    <style>
                                    * {
                                    font-family: 'Roboto', sans-serif;
                                    font-size: 16px;
                                    }
                                    </style>
                                    </head><div style="background: #053A26; padding: 25px;">
                                    <p style="color: #B9A16B;">
                                        Dzień dobry,
                                    </p>
                                    <p style="color: #B9A16B; margin-bottom: 20px;">
                                        Twój kod do autoryzacji dwuetapowej w panelu administratora to:
                                    </p>
                                    <h1 style="text-align: center; color: #fff; letter-spacing: 3px;">
                                        ${authCode}
                                    </h1>
                                    <p style="color: #B9A16B; margin-top: 30px;">
                                        Kod jest ważny przez 5 minut od momentu wysłania tej wiadmości.
                                    </p>
                                    </div>`
                      }

                      transporter.sendMail(mailOptions, function(error, info) {
                          if(!error) {
                              response.status(201).end();
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
               response.status(401).end();
           }
       }
       else {
           response.status(500).end();
       }
   });
});

router.post('/auth-code', (request, response) => {
    const { code } = request.body;

    const query = `SELECT admin FROM two_fa_tokens WHERE code = $1 AND expire >= NOW()`;
    const values = [code];

    db.query(query, values, (err, res) => {
        if(res?.rows?.length) {
            response.send({
                token: 'Bearer ' + jwt.sign({ email: process.env.ADMIN_MAIL_ADDRESS }, process.env.JWT_SECRET, {
                    expiresIn: 3600,
                    issuer: process.env.JWT_ISSUER,
                    audience: process.env.JWT_AUDIENCE,
                })
            })
        }
        else {
            response.status(401).end();
        }
    })
});

const adminAuthMiddleware = (req, res, next) => {
    const cookiesArray = req.headers.cookie.split(';');

    const bearerToken = cookiesArray.map((item) => {
        return item.split('=');
    }).find((item) => {
        return (item[0].trim() === 'access_token');
    });

    if(bearerToken) {
        try {
            const decodedToken = jwt.verify(bearerToken[1]?.split('%20')[1], process.env.JWT_SECRET);

            if(decodedToken.email === process.env.ADMIN_MAIL_ADDRESS) {
                return next();
            }
            else {
                return res.status(401).end();
            }
        }
        catch {
            res.status(401).end();
        }
    }
    else {
        res.status(401).end();
    }
}

router.get("/auth", adminAuthMiddleware, (request, response) => {
    response.status(200).end();
});

module.exports = router;
