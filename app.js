
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require("./databaseConCheck.js");

const path = require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// for serving public folder css file all place
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

app.get("/home", (req, res)=>{
    res.render("login.ejs");
});

// const mailsend= require('./routes/emailJsRoute.js');
// app.use("/user", mailsend);

// const mailSendRoute = require("./routes/emailSendRouter.js");
// app.use('/user', mailSendRoute);

// //user route...
const UserRoute = require('./routes/userRoutes.js');
app.use('/auth' , UserRoute);

// vehicle route....
const vehicleRoute = require('./routes/vehiclesRoute.js');
app.use('/vehicles', vehicleRoute);

// sts route....
const stsRoutes = require('./routes/stsRouter.js');
app.use('/sts', stsRoutes);

// waste collection route....
const wasteCollectionRoute = require('./routes/waste_collectionRoute.js');
app.use('/waste_collection', wasteCollectionRoute);

// Landfill transfar route....
const LandfillTransferRoute = require('./routes/LandfillTransferRouter.js');
app.use('/landfill_transfer', LandfillTransferRoute);

app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch.....
