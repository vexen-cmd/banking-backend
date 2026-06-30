const express = require("express")
const verify = require("../middleware/token.verify")
const tController = require("../controller/transaction.controller")
const router = express.Router()

router.post("/pay",verify,tController.createTransaction)

module.exports = router