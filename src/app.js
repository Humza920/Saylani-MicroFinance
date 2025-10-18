const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const loanRouter = require("./routes/loanRoutes")
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))
app.use(cookieParser())
app.use("/api/auth" , authRouter)
app.use("/api/loan" , loanRouter)
module.exports = app
