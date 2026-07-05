const express = require("express")
const auth = require("../controller/auth.controller")
const router = express.Router()

router.post("/register",auth.userRegister)
router.post("/login",auth.loginUser)
router.post("/logout",auth.logOut)

module.exports = router