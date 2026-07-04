require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../user.model/user.model");

async function verify(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "unauth" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findById(decoded.userId);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

async function isSystemUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "unauth" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    const user = await userModel.findById(decoded.userId).select("+systemUser");
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {verify , isSystemUser};
