const transactionModel = require("../user.model/transaction.model");
const accountModel = require("../user.model/account.model");
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

}

module.exports = { createTransaction };
