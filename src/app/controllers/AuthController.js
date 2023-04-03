const AccountDocument = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var { validationResult } = require("express-validator");
const accountService = require("../services/AccountService");
let { authCache } = require("../services/cache");

class AuthController {
    async signup(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: errors.array()[0].msg
            });
        } else {
            let result = await accountService.signup(req, res);
            if (result) {
                res.status(result.status).json({
                    result
                });
            }
        }
    }

    async signin(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(401).json({
                message: errors.array()[0].msg,
            });
        } else {
            let result = await accountService.signin(req, res);
            if (result) {
                req.session.currentUser = {
                    "accountId": result.accountId,
                    "role": result.role
                }
                console.log(req.session);
                res.status(200).json({ result });
            }
        }
    }

    async refreshToken(req, res, next) {
        let response = await accountService.refreshToken(req, res);
        if (response) {
            res.status(response.status).json({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });
        }
    }

    async signout(req, res, next) {
        let result = await accountService.signout(req, res);
        if (result) {
            console.log(result);
            res.status(result.status).json({
                result
            });
        }
    }

    async forgetPassword(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(401).json({
                message: errors.array()[0].msg,
            });
        } else {
            let result = await accountService.forgetPassword(req, res);
            if (result) {
                console.log(result);
                res.status(result.status).json({
                    result
                });
            }
        }
    }

    getAll(req, res, next) {
        AccountDocument.find({}).then((accounts) => {
            res.json({ accounts });
        });
    }
}

function getUsernameFromToken(accessToken) {
    try {
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return decode.username;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

module.exports = new AuthController();
