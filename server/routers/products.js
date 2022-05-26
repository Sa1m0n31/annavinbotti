const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/products' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/get-all', (request, response) => {
   const query = 'SELECT p.id, t.name_pl as type, p.name_pl, p.name_en, p.description_pl, p.description_en, p.details_pl, p.details_en, p.price, p.main_image FROM products p JOIN types t ON p.type = t.id WHERE p.hidden = FALSE';

   dbSelectQuery(query, [], response);
});

router.get('/get', (request, response) => {
   const id = request.query.id;

   if(id) {
      const query = 'SELECT * FROM products WHERE id = $1 AND hidden = FALSE';
      const values = [id];

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
         console.log(err);
         if(index === array.length-1) {
            response.status(201).end();
         }
      });
   });
}

router.post('/add', upload.fields([
   { name: 'gallery', maxCount: 10 },
   { name: 'mainImage', maxCount: 1 }
]), (request, response) => {
   const { namePl, nameEn, descPl, descEn, detailsPl, detailsEn, type, price } = request.body;

   const files = request.files;
   const mainImageName = files.mainImage[0].filename;

   console.log(files);

   const query = `INSERT INTO products VALUES (nextval('product_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE) RETURNING id`;
   const values = [type, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, price, mainImageName];

   db.query(query, values, (err, res) => {
      if(res) {
         const id = res.rows[0]?.id;
         if(id) {
            if(files.gallery) {
               addGallery(files.gallery, id, response);
            }
            else {
               response.status(201).end();
            }
         }
         else {
            response.status(500).end();
         }
      }
      else {
         console.log(err);
         response.status(500).end();
      }
   });
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


});

router.delete('/delete-addons-for-product', (request, response) => {

});

module.exports = router;