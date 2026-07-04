const express = require("express")
const {verify} = require("../middleware/verification.middleware")
const {isSystemUser} = require("../middleware/verification.middleware")
const tController = require("../controller/transaction.controller")
const router = express.Router()

router.post("/pay",verify,tController.createTransaction)
router.post("/initialFunds",isSystemUser,tController.createInitialTransaction)
// change the controller for system user
module.exports = router