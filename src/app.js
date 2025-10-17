const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))


module.exports = app