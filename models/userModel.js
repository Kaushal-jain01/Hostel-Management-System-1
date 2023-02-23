const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    regNo : {
        type: String,
        required: true
    },
    is_admin:{
        type: Number,
        required: true
    },
    is_verified:{
        type: Number,
        default:1
    }

})


module.exports = mongoose.model('User', userSchema)