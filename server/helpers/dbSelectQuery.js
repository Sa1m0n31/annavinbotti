const db = require("../database/db");

const dbSelectQuery = (query, values, response) => {
    try {
        db.query(query, values, (err, res) => {
            if(res) {
                response.send({
                    result: res.rows
                });
            }
            else {
                console.log(err);
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

module.exports = dbSelectQuery;
