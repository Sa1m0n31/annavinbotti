const express = require("express");
const router = express.Router();
const db = require("../database/db");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/products' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

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
   const query = 'SELECT p.id, t.name_pl as type, p.name_pl, p.name_en, p.description_pl, p.description_en, p.details_pl, p.details_en, p.price, p.main_image FROM products p JOIN types t ON p.type = t.id WHERE p.hidden = FALSE';

   dbSelectQuery(query, [], response);
});

router.get('/get-shop-page', (request, response) => {
   const query = `SELECT p.id, t.name_pl as type_pl, t.name_en as type_en, t.id as type_id,  
                  p.slug, p.name_pl, p.name_en, p.description_pl, p.description_en, 
                  p.details_pl, p.details_en, p.price, p.main_image,
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
                  WHERE p.hidden = FALSE ORDER BY p.priority DESC`;

   dbSelectQuery(query, [], response);
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
                  p.description_pl, p.description_en, p.details_pl, p.details_en, p.price, p.main_image, s.counter,
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

   console.log(namePl);

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

      db.query(query, values, (err, res) => {
         if(res) {
            if(files.gallery) {
               deleteProductGallery(id)
                   .then(() => {
                      addGallery(files.gallery, id, response);
                   });
            }
            else {
               response.status(201).end();
            }
         }
         else {
            console.log(err);
            response.status(500).end();
         }
      });
   }
   catch(err) {
      console.log(err);
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

   if(id) {
      const query = 'UPDATE products SET hidden = TRUE WHERE id = $1';
      const values = [id];

      dbInsertQuery(query, values, response);
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

router.get('/get-product-addons', (request, response) => {
   const product = request.query.id;

   const query = `SELECT ao.id as addon_option_id, ao.name_pl as addon_option_name_pl, ao.name_en as addon_option_name_en, a.id, ao.image,
                  a.name_pl as addon_name_pl, a.name_en as addon_name_en, afp.priority, afp.show_if, afp.is_equal, a.addon_type   
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
