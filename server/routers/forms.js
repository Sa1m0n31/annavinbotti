const express = require("express");
const router = express.Router();
const db = require("../database/db");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const multer  = require('multer')
const upload = multer({ dest: 'media/filled-forms' })

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


// -------------------

const sendStatus2Email = (email, response, orderId) => {
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
        to: email,
        subject: 'Weryfikacja podanych wymiarów',
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
                <p style="color: #B9A16B; margin: 10px 0;">
                    Poniższa wiadomość dotyczy rezerwacji o numerze #${orderId}.    
                </p>
                <p style="color: #B9A16B; margin: 10px 0;">
                    Dziękujemy za uzupełnienie Formularza Mierzenia Stopy.
                </p>
                <p style="color: #B9A16B; margin: 10px 0;">
                    Prosimy o przesłanie nam oryginalnych kartek z obrysami stopy lewej oraz prawej wraz z dodaną informacją o numerze rezerwacji na nasz adres korespondencyjny
                </p>
                <p style="color: #B9A16B; text-align: center;">
                    Sklep Anna Vinbotti<br/>
                    Ul. Tomasza Zana 43 / lok. 2.1<br/>
                    20 – 601 Lublin
                </p>
                <p style="color: #B9A16B; margin: 10px 0;">
                    Gdy otrzymamy obrysy, zweryfikujemy dostarczone nam informacje o wymiarach stóp. Po ich zaakceptowaniu, otrzymasz link do płatności.
                </p>
                
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        let mailOptions = {
            from: process.env.EMAIL_ADDRESS_WITH_NAME,
            to: process.env.ADMIN_MAIL_ADDRESS,
            subject: 'Klient wysłał formularz mierzenia stopy',
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
                    Klient przesłał formularz mierzenia stopy do rezerwacji numer #${orderId}.
                </p>
                <p style="color: #B9A16B; margin: 10px 0;">
                    Sprawdź informacje przesłane przez Klienta logując się do panelu administratora:    
                </p>
                <a style="color: #B9A16B; margin: 10px 0; text-decoration: underline;" href="${process.env.WEBSITE_URL}/vzh2sffqjn">
                    Zaloguj się do panelu admina
                </a>
                </div>`
        }

        transporter.sendMail(mailOptions, function(error, info) {
            response.status(201).end();
        });
    });
}

const sendStatus6Email = (email, response, orderId) => {
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS_WITH_NAME,
        to: email,
        subject: 'But do miary został zweryfikowany',
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
                 <p style="color: #B9A16B;">
                    Poniższa wiadomość dotyczy zamówienia o numerze #${orderId}.    
                </p>
                <p style="color: #B9A16B;">
                    Dziękujemy za weryfikację Buta Do Miary oraz wypełnienie formularza. Jeśli z naszej strony pojawią się wątpliwości dotyczące podanych informacji, będziemy się kontaktować.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        let mailOptions = {
            from: process.env.EMAIL_ADDRESS_WITH_NAME,
            to: process.env.ADMIN_MAIL_ADDRESS,
            subject: 'Klient wysłał formularz weryfikacji buta do miary',
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
                    Klient przesłał formularz weryfikacji buta do miary do zamówienia numer #${orderId}.
                </p>
                <p style="color: #B9A16B; margin: 10px 0;">
                    Sprawdź informacje przesłane przez Klienta logując się do panelu administratora:    
                </p>
                <a style="color: #B9A16B; margin: 10px 0; text-decoration: underline;" href="${process.env.WEBSITE_URL}/vzh2sffqjn">
                    Zaloguj się do panelu admina
                </a>
                </div>`
        }

        transporter.sendMail(mailOptions, function(error, info) {
            response.status(201).end();
        });
    });
}

router.get('/get-form', (request, response) => {
   const { type, formType } = request.query;

   const query = 'SELECT * FROM forms WHERE type = $1 AND form_type = $2';
   const values = [type, formType];

   dbSelectQuery(query, values, response);
});

