const insertNewAlertQuery = `
    INSERT INTO alert (patient_id, alert_type)
    VALUES ($1, $2)
    RETURNING alert_id
`;

module.exports = {
    insertNewAlertQuery
};