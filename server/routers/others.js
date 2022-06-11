const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

router.post('/send-message-to-support', (request, response) => {
    const { content } = request.body;

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
        to: process.env.TECH_SUPPORT_EMAIL,
        subject: 'Pytanie do supportu technicznego od: AnnaVinbotti',
        html: `<h2 style="color: #000;">Support techniczny panelu administracyjnego</h2>
            <p style="color: #000;">${content}</p>
            <p style="color: #000;">Od: AnnaVinbotti</p>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        console.log('send...');
        console.log(error);
        if(error) {
            response.status(500).end();
        }
        else {
            response.status(201).end();
        }
    });
});

module.exports = router;
