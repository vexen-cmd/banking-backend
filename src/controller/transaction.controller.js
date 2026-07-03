const transactionModel = require("../user.model/transaction.model");
const accountModel = require("../user.model/account.model");
const ledgerModel = require("../user.model/ledger.model")
const mongoose = require("mongoose")
const emailSender = require("../services/email.services")

async function createTransaction(req, res) {
  const { fromAccout, toAccount, status, amount, idempotencyKey } = req.body;

  if (!fromAccout || !toAccount || !status || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "please enter all the details" });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccout,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({ message: "please enter right account" });
  }

  const isTransactionAlreadyProcessed = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyProcessed) {
    if (isTransactionAlreadyProcessed.status === "COMPLETED") {
      return res.status(200).json({ message: "transaction completed" });
    }
    if (isTransactionAlreadyProcessed.status === "PENDING") {
      return res.status(200).json({ message: "transaction is pending" });
    }
    if (isTransactionAlreadyProcessed.status === "FAILED") {
      return res.status(400).json({ message: "transaction Failed" });
    }
    if (isTransactionAlreadyProcessed.status === "REVERSED") {
      return res.status(400).json({ message: "transaction Reversed" });
    }
  }

  if(fromAccout.status !== "ACTIVE" || toAccount.status !== "ACTIVE"){
    return res.status(400).json({message:"account has to be active"})
  }

  const balance = await fromAccout.getBalance()

  if(balance < amount){
    return res.status(400).json({message:`insufficient balance ${balance}`})
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  // created session so that if any steps went wrong the transaction doesnt happens

  const transaction = await transactionModel.create({
    fromAccount,
    toAccount,
    status:"PENDING",
    amount,
    idempotencyKey
  },{session})

  const debitLedgerEntry = await ledgerModel.create({
    account:fromAccout,
    amount,
    transactions:transaction._id,
    type:"DEBIT"
  },{session})

  
  const creditLedgerEntry = await ledgerModel.create({
    account:toAccout,
    amount,
    transactions:transaction._id,
    type:"CREDIT"
  },{session})

  transaction.status = "COMPLETED"
  await transaction.save({session})

  await session.commitTransaction()
  session.endSession()

  res.status(201).json(message = "transaciton done succesfully",transaction)

  await emailSender(req.user.email,req.user.name,amount,toAccount)  
}

module.exports = { createTransaction };
