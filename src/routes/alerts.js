const express = require("express");
const alertsRouter = express.Router();
const {createAlert} = require("../services/alerts");
const {authenticateApiKey} = require("../../lib/bedsideAuth");


alertsRouter.post("/alert", authenticateApiKey, async (req, res) => {
    try {
        return await createAlert(req, res);
    } catch (err) {
        //TODO
    }
});

module.exports = alertsRouter;