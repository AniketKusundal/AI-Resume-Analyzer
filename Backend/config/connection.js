const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.error("MongoDB Error: MONGODB_URL environment variable is not defined!");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Database Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database Is Not Connected");
        console.error("MongoDB Error Message:", error.message);
        console.error("MongoDB Error Details:", error);
    }   
};

module.exports = ConnectDB;