const mongoose = require('mongoose')

const trending = mongoose.Schema(
    {
        trends :{
            type : Array
        },
        content :{
            type : String
        },
        Date : {
            type : String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('trends',trending)

