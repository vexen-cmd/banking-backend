const userModel = require("../user.model/user.model");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const emailSender = require('../services/email.services');
const tokenBlackListModel = require("../user.model/tokenBlackList.model");
require("dotenv").config();

async function userRegister(req, res) {
  const { email, name, password } = req.body;

  const isAlreayExists = await userModel.findOne({ email });

  if (isAlreayExists) {
    return res.status(404).json({ message: "already a user" });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "register completed",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });

  await emailSender.regisMail(user.email , user.name)

}

async function loginUser(req, res) {
  const { email, name, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { name }],
  },
).select("+password");

  if (!user) return res.status(404).json({ message: "not a valid user" });

  // const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = await user.comparePassword(password)
  

  if (!isPasswordValid) {
    return res.status(400).json({ message: "unauth" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  return res.status(200).json({ message: "logged in",
    email:user.email,
    name:user.name
   });
}

async function logOut(req,res) {
  
  const token = req.cookies.token

  if(!token){
    return res.stauts(400).json({message:"token is missing"})
  }

  await tokenBlackListModel.create({
    token
  })

  res.clearCookie("token")

  res.status(200).json({
    message:"user logged out successfully"
  })
}

module.exports = { userRegister, loginUser , logOut };
