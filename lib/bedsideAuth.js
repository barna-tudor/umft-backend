const {pool, poolQuery} = require('../src/database/dbConfig');
const crypto = require('crypto');
const expressAsyncHandler = require("express-async-handler");

const checkAPIKeyQuery = `
    SELECT *
    FROM bedside_api_keys
    WHERE api_key_hash = $1
`;

const authenticateApiKey = expressAsyncHandler(async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(403).json({error: 'API key missing'});
    }

    const hashedApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    try {
        const result = await pool.query(checkAPIKeyQuery, [hashedApiKey]);
        if (result.rows.length === 0) {
            return res.status(403).json({error: 'Invalid API key'});
        }
        req.client = result.rows[0];
        await next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({success: false, error: err.message});
    }
});

module.exports = {
    authenticateApiKey,
}
