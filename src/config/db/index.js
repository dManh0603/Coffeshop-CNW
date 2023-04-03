const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME
        });
        console.log('Connect db successfully');
    } catch (error) {
        throw error;
    }
}

module.exports = { connect };