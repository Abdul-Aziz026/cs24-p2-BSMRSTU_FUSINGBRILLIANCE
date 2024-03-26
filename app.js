
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