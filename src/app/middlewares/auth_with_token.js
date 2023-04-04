const jwt = require('jsonwebtoken');
require("dotenv").config();
let { authCache } = require('../services/cache');

const tokekChecking = (req, res, next) => {
     try {
          const token = req.headers.authorization.split(' ')[1]
          console.log(token);
          const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
          if(authCache.get(decode.username) && token == authCache.get(decode.username).accessToken) {
               req.jwtDecode = decode
               next()
          } else {
               throw new Error("Credential is invalid!");
          }
     } catch(error) {
          console.log(error);
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
                    message: 'Authentication Failedss'
               })
          }
     }
}

module.exports = tokekChecking