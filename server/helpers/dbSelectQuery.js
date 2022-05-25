const db = require("../database/db");

const dbSelectQuery = (query, values, response) => {
    try {
        db.query(query, values, (err, res) => {
            console.log(values);
            if(res) {
                console.log(res.rows);
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
