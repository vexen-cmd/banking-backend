const transactionModel = require("../user.model/transaction.model");
const accountModel = require("../user.model/account.model");
const ledgerModel = require("../user.model/ledger.model");
const mongoose = require("mongoose");
const emailSender = require("../services/email.services");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "please enter all the details" });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
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

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({ message: "account has to be active" });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({ message: `insufficient balance ${balance}` });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  // created session so that if any steps went wrong the transaction doesnt happens

  const transaction = (
    await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          status: "PENDING",
          amount,
          idempotencyKey,
        },
      ],
      { session },
    )
  )[0];

     await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount,
        transactions: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

   await ledgerModel.create(
    [
      {
        account: toAccount,
        amount,
        transactions: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  // console.log(transaction._id);

  // const updated = await transactionModel.findOneAndUpdate(
  //   { _id: transaction._id },
  //   { status: "COMPLETED" },
  //   { session, returnDocument: "after"},
  // );

  await session.commitTransaction();
  session.endSession();

  res
    .status(201)
    .json({ message: "transaciton done succesfully", transaction:transaction });

  await emailSender.transactionMail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );
}

async function createInitialTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(403).json({ message: "forbidden" });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({ message: "this account doesnt exist" });
  }

  const user = req.user._id;
  const fromUserAccount = await accountModel.findOne({
    user,
  });

  if (!fromUserAccount) {
    return res.status(400).json({ message: "system user account not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaciton =( await transactionModel.create([{
    fromAccount: fromUserAccount._id,
    toAccount,
    status: "PENDING",
    amount,
    idempotencyKey,
  }],{session})) [0];

   await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        type: "DEBIT",
        amount,
        transactions: transaciton._id,
      },
    ],
    { session },
  );

   await ledgerModel.create(
    [
      {
        account: toAccount,
        type: "CREDIT",
        amount,
        transactions: transaciton._id,
      },
    ],
    { session },
  );

  transaciton.status = "COMPLETED";
  await transaciton.save({ session });

  await session.commitTransaction();
  session.endSession();

  // addons add a feature so that user gets a email whenveer bank sends him money

  res
    .status(201)
    .json({ message: "inial funds transfer completed", transaciton });
}

module.exports = { createTransaction, createInitialTransaction };
