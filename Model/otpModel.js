const { Schema, model } = require('mongoose')



module.exports.Otp = model('Otp', Schema({
    number: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        require: true
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 300 }
    },
}, { timestamps: true }))