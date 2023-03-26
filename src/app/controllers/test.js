AccountDocument.findOne({ username: req.body.username }, (err, account) => {
    if (err) {
        res.status(401).json(err);
    }
    if (account) {
        res.status(401).json({ message: "Username is used" });
    }
});

AccountDocument.findOne({ phone: req.body.phone }, (err, account) => {
    if (err) {
        res.json(err);
    }
    if (account) {
        res.json({ message: "Phone Number is used" });
    }
});

bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
        res.json({
            error: err,
        });
    }

    let account = new AccountDocument({
        username: req.body.username,
        password: hashedPass,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        role: 0,
    });

    account
        .save()
        .then((account) => {
            res.json({
                message: "Sign Up Successfully!",
            });
        })
        .catch((error) => {
            res.json({
                message: "An error occured!",
                log: error.message,
            });
        });
});


let checkEmail = await AccountDocument.findOne({
   email: req.body.email,
});

if (checkEmail) {
   res.status(401).json({ message: "Email is used" });
}

let checkUsername = await AccountDocument.findOne({
   username: req.body.username,
});

if (checkUsername) {
   res.status(401).json({ message: "username is used" });
}

let checkPhone = await AccountDocument.findOne({
   phone: req.body.phone,
});

if (checkPhone) {
   res.status(401).json({ message: "Phone Number is used" });
}

let hashedPass = await bcrypt.hash(req.body.password, 10);
console.log(hashedPass);
let account = new AccountDocument({
   username: req.body.username,
   password: hashedPass,
   firstname: req.body.firstname,
   lastname: req.body.lastname,
   email: req.body.email,
   phone: req.body.phone,
   role: 0,
});

await account.save();
await res.json({
   message: "Sign Up Successfully!",
});