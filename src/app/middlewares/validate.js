const { body } = require("express-validator");

class validator {
    validateSignUpAccount() {
        return [
            body("username", "username does not Empty").not().isEmpty(),
            body("username", "username more than 6 digits").isLength({
                min: 6,
            }),
            body("password", "password more than 8 digits").isLength({
                min: 8,
            }),
            body(
                "password",
                "Password must contain both letters and numbers"
            ).matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
            body("password", "password does not Empty").not().isEmpty(),
            body("firstname", "firstname does not Empty").not().isEmpty(),
            body("lastname", "lastname does not Empty").not().isEmpty(),
            body("email", "email does not Empty").not().isEmpty(),
            body("email", "Invalid email address").isEmail(),
            body("phone", "phone does not Empty").not().isEmpty(),
            body("phone", "Invalid mobile phone address").isMobilePhone(),
        ];
    }
    validateLogin() {
        return [
            body("username")
                .isLength({ min: 3 })
                .withMessage("Name must be at least 3 characters long"),
            body("password")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long"),
        ];
    }
}

module.exports = new validator();
