const AccountDocument = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let { authCache } = require("./cache");

let signup = async (req, res) => {
    try {
        let emailChecking = await AccountDocument.findOne({
            email: req.body.email,
        });
        if (emailChecking) {
            throw new Error("email đã được sử dụng");
            // throw new Error("email is used")
        }

        let usernameChecking = await AccountDocument.findOne({
            username: req.body.username,
        });
        if (usernameChecking) {
            throw new Error("username đã được sử dụng");
            // throw new Error("username is used")
        }

        let phoneChecking = await AccountDocument.findOne({
            phone: req.body.phone,
        });
        if (phoneChecking) {
            throw new Error("phone đã được sử dụng");
            // throw new Error("phone is used")
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
            role: "user",
        });
        account = await account.save();
        console.log(account);
        // return { status: 200, message: "Sign Up Successfully!" };
        return { status: 200, message: "Đăng ký thành công!" };
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

let signin = async (req, res) => {
    try {
        let account = await AccountDocument.findOne({
            $or: [
                { email: req.body.username },
                { username: req.body.username },
            ],
        });

        if (!account) {
            // throw new Error("Account does not existed!")
            throw new Error("Tài khoản không tồn tại !");
        }

        let passworkChecking = await bcrypt.compare(
            req.body.password,
            account.password
        );

        if (!passworkChecking) {
            // throw new Error("Password Incorrect!")
            throw new Error("Mật khẩu không đúng");
        }

        const accessToken = await generateAccessToken({
            username: account.username,
        });
        const refreshToken = await generateRefreshToken({
            username: account.username,
        });
        authCache.set(account.username, {
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        return {
            status: 200,
            message: "Đăng nhập thành công",
            accessToken: accessToken,
            refreshToken: refreshToken,
            role: account.role,
            accountId: account.accountId
        };
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
};

let refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        let decode = await jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        console.log(decode);
        if (
            authCache.get(decode.username) &&
            refreshToken == authCache.get(decode.username).refreshToken
        ) {
            let accessToken = await generateAccessToken({
                username: decode.username,
            });
            authCache.set(decode.username, {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
        } else {
            throw new Error("Refresh Token is invalid!");
        }
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
};

let signout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(token);
        console.log(authCache.get(decode.username));
        console.log(authCache.get(decode.username).accessToken);
        if (
            authCache.get(decode.username) &&
            token === authCache.get(decode.username).accessToken
        ) {
            authCache.del(decode.username);
            console.log(authCache.data);
            return {
                status: 200,
                // message: "Logged out!"
                message: "Đăng xuất thành công!",
            };
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
                // message: "Authentication Failed",
                message: "Xác thực tài khoản thất bại!",
            });
        }
    }
};

let forgetPassword = async (req, res) => {
    try {
        let account = await AccountDocument.findOne({
            $and: [{ email: req.body.email }, { username: req.body.username }],
        });

        if (!account) {
            // throw new Error("Account does not existed!")
            throw new Error("Tài khoản không tồn tại !");
        }
        let hashedPass = await bcrypt.hash(req.body.password, 10);
        account.password = hashedPass;

        account = await account.save();

        return {
            status: 200,
            message: "Thay đổi mật khẩu thành công!",
        };
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
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

module.exports = { signup, signin, refreshToken, signout, forgetPassword };
