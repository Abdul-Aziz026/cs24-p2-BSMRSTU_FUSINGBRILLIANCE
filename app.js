
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute.js')
const cors = require('cors');
require("./databaseConCheck.js");

app.use(cors());

app.use(bodyParser.json());

app.get("/home", (req, res)=>{
    res.send("home page");
})
app.use('/users',userRoute);

app.listen(8000, () => {
    console.log('8000 page listen')
})
