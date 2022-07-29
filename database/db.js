const mongoose = require('mongoose')
require("dotenv").config()

const connectDB = async () => {
    try{
        const URL = process.env.MongoURI
        await mongoose.connect(URL)
        console.log("Connected to DB")
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = connectDB