const express = require("express")
const {verify} = require("../middleware/verification.middleware")
const {account , getAccount, getAccountBalance} = require("../controller/accounts.controller")
const router = express.Router()

router.post("/account", verify, account);
router.get("/", verify, getAccount);
router.get("/balance", verify, getAccountBalance);


module.exports = router