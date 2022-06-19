const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer  = require('multer')
const upload = multer({ dest: 'media/blog' })
const dbSelectQuery = require('../helpers/dbSelectQuery.js');
const dbInsertQuery = require('../helpers/dbInsertQuery');

router.get('/all', (request, response) => {
    const query = `SELECT a.id, a.title_pl, a.title_en, a.excerpt_pl, a.excerpt_en, i.path as image, a.publication_date 
                    FROM articles a 
                    JOIN images i ON a.main_image = i.id
                    WHERE a.hidden = FALSE`;

    dbSelectQuery(query, [], response);
});

router.get('/', (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = `SELECT a.id, a.title_pl, a.title_en, a.excerpt_pl, a.excerpt_en, a.content_pl, a.content_en, i.path as image, a.publication_date 
                    FROM articles a 
                    JOIN images i ON a.main_image = i.id
                    WHERE a.id = $1 AND a.hidden = FALSE`;
        const values = [id];

        dbSelectQuery(query, values, response);
    }
    else {
        response.status(401).end();
    }
});

router.post('/add', upload.single('image'), (request, response) => {
    const { titlePl, titleEn, contentPl, contentEn, excerptPl, excerptEn } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;
        const query = `INSERT INTO images VALUES (nextval('image_seq'), $1) RETURNING id`;
        const values = [filename];

        db.query(query, values, (err, res) => {
            if(res) {
                if(res.rows) {
                    const imageId = res.rows[0].id;
                    const query = `INSERT INTO articles VALUES (nextval('articles_seq'), $1, $2, $3, $4, $5, $6, $7, NOW(), FALSE)`;
                    const values = [titlePl, titleEn, contentPl, contentEn, imageId, excerptPl, excerptEn];

                    dbInsertQuery(query, values, response);
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
        const query = `INSERT INTO articles VALUES (nextval('articles_seq'), $1, $2, $3, $4, NULL, $5, $6, NOW(), FALSE)`;
        const values = [titlePl, titleEn, contentPl, contentEn, excerptPl, excerptEn];

        dbInsertQuery(query, values, response);
    }
});

router.put("/update", upload.single("image"), (request, response) => {
    const { id, titlePl, titleEn, excerptPl, excerptEn, contentPl, contentEn } = request.body;

    let filename;
    if(request.file) {
        filename = request.file.filename;
        const query = `INSERT INTO images VALUES (nextval('image_seq'), $1) RETURNING id`;
        const values = [filename];

        db.query(query, values, (err, res) => {
            if(res) {
                if(res.rows) {
                    const imageId = res.rows[0].id;
                    const query = `UPDATE articles SET title_pl = $1, title_en = $2, content_pl = $3, content_en = $4, excerpt_pl = $5, excerpt_en = $6, main_image = $7
                                    WHERE id = $8`;
                    const values = [titlePl, titleEn, contentPl, contentEn, excerptPl, excerptEn, imageId, id];

                    dbInsertQuery(query, values, response);
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
        let query = `UPDATE articles SET title_pl = $1, title_en = $2, content_pl = $3, content_en = $4, excerpt_pl = $5, excerpt_en = $6 
                            WHERE id = $7`;

        const values = [titlePl, titleEn, contentPl, contentEn, excerptPl, excerptEn, id];

        dbInsertQuery(query, values, response);
    }
});

router.delete("/delete", (request, response) => {
    const id = request.query.id;

    if(id) {
        const query = 'UPDATE articles SET hidden = TRUE WHERE id = $1';
        const values = [id];

        dbInsertQuery(query, values, response);
    }
    else {
        response.status(400).end();
    }
});

module.exports = router;
