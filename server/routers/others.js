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
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
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
            response.status(500).end();
        }
    });
});

router.post('/send-contact-form', (request, response) => {
   const { name, email, message } = request.body;

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
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

const emailTemplate = (header, text, btnLink, btnText) => {
    return `<div style="background: #053A26; padding: 25px;">
            <h2 style="color: #B9A16B; text-align: center;">
            ${header}
        </h2>
        <p style="color: #B9A16B; text-align: center;">
            ${text}
        </p>
        <a style="text-decoration: none; background: #B9A16B; 
        color: #222; width: 350px; max-width: 80vw; display: block; box-sizing: content-box; border-radius: 30px; 
        padding: 10px 0; height: 20px; min-height: 20px; 
        text-align: center; margin: 20px auto 10px; text-transform: uppercase;
        font-weight: 700;" href="${btnLink}">
            ${btnText}
        </a>
        <p style="color: #B9A16B; margin-top: 40px;">Pozdrawiamy</p>
        <p style="color: #B9A16B;">Zespół Anna Vinbotti</p>
        </div>`
}

const newsletterTemplate = (content, includeBottom = true) => {
    return `<style>
    img {
        display: block !important;
        width: 100% !important;
        max-width: 500px !important;
    }
    
    * {
        color: #B9A16B !important;
        text-align: justify !important;
    }
</style>
<div style="background: #053A26; padding: 25px; font-size: 17px;">
        ${content}
        ${includeBottom ? getNewsletterBottom() : ''}        
    </div>`;
}

const getNewsletterBottom = () => {
    return `<p style="border-top: 1px solid #B9A16B; color: #B9A16B; font-size: 12px; padding-top: 6px; margin: 30px 0 10px;">
    Jeśli chcesz wypisać się z newslettera, kliknij 
    <a href="${process.env.WEBSITE_URL}/zrezygnuj-z-newslettera" 
    style="text-decoration: underline; color: #B9A16B; font-weight: 700;">TUTAJ</a>.
</p>`;
}

module.exports = { router, emailTemplate, newsletterTemplate, getNewsletterBottom }
