const jwt = require('jsonwebtoken');
const util = require('util');
const { pool } = require('../database/dbConfig');
const poolQuery = util.promisify(pool.query).bind(pool);

// expects { field_name: some_value }

// TODO: Set what determines a valid token
// TODO: Add checkJWT middleware to endpoints requiring it.

async function checkJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const JWT = authHeader.split(' ')[1];
    if (JWT == null) return res.sendStatus(401);

    jwt.verify(JWT, process.env.JWT_SECRET, async (err, field) => {
        if (err) {
            // Only if the token expired, attempt to refresh.
            if (err.name === 'TokenExpiredError') {
                // Validation
                const field_name = jwt.decode(JWT).field_name;
                const check_field = (await poolQuery('SELECT field_name FROM table WHERE field_name = $1', [field_name])).rows[0];

                // Forbidden on field failure
                if (check_field.length === 0) return res.sendStatus(403);

                // Refresh Token
                // TODO: add logic for conditional refreshing
                // TODO: add logic for if token is expired for too long.
                const newJWT = jwt.sign({ field_name: field_name }, process.env.JWT_SECRET, { expiresIn: '10m' });

                // Add refreshed token to headers
                res.setHeader('Authorization', 'Bearer ' + newJWT);
                field = {
                    field_name:field_name
                }
                req.field = field;
                next();
            } else {
                // TODO: Handle other possible errors.
                console.log(err);
                return res.sendStatus(403);
            }
        } else {
            req.field = field;
            next();
        }
    })
}


module.exports = checkJWT;