router.get('/get-working-form', (request, response) => {
    const { order, type } = request.query;

    const query = `SELECT fip.form_data, s.id FROM forms_in_progress fip
                JOIN sells s ON fip.sell = s.id
                JOIN orders o ON s.order = o.id
                JOIN products p ON p.id = s.product
                JOIN types t ON p.type = t.id
                WHERE t.id = $1 AND o.id = $2`;
    const values = [type, order];

    dbSelectQuery(query, values, response);
});

router.post('/send-form', upload.fields([
    { name: 'images', maxCount: 100 }
]), (request, response) => {
   let { formType, orderId, type, formJSON, email } = request.body;
   const user = request.user;

   const query = `SELECT o.user FROM orders o WHERE id = $1`;
   const values = [orderId];

   db.query(query, values, (err, res) => {
       const selectedUser = res?.rows[0]?.user;

       if(selectedUser) {
           if(parseInt(selectedUser) === parseInt(user)) {
               const files = request.files;

               const getFileName = (name) => {
                   return files?.images?.find((item) => {
                       return item.originalname === name;
                   });
               }

               // Map to schema
               if(parseInt(formType) === 1) {
                   formJSON = JSON.stringify(JSON.parse(formJSON)?.map((item) => {
                       return {
                           type: item.type,
                           name: item.name?.replace('-number-leg0', '')
                               ?.replace('-number-leg1', '')
                               ?.replace('-image-leg0', '')
                               ?.replace('-image-leg1', '')
                               ?.replace('-leg0', '')
                               ?.replace('-leg1', ''),
                           value: item.type === 'txt' ? item.value : (getFileName(item.name)?.filename ? getFileName(item.name)?.filename : item.value.fileUrl.split('/')[item.value.fileUrl.split('/').length-1])
                       }
                   }));

                   // Divide form by right and left foot
                   const formJSONParsed = JSON.parse(formJSON);
                   const middleIndex = Math.ceil(formJSONParsed.length / 2);
                   const firstHalf = formJSONParsed.splice(0, middleIndex);
                   const secondHalf = formJSONParsed.splice(-middleIndex);
                   formJSON = {
                       right: firstHalf,
                       left: secondHalf
                   };
               }
               else {
                   formJSON = JSON.stringify(JSON.parse(formJSON)?.map((item) => {
                       return {
                           question: item.question,
                           answer: item.answer?.map((item) => {
                               if(typeof item === 'object') {
                                   const objKey = Object.entries(item)[0][0];
                                   return {
                                       [objKey]: getFileName(objKey)?.filename
                                   }
                               }
                               else {
                                   return item;
                               }
                           }),
                           type: typeof item.answer[0] === 'object' ? 'img' : 'txt'
                       }
                   }));
               }

               formJSON = JSON.stringify(formJSON);

               if(formType && orderId && type && formJSON) {
                   let query;

                   if(parseInt(formType) === 1) {
                       // By type
                       query = `SELECT s.id FROM sells s 
                   JOIN orders o ON s.order = o.id
                   JOIN products p ON p.id = s.product
                   JOIN types t ON p.type = t.id
                   WHERE t.id = $1 AND o.id = $2`;
                   }
                   else {
                       // By model
                       query = `SELECT s.id FROM sells s 
                   JOIN orders o ON s.order = o.id
                   JOIN products p ON p.id = s.product
                   WHERE p.id = $1 AND o.id = $2`;
                   }

                   const values = [type, orderId];

                   db.query(query, values, (err, res) => {
                       if(res) {
                           const sells = res?.rows?.map((item) => {
                               return item.id;
                           });

                           sells?.forEach(async (item, index, array) => {
                               const deleteQuery = `DELETE FROM forms_in_progress WHERE sell = $1`;
                               const deleteValues = [item];

                               db.query(deleteQuery, deleteValues);

                               const query = `INSERT INTO filled_forms VALUES ($1, $2, $3, TRUE) ON CONFLICT (form, sell) 
                                               DO UPDATE SET form_data = $3, confirmed = TRUE`;
                               const values = [formType, item, formJSON];

                               await db.query(query, values, (err, res) => {
                                   if(res) {
                                       if(index === array.length - 1) {
                                           // Check if all forms submitted - if yes: change order status
                                           const query = `SELECT s.id FROM orders o
                                        JOIN sells s ON o.id = s.order
                                        WHERE o.id = $1 AND s.id NOT IN (
                                            SELECT sell FROM filled_forms WHERE form = $2 AND confirmed = TRUE
                                        )`;
                                           const values = [orderId, parseInt(formType)];

                                           db.query(query, values, (err, res) => {
                                               if(res) {
                                                   const rows = res?.rows;

                                                   // sells in order and not in filled_forms == 0: update status
                                                   if(rows?.length === 0) {
                                                       let query;

                                                       if(parseInt(formType) === 1) {
                                                           query = 'UPDATE orders SET status = 2 WHERE id = $1';
                                                           const values = [orderId];

                                                           db.query(query, values, (err, res) => {
                                                               const query = `INSERT INTO order_status_changes VALUES ($1, $2, NOW() + INTERVAL '4 HOUR')`;
                                                               const values = [orderId, 2];

                                                               db.query(query, values, (err, res) => {
                                                                   sendStatus2Email(email, response, orderId);
                                                               });
                                                           });
                                                       }
                                                       else {
                                                           query = 'UPDATE orders SET status = 6 WHERE id = $1';
                                                           const values = [orderId];

                                                           db.query(query, values, (err, res) => {
                                                               const query = `INSERT INTO order_status_changes VALUES ($1, $2, NOW() + INTERVAL '4 HOUR')`;
                                                               const values = [orderId, 6];

                                                               db.query(query, values, (err, res) => {
                                                                   sendStatus6Email(email, response, orderId);
                                                               });
                                                           });
                                                       }
                                                   }
                                                   else {
                                                       response.status(201).end();
                                                   }
                                               }
                                               else {
                                                   response.status(500).end();
                                               }
                                           });
                                       }
                                   }
                                   else {
                                       response.status(500).end();
                                   }
                               });
                           });
                       }
                       else {
                           console.log(err);
                           response.status(500).end();
                       }
                   });
               }
           }
           else {
               response.status(401).end();
           }
       }
       else {
           response.status(401).end();
       }
   });
});

