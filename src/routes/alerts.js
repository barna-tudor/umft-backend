// UNUSED FOR NOW

const express = require('express');
const alertsRouter = express.Router();
const {createAlert} = require('../services/alerts');
const checkJWT = require('./auth');

alertsRouter.post('/alert', checkJWT, createAlert);

module.exports = alertsRouter;