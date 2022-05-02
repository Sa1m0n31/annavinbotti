const db = require("./database/db");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const LocalStrategy = require("passport-local").Strategy;

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const init = (passport) => {
    const userAuth = (username, password, done) => {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const query = 'SELECT i.id, i.user_id, i.active FROM identities i LEFT OUTER JOIN users u ON i.user_id = u.id LEFT OUTER JOIN clubs c ON c.id = i.id WHERE ((LOWER(u.email) = LOWER($1) AND i.hash = $2) OR (LOWER(c.login) = LOWER($1) AND i.hash = $2))';
        const values = [username, hash];

        db.query(query, values, (err, res) => {
            if(res) {
                const user = res.rows[0];
                if(!user) {
                    return done(null, false, { message: 'Niepoprawna nazwa użytkownika lub hasło' });
                }
                else if(user.active === null && user.user_id === null) {
                    return done(null, false, { message: 'Twoje konto straciło ważność. Skontaktuj się z nami w sprawie odnowienia.' });
                }
                else if(user.active === null) {
                    return done(null, false, { message: 'Konto zawodnika zostało zablokowane' });
                }
                else if(user.active === false && user.user_id) {
                    return done(null, false, { message: 'Zweryfikuj swój adres email aby się zalogować' });
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

    const adminAuth = (username, password, done) => {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const query = 'SELECT id FROM admins WHERE LOWER(login) = LOWER($1) AND password = $2';
        const values = [username, hash];

        db.query(query, values, (err, res) => {
           if(res) {
               const admin = res.rows[0];
               if(!admin) {
                   return done(null, false, { message: 'Niepoprawna nazwa użytkownika lub hasło' });
               }
               else {
                   
                   return done(null, admin);
               }
           }
           else {
               return done(err, false, { message: "Coś poszło nie tak..." });
           }
        });
    }

    passport.use('admin-local', new LocalStrategy(adminAuth));

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
        let query, values, hash;

        if(id) {
            if(isNumeric(id.toString())) {
                /* Admin */
                query = 'SELECT id FROM admins WHERE id = $1';
                values = [id];

                db.query(query, values, (err, res) => {
                    if(res) {
                        if(res.rows.length) done(null, res.rows[0].id);
                    }
                });
            }
            else {
                /* User */
                query = 'SELECT i.id FROM identities i LEFT OUTER JOIN users u ON i.user_id = u.id LEFT OUTER JOIN clubs c ON i.id = c.id WHERE i.id = $1';
                values = [id];

                db.query(query, values, (err, res) => {
                    if(res) {
                        if(res.rows.length) done(null, res.rows[0].id);
                    }
                });
            }
        }
        else {
            done(null, null);
        }
    });
}

module.exports = init;
