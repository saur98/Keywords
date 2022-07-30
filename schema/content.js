const mongoose = require('mongoose')

const content = mongoose.Schema(
    {
        content :{
            type : String
        },
        Date : {
            type : String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("content",content)