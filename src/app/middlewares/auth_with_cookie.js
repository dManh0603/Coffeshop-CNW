require("dotenv").config();

const authenticate = (req, res, next) => {
    try {
        const cookie = req.cookies.currentUser;
        const data = JSON.parse(decodeURIComponent(cookie))
        if(!data.accountId) {
            throw new Error("Authentication Failed!");
        }
        next()
    } catch(error) {
        res.redirect('/401');
    }
    
}

module.exports = authenticate