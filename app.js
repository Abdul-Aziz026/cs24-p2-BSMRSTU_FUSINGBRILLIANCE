const express = require('express')
const app = express();
require("./databaseConCheck.js");

app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch...