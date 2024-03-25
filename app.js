const express = require('express')
const app = express();
app.get('/',(req,res)=>{
    res.send('succesfullysd')
})
app.listen(8000, () => {
    console.log('8000 page listen')
})