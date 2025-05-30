const insertNewAlertQuery =
    `INSERT INTO alert (patient_id, alert_type)
     VALUES ($2, $3)`;

module.exports = {
    insertNewAlertQuery
};