router.post('/send-working-form', upload.fields([
    { name: 'images', maxCount: 100 }
]), (request, response) => {
    let { orderId, type, formJSON } = request.body;
    const user = request.user;

    const query = `SELECT o.user FROM orders o WHERE id = $1`;
    const values = [orderId];

    db.query(query, values, (err, res) => {
        console.log(err);
        const selectedUser = res?.rows[0]?.user;

        if(selectedUser) {
            if(parseInt(selectedUser) === parseInt(user)) {
                const files = request.files;

                const getFileName = (name) => {
                    return files?.images?.find((item) => {
                        return item.originalname === name;
                    });
                }

                // Map to schema
                formJSON = JSON.stringify(JSON.parse(formJSON)?.map((item) => {
                    return {
                        type: item.type,
                        name: item.name?.replace('-number-leg0', '')
                            ?.replace('-number-leg1', '')
                            ?.replace('-image-leg0', '')
                            ?.replace('-image-leg1', '')
                            ?.replace('-leg0', '')
                            ?.replace('-leg1', ''),
                        value: item.type === 'txt' ? item.value : (getFileName(item.name)?.filename ? getFileName(item.name)?.filename : (item?.value?.fileUrl ? item.value.fileUrl.split('/')[item.value.fileUrl.split('/').length-1] : null))
                    }
                }));

                // Divide form by right and left foot
                const formJSONParsed = JSON.parse(formJSON);
                const middleIndex = Math.ceil(formJSONParsed.length / 2);
                const firstHalf = formJSONParsed.splice(0, middleIndex);
                const secondHalf = formJSONParsed.splice(-middleIndex);
                formJSON = {
                    right: firstHalf,
                    left: secondHalf
                };

                formJSON = JSON.stringify(formJSON);

                if(orderId && type && formJSON) {
                    let query = `SELECT s.id FROM sells s 
                               JOIN orders o ON s.order = o.id
                               JOIN products p ON p.id = s.product
                               JOIN types t ON p.type = t.id
                               WHERE t.id = $1 AND o.id = $2`;
                    const values = [type, orderId];

                    db.query(query, values, (err, res) => {
                        console.log(err);
                        if(res) {
                            const sells = res?.rows?.map((item) => {
                                return item.id;
                            });

                            sells?.forEach(async (item, index, array) => {
                                const query = `INSERT INTO forms_in_progress VALUES ($1, $2) ON CONFLICT (sell) 
                                               DO UPDATE SET form_data = $2`;
                                const values = [item, formJSON];

                                db.query(query, values, (err, res) => {
                                    console.log(err);
                                    if(index === array.length-1) {
                                        if(res) {
                                            response.status(201).end();
                                        }
                                        else {
                                            response.status(500).end();
                                        }
                                    }
                                })
                            });
                        }
                        else {
                            response.status(500).end();
                        }
                    });
                }
            }
            else {
                response.status(401).end();
            }
        }
        else {
            response.status(401).end();
        }
    });
});

