const express = require ("express")
const router = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")
const cookieParser = require("cookie-parser")

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",router)
app.use("/api/accounts",accountRouter)
app.use("/api/transaction",transactionRouter)

module.exports = app