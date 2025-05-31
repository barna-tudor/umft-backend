const expressAsyncHandler = require('express-async-handler');
const util = require('util');
const {pool} = require('../database/dbConfig');
const ErrorWrapper = require("../errorWrapper");
const poolQuery = util.promisify(pool.query).bind(pool);
const {insertNewAlertQuery} =
    require('../database/queries/alerts');
const {getPublisher} = require('../redis');


const createAlert = expressAsyncHandler(async (req, res) => {
    const {ward_id, room_id, bed_id, patient_id, alert_type} = req.body;
    const pub = await getPublisher();
    const channel = `ward:${ward_id}`;
    console.log('channel', channel);
    try {
        const result = await poolQuery(insertNewAlertQuery, [patient_id, alert_type]);
        await pub.publish(channel, JSON.stringify({
            ward_id: ward_id, room_id: room_id, bed_id: bed_id, alert_type: alert_type,
        }))
        console.log(JSON.stringify({
            ward_id: ward_id, room_id: room_id, bed_id: bed_id, alert_type: alert_type,
        }))
        // TODO: update patient record.
        return res.status(201).json({
            status: 201, success: true, result: {alert_id: result.rows[0].alert_id}
        });
    } catch (error) {
        if (error instanceof ErrorWrapper) {
            return res.status(error.code).json({
                status: error.code, success: false, error: {
                    name: error.name, message: error.message,
                }
            });
        } else {
            console.error(error);
            return res.status(500).json({
                status: 500, success: false, error: {
                    name: error.name, message: error.message,
                }
            });
        }
    }

})


module.exports = {createAlert};