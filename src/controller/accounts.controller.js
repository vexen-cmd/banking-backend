const accountModel = require("../user.model/account.model");

async function account(req, res) {
  const user = req.user;
  
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const account = await accountModel.create({
    user: user._id,
  });

  res.send(account);
}

module.exports = account;
