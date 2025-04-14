const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const verifyJWT = (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
}

module.exports = verifyJWT;