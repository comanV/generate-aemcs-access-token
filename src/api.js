const express = require("express");
const serverless = require("serverless-http");
const exchange = require("@adobe/aemcs-api-client-lib");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

router.post('/accessToken', (req, res) => {
    const config = req.body.config;
    exchange(config).then(accessToken => {
        res.json({
            accessToken: accessToken["access_token"]
        })
    }).catch(() => {
        res.status(500).send({error: "Failed to get access token"})
    });
})

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);