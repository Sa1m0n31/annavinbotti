const db = require("../database/db");

const dbInsertQuery = (query, values, response = null) => {
    try {
        db.query(query, values, (err, res) => {
            if(response) {
                if(res) {
                    response?.status(201)?.end();
                }
                else {
                    response?.status(500)?.end();
                }
            }
        });
    }
    catch(err) {
        if(response) {
            response
                .status(500)
                .end();
        }
    }
}

module.exports = dbInsertQuery;
