const AccountDocument = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var { validationResult } = require("express-validator");
const accountService = require("../services/account-service");
let accountCache = new Map();

class AuthController {
    async signup(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors.array());
        } else {
            let result = await accountService.signup(req, res);
            if(result) {
                res.status(result.status).json({
                    message: result.message
                })
            }
        }
    }

    async login(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors.array());
        } else {
            let result = await accountService.authenticate(req, res)
            if(result) {
                res.status(result.status).json({
                    "accessToken": result.accessToken,
                    "refreshToken": result.refreshToken
                })
            }
        }
    }

    async refreshToken(req, res, next) {
        let response = await accountService.refreshToken(req, res);
        if(response) {
            res.status(response.status).json({
                "accessToken": response.accessToken,
                "refreshToken": response.refreshToken
            })
        }
    }

    async logout(req, res, next) {
        let response = await accountService.logout(req, res);
        if(response) {
            res.status(response.status).json({
                "message": response.message
            })
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
