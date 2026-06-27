const express = require("express")
const verify = require("../middleware/token.verify")
const account = require("../controller/accounts.controller")
const router = express.Router()


router.post("/account", verify, account);

module.exports = router