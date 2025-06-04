const express = require("express");
const alertsRouter = express.Router();
const {createAlert} = require("../services/alerts");



alertsRouter.post("/alert", async (req, res) => {
    try {
        return await createAlert(req, res);
    } catch (err) {
        //TODO
    }
});

module.exports = alertsRouter;