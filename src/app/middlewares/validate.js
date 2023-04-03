const { body } = require("express-validator");

class validator {
    validateSignUpAccount() {
        return [
            // body("username", "username does not Empty").not().isEmpty(),
            // body("username", "username more than 6 digits").isLength({
            //     min: 6,
            // }),
            // body("password", "password more than 8 digits").isLength({
            //     min: 8,
            // }),
            // body(
            //     "password",
            //     "Password must contain both letters and numbers"
            // ).matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
            // body("password", "password does not Empty").not().isEmpty(),
            // body("firstname", "firstname does not Empty").not().isEmpty(),
            // body("lastname", "lastname does not Empty").not().isEmpty(),
            // body("email", "email does not Empty").not().isEmpty(),
            // body("email", "Invalid email address").isEmail(),
            // body("phone", "phone does not Empty").not().isEmpty(),
            // body("phone", "Invalid mobile phone address").isMobilePhone(),

            body("username", "username không được để trống").not().isEmpty(),
            body("firstname", "firstname không được để trống").not().isEmpty(),
            body("lastname", "lastname không được để trống").not().isEmpty(),
            body("password", "password không được để trống").not().isEmpty(),
            body("email", "email không được để trống").not().isEmpty(),
            body("phone", "số điện thoại không được để trống").not().isEmpty(),

            body("username", "username không được ít hơn 6 kí tự").isLength({ min: 6, }),
            body("password", "password không được ít hơn 8 kí tự").isLength({ min: 8, }),
            body("password", "Password phải bao gồm chữ và số").matches( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ ),
            body("email", "email không hợp lệ").isEmail(),
            body("phone", "số điện thoại không hợp lệ").isMobilePhone(),
        ];
    }
    validateLogin() {
        return [
            body("username", "username không được để trống").not().isEmpty(),
            body("password", "password không được để trống").not().isEmpty(),

            body("username") .isLength({ min: 6 }) .withMessage("Username không được ít hơn 6 kí tự"),
            body("password") .isLength({ min: 8 }) .withMessage("Password không được ít hơn 8 kí tự"),
            body("password", "Password phải bao gồm chữ và số").matches( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ ), ];
    }
    validateForgetPassword() {
        return [
            body("username", "username không được để trống").not().isEmpty(),
            body("email", "email không được để trống").not().isEmpty(),
            body("password", "password không được để trống").not().isEmpty(),

            body("username") .isLength({ min: 6 }) .withMessage("Username không được ít hơn 6 kí tự"),
            body("password") .isLength({ min: 8 }) .withMessage("Password không được ít hơn 8 kí tự"),
            body("password", "Password phải bao gồm chữ và số").matches( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ ),
            body("email", "email không hợp lệ").isEmail(),
        ];
    }
}

module.exports = new validator();
