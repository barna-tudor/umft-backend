const expressAsyncHandler = require("express-async-handler");
const {pool, poolQuery} = require("../database/dbConfig");
const ErrorWrapper = require("../errorWrapper");
const {getPublisher} = require("../../lib/redis");
require("../database/queries/patients");

const newPatient = expressAsyncHandler(async (req, res) => {
    let {ward_id, room_id, bed_id} = req.body;
    const client = await pool.connect();
    // Publish to a message channel?
    // const pub = await getPublisher();
    // const channel = `ward:${ward_id}`;

    try {
        // if not provided, get the first available bed
        if (room_id == null || bed_id == null) {
            let available_beds = (await poolQuery(getAvailableBedQuery, [ward_id])).rows[0];
            if (available_beds) {
                ({room_id, bed_id} = available_beds);
            }
        }

        await client.query("BEGIN");
        const result = await client.query(insertNewPatientQuery, [ward_id, room_id, bed_id]);
        await Promise.all([poolQuery(updateWardOccupancyQuery, [ward_id]), poolQuery(updateRoomOccupancyQuery, [room_id]), poolQuery(updateBedIsOccupiedQuery, [bed_id])]);
        await client.query("COMMIT");

        return res.status(201).json({status: 201, success: true, result: {patient_id: result.rows[0].patient_id}});
        // await pub.publish(channel,...)
    } catch (err) {
        await client.query("ROLLBACK");
        return res.status(500).json({status: 500, success: false, result: {error: err}});
    } finally {
        client.release();
    }
});

module.exports = {
    newPatient, getPatientByUUID, archivePatient, dischargePatient, getPatientsByRoom, getPatientsByWard
};