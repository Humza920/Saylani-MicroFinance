const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const loanRouter = require("./routes/loanRoutes")
const paymentRouter = require("./routes/paymentRoutes")
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))
app.use(cookieParser())
app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});
app.use("/api/auth" , authRouter)
app.use("/api/loan" , loanRouter)
app.use("/api/payloan" , paymentRouter)

module.exports = app
