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

module.exports = account;
