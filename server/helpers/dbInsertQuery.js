const db = require("../database/db");

const dbInsertQuery = (query, values, response) => {
    try {
        db.query(query, values, (err, res) => {
            if(res) {
                response.send({
                    result: 1
                });
            }
            else {
                response.send({
                    result: 0
                });
            }
        });
    }
    catch(err) {
        response
            .status(500)
            .end();
    }
}

module.exports = dbInsertQuery;
