const express = require('express')
const app = express();
console.log('hi');
app.get('/',(req,res)=>{
    res.send("HI")
})
app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz fuadul