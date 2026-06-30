const express = require("express")
const verify = require("../middleware/token.verify")
const ledgerController = require("../controller/ledger.controller")
const router = express.Router()

router.post("/ledger",verify,ledgerController.ledger)

module.exports = router