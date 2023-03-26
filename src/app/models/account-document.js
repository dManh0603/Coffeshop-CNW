const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
    {
        username: { type: String, maxLength: 255 },
        password: { type: String, maxLength: 255 },
        firstname: { type: String, maxLength: 255 },
        lastname: { type: String, maxLength: 255 },
        email: { type: String, maxLength: 255 },
        phone: { type: String, maxLength: 20 },
        status: { type: Number },
        role: { type: Number }
    }
);

AccountSchema.plugin(AutoIncrement, {inc_field: 'account_id'});

const account = mongoose.model("accounts", AccountSchema);

module.exports = account;
