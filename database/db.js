const mongoose = require('mongoose')

module.exports = connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected")
    }
    catch (err) {
        console.log(err)
    }
    
}
