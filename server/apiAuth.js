class BasicAuth {
    basicAuth(req, res, next) {
        const verifyUser = (username, password) => {
            return username === process.env.API_AUTH_USERNAME && password === process.env.API_AUTH_PASSWORD;
        }

        console.log(req.headers.authorization);

        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }

        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if(!verifyUser(username, password)) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }

        next();
    }
}

module.exports = BasicAuth;
