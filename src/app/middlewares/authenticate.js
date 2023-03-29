const jwt = require('jsonwebtoken');
require("dotenv").config();
const authController = require("../controllers/AuthController");


const authenticate = (req, res, next) => {
     let accountCache = authController.getCache();
     try {
          const token = req.headers.authorization.split(' ')[1]
          const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
          if(accountCache.get(decode.username) && token == accountCache.get(decode.username).accessToken) {
               req.jwtDecode = decode
               next()
          } else {
               throw new Error("Credential is invalid!");
          }
     } catch(error) {
          if(error.name == "TokenExpiredError") {
               res.status(401).json({
                    message: "Token Expired!"
               })
          } else if(error.message == "Credential is invalid!") {
               res.status(401).json({
                    message: "Credential is invalid!"
               })
          } else {
               res.json({
                    message: 'Authentication Failed'
               })
          }
     }
}

module.exports = authenticate