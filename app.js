const express = require('express')
const app = express();
require("./databaseConCheck.js");

app.get("/home", (req, res)=>{
    res.send("home page");
})
app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch...