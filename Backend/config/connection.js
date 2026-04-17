const mongoose = require('mongoose')


const ConnectDB = async () => {

    try 
    {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB Database Connected');
    } 
    catch (error) {
        console.log("Database Is Not Connected");
        process.exit(1)
        
    }   
}

module.exports = ConnectDB;