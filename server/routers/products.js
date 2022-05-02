const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/addons' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/get-all', (request, response) => {
   const query = 'SELECT * FROM products WHERE hidden = FALSE';

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

router.post('/add-product', (request, response) => {

});

module.exports = router;
