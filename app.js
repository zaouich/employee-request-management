const express = require("express")
const cookiePasrser = require("cookie-parser")
const errController = require("./controllers/errController")
const app = express()
app.use(express.json())
app.use(cookiePasrser())
const usersRouter = require("./routes/usersRouter")
module.exports = app

app.use("/api/v1/users",usersRouter)
app.use(errController)