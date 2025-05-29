const express = require('express');
const app = express();

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

const dontenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors())
const helmet = require('helmet');
app.use(helmet());

app.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})