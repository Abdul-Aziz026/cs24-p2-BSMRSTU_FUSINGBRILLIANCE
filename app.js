const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require("mongoose");
const stsRoute = require('./routes/stsRouter.js');
require("./databaseConCheck.js");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define route for handling POST requests to /sts endpoint
app.use('/sts', stsRoute);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
