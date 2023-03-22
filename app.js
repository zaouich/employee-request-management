const express = require("express")
const cookiePasrser = require("cookie-parser")
const errController = require("./controllers/errController")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cookiePasrser())
app.use((req,res,next)=>{
    console.log(req.cookies)
    next()
})
app.use(cors({
    credentials:true,
    origin:"http://localhost:3001",
}))
const usersRouter = require("./routes/usersRouter")
const companysRouter = require("./routes/companysRouter")
const memberShipsRouter = require("./routes/memberShipsRouter")
module.exports = app

app.use("/api/v1/users",usersRouter)
app.use("/api/v1/companys",companysRouter)
app.use("/api/v1/memberShipsRouter",memberShipsRouter)
app.use(errController)