const express = require("express");
const router = express.Router();
const db = require("../database/db");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/products' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const isElementInArray = (el, arr) => {
   return arr.findIndex((item) => {
      return item === el;
   }) !== -1;
}

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

const createSlug = (name) => {
   if(name) return name.toLowerCase()
       .replace(/ /g, "-")
       .replace(/ą/g, "a")
       .replace(/ć/g, "c")
       .replace(/ę/g, "e")
       .replace(/ł/g, "l")
       .replace(/ń/g, "n")
       .replace(/ó/g, "o")
       .replace(/ś/g, "s")
       .replace(/ź/g, "z")
       .replace(/ż/g, "z")
   else return "";
}

router.get('/get-all', (request, response) => {
   const query = `SELECT p.id, t.name_pl as type, p.name_pl, p.name_en, p.description_pl, p.description_en, p.details_pl, p.details_en, p.price, p.main_image 
   FROM products p JOIN types t ON p.type = t.id 
   WHERE p.hidden = FALSE
   ORDER BY p.name_pl`;

   dbSelectQuery(query, [], response);
});

const getAddonsArray = (productId, addonsWithOptions, addonsForProducts) => {
   const productAddons = addonsForProducts.filter((item) => (item.product === productId)).map((item) => (item.addon));

   return addonsWithOptions.filter((item) => {
      return isElementInArray(item.addon_id, productAddons);
   });
}

router.get('/get-shop-page', (request, response) => {
   const query = `SELECT p.id, t.name_pl as type_pl, t.name_en as type_en, t.id as type_id,
            p.slug, p.name_pl, p.name_en, p.description_pl, p.description_en,
            p.details_pl, p.details_en, p.price, p.main_image,
            COALESCE(s.counter, 0) as counter, s.id as stock_id
            FROM products p
            JOIN types t ON p.type = t.id
            LEFT OUTER JOIN products_stocks ps ON ps.product = p.id
            LEFT OUTER JOIN stocks s ON s.id = ps.stock
            WHERE p.hidden = FALSE
            ORDER BY p.priority DESC`;

   db.query(query, [], (err, res) => {
      if(res) {
         const products = res.rows;

         // Get all addons
         const query = `SELECT a.id as addon_id, ao.id as addon_option_id, ao.stock as addon_option_stock
                        FROM addons a
                        JOIN addons_options ao ON a.id = ao.addon 
                        WHERE a.hidden = FALSE AND ao.hidden = FALSE`;

         db.query(query, [], (err, res) => {
            if(res) {
               const addonsWithOptions = res.rows;

               // Get all addons for products
               const query = `SELECT product, addon FROM addons_for_products`;

               db.query(query, [], (err, res) => {
                  if(res) {
                     const addonsForProducts = res.rows;

                     response.send({
                        result: products.map((item) => {
                           return {
                              ...item,
                              addons: getAddonsArray(item.id, addonsWithOptions, addonsForProducts)
                           }
                        })
                     });
                  }
                  else {
                     response.status(500).end();
                  }
               })
            }
            else {
               response.status(500).end();
            }
         })
      }
      else {
         response.status(500).end();
      }
   });
});

router.get('/get', (request, response) => {
   const id = request.query.id;

   if(id) {
      const query = 'SELECT * FROM products WHERE id = $1';
      const values = [id];

      dbSelectQuery(query, values, response);
   }
   else {
      response.status(400).end();
   }
});

router.get('/get-by-slug', (request, response) => {
   const slug = request.query.slug;

   if(slug) {
      const query = `SELECT p.id, p.slug, t.name_pl as type_pl, t.name_en as type_en, p.name_pl, p.name_en,
                  p.description_pl, p.description_en, p.details_pl, p.details_en, p.price, p.main_image, s.counter, s.id as stock_id, 
                  (SELECT COUNT(*)
                  FROM addons_for_products afp
                  JOIN products p ON afp.product = p.id
                  LEFT OUTER JOIN addons_options ao ON afp.addon = ao.addon
                  LEFT OUTER JOIN addons_stocks ad_stocks ON ad_stocks.addon_option = ao.id
                  LEFT OUTER JOIN stocks s ON s.id = ad_stocks.stock
                  WHERE p.slug = $1 AND ao.hidden = FALSE AND s.counter <= 0) as addons_not_available
                  FROM products p
                  JOIN types t ON p.type = t.id
                  JOIN products_stocks ps ON ps.product = p.id 
                  JOIN stocks s ON ps.stock = s.id
                  WHERE slug = $1`;
      const values = [slug];

      dbSelectQuery(query, values, response);
   }
   else {
      response.status(400).end();
   }
});

router.get('/get-product-gallery', (request, response) => {
   const id = request.query.id;

   const query = 'SELECT path FROM images WHERE product = $1';
   const values = [id];

   dbSelectQuery(query, values, response);
});

