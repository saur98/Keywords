const mongoose = require('mongoose')

const test = mongoose.Schema(
    {
        content :{
            type : String
        },
        Date : {
            type : String
        },
        SEO : {
            type : Array
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("test",test)