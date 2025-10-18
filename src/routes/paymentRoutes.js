const express = require("express")
const {makePayment} = require("../controllers/paymentController")
const {authorizeRoles} = require("../middlewares/role")
const {protect} = require("../middlewares/auth")

const paymentRouter = express.Router()

paymentRouter.post("/makePayment" , protect , authorizeRoles("User") , makePayment) 

module.exports = paymentRouter