const addGallery = (gallery, id, response) => {
   gallery.forEach((item, index, array) => {
      const values = [item.filename, id];
      const query = `INSERT INTO images VALUES (nextval('image_seq'), $1, $2)`;
      db.query(query, values, (err, res) => {
         if(index === array.length-1) {
            response.send({
               result: id
            });
         }
      });
   });
}

const deleteProductGallery = (productId) => {
   return new Promise((resolve, reject) => {
      const query = 'SELECT path FROM images WHERE product = $1';
      const values = [productId];

      db.query(query, values, (err, res) => {
         if(res) {
            const rows = res.rows;
            if(rows) {
               rows.forEach((item, index, array) => {
                  fs.unlink(`./media/products/${item.path}`, (err) => {
                     console.log(err);
                  });
                  if(index === array.length-1) {
                     const query = 'DELETE FROM images WHERE product = $1';
                     const values = [productId];

                     db.query(query, values, (err, res) => {
                        resolve();
                     });
                  }
               });
            }
            else {
               resolve();
            }
         }
         else {
            resolve();
         }
      });
   })
}

router.patch('/update', upload.fields([
   { name: 'gallery', maxCount: 10 },
   { name: 'mainImage', maxCount: 1 }
]), (request, response) => {
   let { id, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, type, price, showOnHomepage, priority } = request.body;

   try {
      const slug = createSlug(namePl);
      const files = request.files;
      let mainImageName;

      if(files.mainImage) {
         if(files.mainImage[0]) {
            mainImageName = files.mainImage[0].filename;
         }
      }

      const query = `UPDATE products SET type = $1, name_pl = $2, name_en = $3, description_pl = $4, description_en = $5, 
   details_pl = $6, details_en = $7, price = $8, main_image = COALESCE($9, main_image), slug = $10, show_on_homepage = $11, priority = $12 
   WHERE id = $13`;
      const values = [type, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, price, mainImageName, slug, showOnHomepage, priority, id];

      if(files.gallery) {
         deleteProductGallery(id)
             .then(() => {
                db.query(query, values, (err, res) => {
                   if(res) {
                      addGallery(files.gallery, id, response);
                   }
                   else {
                      response.status(500).end();
                   }
                });
             })
             .catch(() => {
                response.status(500).end();
             });
      }
      else {
         db.query(query, values, (err, res) => {
            if(res) {
               response.status(201).end();
            }
            else {
               response.status(500).end();
            }
         });
      }
   }
   catch(err) {
      response.status(500).end();
   }
});

router.post('/add', upload.fields([
   { name: 'gallery', maxCount: 10 },
   { name: 'mainImage', maxCount: 1 }
]), (request, response) => {
   const { namePl, nameEn, descPl, descEn, detailsPl, detailsEn, type, price, showOnHomepage, priority } = request.body;

   const files = request.files;
   const mainImageName = files.mainImage[0].filename;
   const slug = createSlug(namePl);

   const query = `INSERT INTO products VALUES (nextval('product_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, $10, $11, $12) RETURNING id`;
   const values = [type, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, price, mainImageName, slug, showOnHomepage, priority];

   db.query(query, values, (err, res) => {
      if(res) {
         const id = res.rows[0]?.id;
         if(id) {
            if(files.gallery) {
               addGallery(files.gallery, id, response);
            }
            else {
               response.send({
                  result: id
               });
            }
         }
         else {
            response.status(500).end();
         }
      }
      else {
         response.status(500).end();
      }
   });
});

router.get('/get-homepage-models', (request, response) => {
   const query = `SELECT p.id, p.slug, p.name_pl, p.name_en, p.main_image,
                  s.counter, (SELECT COUNT(*)
                  FROM addons_for_products afp
                  LEFT OUTER JOIN addons_options ao ON afp.addon = ao.addon
                  LEFT OUTER JOIN addons_stocks ad_stocks ON ad_stocks.addon_option = ao.id
                  LEFT OUTER JOIN stocks s ON s.id = ad_stocks.stock
                  WHERE afp.product = p.id AND ao.hidden = FALSE AND s.counter <= 0) as addons_not_available
                  FROM products p 
                  JOIN types t ON p.type = t.id
                  JOIN products_stocks ps ON ps.product = p.id
                  JOIN stocks s ON s.id = ps.stock 
                  WHERE p.hidden = FALSE AND p.show_on_homepage = TRUE 
                  ORDER BY p.priority DESC`;

   dbSelectQuery(query, [], response);
});

