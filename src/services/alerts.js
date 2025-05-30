const expressAsyncHandler = require('express-async-handler');
const util = require('util');
const {pool} = require('../database/dbConfig');
const ErrorWrapper = require("../errorWrapper");
const poolQuery = util.promisify(pool.query).bind(pool);

const {insertNewAlertQuery} = require('../database/queries/alerts');

const createAlert = expressAsyncHandler(async (req, res) => {
    const {patient_id, alert_type} = req.body;
    try {
        const result = await poolQuery(insertNewAlertQuery, [patient_id, alert_type]);
        //TODO: async message-broker event.
        return res.status(201).json({
            status: 201,
            success: true,
            result: {alert_id: result.rows[0].alert_id}
        });
    } catch (error) {
        if (error instanceof ErrorWrapper) {
            return res.status(error.code).json({
                status: error.code,
                success: false,
                error: {
                    name: error.name,
                    message: error.message,
                }
            });
        } else {
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                error: {
                    name: error.name,
                    message: error.message,
                }
            });
        }
    }

})


module.exports = {}