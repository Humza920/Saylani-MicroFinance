const express = require("express")
const {applyLoan , getUserLoans , updateloanstatus} = require("../controllers/loanController")
const {authorizeRoles} = require("../middlewares/role")
const {protect} = require("../middlewares/auth")

const loanRouter = express.Router()


loanRouter.post("/applyloan",protect,authorizeRoles("User") ,applyLoan)
loanRouter.get("/myloan",protect,authorizeRoles("User") ,getUserLoans)
loanRouter.post("/:id/updateloanstatus",protect,authorizeRoles("Admin") ,updateloanstatus)

module.exports = loanRouter