router.get('/get-orders-with-empty-first-type-forms', (request, response) => {
   const user = request.user;

   if(user) {
       const query = `SELECT o.id as order_id, p.type FROM orders o
                    JOIN sells s ON o.id = s.order
                    JOIN products p ON p.id = s.product
                    LEFT OUTER JOIN filled_forms ff ON ff.sell = s.id 
                    WHERE o.user = $1 AND ff.form IS NULL OR ff.confirmed = FALSE`;
       const values = [user];

       dbSelectQuery(query, values, response);
   }
   else {
       response.status(400).end();
   }
});

router.get('/get-orders-with-empty-second-type-forms', (request, response) => {
    const user = request.user;

    if(user) {
        const query = `SELECT o.id as order_id, p.id as type, ff.form FROM orders o
                JOIN sells s ON o.id = s.order
                JOIN products p ON p.id = s.product
                LEFT OUTER JOIN filled_forms ff ON ff.sell = s.id
                WHERE o.user = $1 AND (ff.form IS NULL OR ff.form = 1) AND s.id NOT IN (
                    SELECT s.id FROM sells s 
                    JOIN orders o ON o.id = s.order
                    JOIN filled_forms ff ON ff.sell = s.id 
                    JOIN users u ON u.id = o.user
                    WHERE u.id = $1 AND ff.form = 2
                )`;
        const values = [user];

        dbSelectQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

router.get('/get-first-type-filled-form', (request, response) => {
    const { order, type } = request.query;

    const query = `SELECT ff.form_data FROM filled_forms ff
                JOIN sells s ON ff.sell = s.id
                JOIN orders o ON o.id = s.order
                JOIN products p ON s.product = p.id
                WHERE o.id = $1 AND ff.form = 1 AND p.type = $2`;
    const values = [order, type];

    dbSelectQuery(query, values, response);
});

router.get('/get-second-type-filled-form', (request, response) => {
    const { order, type } = request.query;

    const query = `SELECT ff.form_data, p.name_pl FROM filled_forms ff
                JOIN sells s ON ff.sell = s.id
                JOIN orders o ON o.id = s.order
                JOIN products p ON s.product = p.id
                WHERE o.id = $1 AND ff.form = 2 AND p.id = $2`;
    const values = [order, type];

    dbSelectQuery(query, values, response);
});

module.exports = router;
