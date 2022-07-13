const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const db =  require('../database/db');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

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

router.post('/send-message-to-support', (request, response) => {
    const { content } = request.body;

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.TECH_SUPPORT_EMAIL,
        subject: 'Pytanie do supportu technicznego od: AnnaVinbotti',
        html: `<h2 style="color: #000;">Support techniczny panelu administracyjnego</h2>
            <p style="color: #000;">${content}</p>
            <p style="color: #000;">Od: AnnaVinbotti</p>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            response.status(500).end();
        }
        else {
            response.status(201).end();
        }
    });
});

router.post('/change-admin-password', (request, response) => {
    const { oldPassword, newPassword, id } = request.body;
    // const id = request.user;

    const oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
    const newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');

    const query = 'UPDATE admins SET password = $1 WHERE password = $2 AND login = $3';
    const values = [newPasswordHash, oldPasswordHash, id];

    db.query(query, values, (err, res) => {
        if(res) {
            if(res.rowCount) {
                response.status(201).end();
            }
            else {
                response.status(400).end();
            }
        }
        else {
            console.log(err);
            response.status(500).end();
        }
    });
});

router.post('/send-contact-form', (request, response) => {
   const { name, email, message } = request.body;

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.CONTACT_FORM_ADDRESS,
        subject: 'Nowa wiadomość w formularzu kontaktowym',
        html: `<p style="color: #000;">Imię: ${name}</p>
            <p style="color: #000;">Email: ${email}</p>
            <p style="color: #000;">Wiadomość: ${message}</p>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            response.status(500).end();
        }
        else {
            response.status(201).end();
        }
    });
});

module.exports = router;
