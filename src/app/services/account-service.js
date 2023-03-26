const AccountDocument = require("../models/account-document");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var { validationResult } = require("express-validator");
let AuthController = require("../controllers/AuthController");
let accountCache = new Map();

let signup = async (req, res) => {
    try {
        let emailChecking = await AccountDocument.findOne({
            email: req.body.email,
        });
        if (emailChecking) {
            throw new Error("email is used")
        }
    
        let usernameChecking = await AccountDocument.findOne({
            username: req.body.username,
        });
        if (usernameChecking) {
            throw new Error("username is used")
        }
    
        let phoneChecking = await AccountDocument.findOne({
            phone: req.body.phone,
        });
        if (phoneChecking) {
            throw new Error("phone is used")
        }
    
        let hashedPass = await bcrypt.hash(req.body.password, 10);
        let account = new AccountDocument({
            username: req.body.username,
            password: hashedPass,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            status: 1,
            role: 0,
        });
        account = await account.save();
        return { status: 200, message: "Sign Up Successfully!" };
    } catch(error) {
        res.status(400).json({
            "message": error.message
        })
    }
};

let authenticate = async (req, res) => {
    try {
        let account = await AccountDocument.findOne({
            $or: [
                { email: req.body.username },
                { username: req.body.username },
            ],
        });

        if (!account) {
            throw new Error("Account does not existed!")
        }
    
        let result = await bcrypt.compare(
            req.body.password,
            account.password
        );

        if (!result) {
            throw new Error("Password Incorrect!")
        }
    
        const accessToken = await generateAccessToken({
            username: account.username,
        });
        const refreshToken = await generateRefreshToken({
            username: account.username,
        });
        accountCache.set(account.username, {
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    
        return {
            "status": 200,
            "accessToken": accessToken,
            "refreshToken": refreshToken,
        };

    } catch(error) {
        res.status(400).json({
            "message": error.message
        })
    }
};

let refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        let decode = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(decode);
        if (
            accountCache.get(decode.username) &&
            refreshToken == accountCache.get(decode.username).refreshToken
        ) {
            let accessToken = await generateAccessToken({
                username: decode.username,
            });
            accountCache.set(decode.username, {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
            return {
                "status": 200,
                "accessToken": accessToken,
                "refreshToken": refreshToken
            }
        } else {
            throw new Error("Refresh Token is invalid!")
        }
    } catch (error) {
        res.status(400).json({
            "message": error.message
        })
    }
};

let logout = async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (
            accountCache.get(decode.username) &&
            token == accountCache.get(decode.username).accessToken
        ) {
            accountCache.delete(decode.username);
            return {
                status: 200,
                message: "Logged out!"
            }
        } else {
            throw new Error("Token is invalid");
        }
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).json({
                message: "Token Expired!",
            });
        } else {
            res.status(401).json({
                message: "Authentication Failed",
            });
        }
    }
}

let checkingBeforeSignup = async (req) => {
    let result = new Map();
    let emailChecking = await AccountDocument.findOne({
        email: req.email,
    });
    if (emailChecking) {
        result.set("email", "email is used");
    }

    let usernameChecking = await AccountDocument.findOne({
        username: req.username,
    });
    if (usernameChecking) {
        result.set("username", "username is used");
    }

    let phoneChecking = await AccountDocument.findOne({
        phone: req.phone,
    });
    if (phoneChecking) {
        result.set("phone", "phone is used");
    }

    return result;
};

let generateAccessToken = async (account) => {
    return jwt.sign(account, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

let generateRefreshToken = async (account) => {
    const refreshToken = jwt.sign(account, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "20m",
    });
    return refreshToken;
};

module.exports = { signup, authenticate, refreshToken, logout };