router.delete('/delete', (request, response) => {
   const id = request.query.id;

   const deleteProductFromDatabase = (id) => {
      const query = 'UPDATE products SET hidden = TRUE WHERE id = $1';
      const values = [id];

      db.query(query, values, (err, res) => {
         if(res) {
            const query = `DELETE FROM products_stocks 
               WHERE product = $1 AND (SELECT COUNT(product) FROM products_stocks WHERE stock = (
                     SELECT stock FROM products_stocks WHERE product = $1
               )) = 1`;
            const values = [id];

            db.query(query, values, (err, res) => {
               if(res) {
                  const query = `DELETE FROM waitlist WHERE product = $1`;
                  const values = [id];

                  dbInsertQuery(query, values, response);
               }
               else {
                  response.status(500).end();
               }
            })
         }
         else {
            response.status(500).end();
         }
      });
   }

   if(id) {
      // Send info to waitlist and clear it
      const query = `SELECT email FROM waitlist WHERE product = $1`;
      const values = [id];

      db.query(query, values, (err, res) => {
         if(res) {
            const mails = res?.rows?.map((item) => (item.email));

            if(mails?.length) {
               let mailOptions = {
                  from: process.env.EMAIL_ADDRESS_WITH_NAME,
                  to: mails,
                  subject: 'Model niedostępny',
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
                    Model, na który czekałaś/czekałeś nie jest już niestety dostępny w naszym sklepie. Sprawdź nasze pozostałe modele na anna-vinbotti.com.
                </p>
                <p style="color: #B9A16B; margin: 20px 0 0 0;">Pozdrawiamy</p>
                <p style="color: #B9A16B; margin: 0;">Zespół Anna Vinbotti</p>
                </div>`
               }

               transporter.sendMail(mailOptions, function(error, info) {
                  deleteProductFromDatabase(id);
               });
            }
            else {
               deleteProductFromDatabase(id);
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

router.post('/add-addons-for-product', (request, response) => {
   const { product, addons } = request.body;

   const addonsList = JSON.parse(addons);

   if(addonsList?.length) {
      addonsList.forEach((item, index, array) => {
         const query = `INSERT INTO addons_for_products VALUES ($1, $2, $3, $4, $5)`;
         const values = [product, item.addon, item.ifAddon, item.isEqual, item.priority];

         db.query(query, values, (err, res) => {
            if(index === array.length-1) {
               if(res) {
                  response.status(201).send();
               }
               else {
                  response.status(500).end();
               }
            }
         });
      });
   }
   else {
      response.status(201).end();
   }
});

router.get('/get-addons-conditions-by-product', (request, response) => {
   const id = request.query.id;

   const query = 'SELECT * FROM addons_conditions WHERE product = $1';
   const values = [id];

   dbSelectQuery(query, values, response);
});

router.get('/update-stocks-in-cart', (request, response) => {
   const ids = request.query.ids;
   const idsArray = ids?.split(',');

   if(idsArray?.length) {
      const query = `SELECT p.id, s.counter, s.id as stock_id 
                     FROM products p
                     JOIN products_stocks ps ON p.id = ps.product
                     JOIN stocks s ON s.id = ps.stock
                     WHERE p.id = ANY($1)`;
      const values = [idsArray];

      dbSelectQuery(query, values, response);
   }
   else {
      response.status(400).end();
   }
});

router.get('/get-product-addons', (request, response) => {
   const product = request.query.id;

   const query = `SELECT ao.id as addon_option_id, ao.name_pl as addon_option_name_pl, ao.name_en as addon_option_name_en, a.id, ao.image, ao.stock, 
                  a.name_pl as addon_name_pl, a.name_en as addon_name_en, a.info_pl, a.info_en, ao.tooltip_pl, ao.tooltip_en, afp.priority, afp.show_if, afp.is_equal, a.addon_type   
                  FROM addons a 
                  LEFT OUTER JOIN addons_for_products afp ON afp.addon = a.id 
                  JOIN addons_options ao ON ao.addon = a.id
                  WHERE afp.product = $1 AND ao.hidden = FALSE`;
   const values = [product];

   dbSelectQuery(query, values, response);
});

router.delete('/delete-addons-for-product', (request, response) => {
   const id = request.query.id;

   const query = 'DELETE FROM addons_for_products WHERE product = $1';
   const values = [id];

   dbInsertQuery(query, values, response);
});

router.get('/get-all-waitlists', (request, response) => {
   const query = `SELECT COUNT(*) as waitlist_size, p.id, p.name_pl as product_name FROM products p 
                  JOIN waitlist w ON p.id = w.product
                  GROUP BY (p.id, p.name_pl)`;

   dbSelectQuery(query, [], response);
});

router.get('/get-waitlist-by-product-id', (request, response) => {
   const id = request.query.id;

   const query = 'SELECT email, date FROM waitlist WHERE product = $1';
   const values = [id];

   dbSelectQuery(query, values, response);
});

module.exports = router;
