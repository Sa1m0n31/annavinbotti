const db = require("./database/db");
const crypto = require('crypto');
const LocalStrategy = require("passport-local").Strategy;

const init = (passport) => {
    const userAuth = (username, password, done) => {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        let query = 'SELECT id, active FROM users WHERE email = $1 AND password = $2';
        let values = [username, hash];

        // Remember me auth
        if(password === process.env.AUTH_SECRET_KEY) {
            query = 'SELECT id, active FROM users WHERE email = $1';
            values = [username];
        }

        db.query(query, values, (err, res) => {
            if(res) {
                const user = res.rows[0];
                if(!user) {
                    return done(null, false, { message: 'credentials' });
                }
                else if(user.active === false) {
                    return done(null, false, { message: 'verification' });
                }
                else {
                    return done(null, user);
                }
            }
            else {
                return done(err, false, { message: "Coś poszło nie tak..." });
            }
        });
    }

    passport.use('user-local', new LocalStrategy(userAuth, (ver) => {
        console.log(ver);
    }));

    passport.serializeUser((user, done) => {
        if(user) {
            done(null, user.id);
        }
        else done(null, null);
    });

    passport.deserializeUser((id, done) => {
        if(id) {
            done(null, id);
        }
        else {
            done(null, null);
        }
    });
}

module.exports = init;
