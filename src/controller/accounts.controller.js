const accountModel = require("../user.model/account.model");

async function account(req, res) {
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

    const alreadyAccount = await accountModel.findOne({
    user: user._id,
  });

  if (alreadyAccount) {
    return res.status(400).json({
      message: "account already exists",
    });
  }

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(200).json({ message: "account logged in", user: user });
}

async function getAccount(req, res) {
  const user = await accountModel.find({ user: req.user._id });

  if (!user) {
    return res.status(400).json({ message: "not a user" });
  }

  return res.status(200).json({ message: "account fetched sucessfully", user });
}

async function getAccountBalance(req, res) {

  const account = await accountModel.findOne({
    user: req.user._id,
  });

  if (!account) {
    return res.status(400).json({ message: "not a user" });
  }

  const balance = await account.getBalance()

  res.status(200).json({message:`your current balance is ${balance}`, account})

}

module.exports = { account, getAccount, getAccountBalance };
