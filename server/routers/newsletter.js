const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer  = require('multer')
const upload = multer({ dest: 'media/blog' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/', (request, response) => {
   const query = 'SELECT * FROM newsletter WHERE active = TRUE';

   dbSelectQuery(query, [], response);
});

router.post('/add', (request, response) => {
   const { email } = request.body;

   const query = `INSERT INTO newsletter VALUES (next_val('newsletter_seq'), $1, TRUE)`;
   const values = [email];

   dbInsertQuery(query, values, response);
});

module.exports = router;
