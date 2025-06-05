const express = require("express");
const patientsRouter = express.Router();
const {
    newPatient, getPatientByUUID, archivePatient, dischargePatient, getPatientsByRoom, getPatientsByWard
} = require("../services/patients");


patientsRouter.post("/newPatient", async (req, res) => {
    try {
        return await newPatient(req, res);
    } catch (err) {
    }
});

patientsRouter.get("/patient/:UUID", async (req, res) => {
    try {
        return await getPatientByUUID(req, res);
    } catch (err) {
    }
});

patientsRouter.post("/patient/:UUID/archive", async (req, res) => {
    try {
        return await archivePatient(req, res);
    } catch (err) {
    }
});

patientsRouter.post("/patient/:UUID/discharge", async (req, res) => {
    try {
        return await dischargePatient(req, res);
    } catch (err) {
    }
});

patientsRouter.get("/room/:id/patients", async (req, res) => {
    try {
        return await getPatientsByRoom(req, res);
    } catch (err) {
    }
});

patientsRouter.get("/ward/:id/patients", async (req, res) => {
    try {
        return await getPatientsByWard(req, res);
    } catch (err) {
    }
});


module.exports = patientsRouter;