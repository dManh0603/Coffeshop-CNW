require("dotenv").config();

const authenticate = (req, res, next) => {
    try {
        const cookie = req.cookies.currentUser;
        const data = JSON.parse(decodeURIComponent(cookie))
        if (!data.accountId) {
            throw new Error("Authentication Failed!");
        }
        next()
    } catch (error) {
        console.error(error);
        res.redirect('/401');
    }

}

const checkUserRole = async (req, res, next) => {
    try {
        const cookie = await req.cookies.currentUser;
        if(!cookie) {
            throw new Error("Authentication Failed!");
        }
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.accountId != null && "user" === data.role) {
            next()
        } else {
            throw new Error("You should login with user account");
        }
    } catch (error) {
        if(error.message === "Authentication Failed!") {
            res.redirect('/401');
        } else {
            res.send(`<script>alert("${error.message}"); window.history.back();</script>`)
        }
    }

}


const checkAdminRole = async (req, res, next) => {
    try {
        const cookie = await req.cookies.currentUser;
        if(!cookie) {
            throw new Error("Authentication Failed!");
        }
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.accountId != null && "admin" === data.role) {
            next()
        } else {
            throw new Error("Authentication Failed!");
        }
    } catch (error) {
        res.redirect('/404');

        // if(error.message === "Authentication Failed!") {
        // } else {
        //     res.send(`<script>alert("${error.message}"); window.history.back();</script>`)
        // }
    }

}

module.exports = {authenticate, checkUserRole, checkAdminRole}