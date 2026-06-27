const express = require ("express")
const router = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const cookieParser = require("cookie-parser")

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",router)
app.use("/api/accounts",accountRouter)
module.exports = app