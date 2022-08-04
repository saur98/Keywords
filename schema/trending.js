const mongoose = require('mongoose')

const trending = mongoose.Schema(
    {
        trends :{
            type : Array
        },
        content :{
            type : Array
        },
        keywords :{
            type : Array
        },
        Date : {
            type : String
        },
        GEO : {
            type : String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('trends',trending)

