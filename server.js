const dotenv = require("dotenv").config({path:"./config.env"})
const app = require("./app.js")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DB).then(()=>{
    console.log("connected to the db")
})

app.listen(3000,()=>{
    console.log("lstning to the port 3000....")
})
