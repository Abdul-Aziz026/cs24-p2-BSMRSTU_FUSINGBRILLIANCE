
<<<<<<< HEAD
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
=======
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require("./databaseConCheck.js");

app.use(bodyParser.json());

app.get("/home", (req, res)=>{
    res.send("home page");
})

// vehicle route....
const vehicleRoute = require('./routes/vehiclesRoute.js');
app.use('/vehicles', vehicleRoute);

// vehicle route....
const stsRoute = require('./routes/stsRoute.js');
app.use('/sts', stsRoute);

// waste collection route....
const wasteCollectionRoute = require('./routes/waste_collectionRoute.js');
app.use('/waste_collection', wasteCollectionRoute);

// Landfill transfar route....
const LandfillTransferRoute = require('./routes/LandfillTransferRouter.js');
app.use('/landfill_transfer', LandfillTransferRoute);

app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch...
>>>>>>> 6bd435a687b37b6fc71c3809e69e5881b665aeb4
