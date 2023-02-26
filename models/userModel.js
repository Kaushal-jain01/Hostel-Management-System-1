const mongoose = require('mongoose')


const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reg_no: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dept: {
        type: String
    },
    semester: {
        type: String
    },
    guardian_name: {
        type: String
    },
    guardian_phone: {
        type: String
    },
    address: {
        type: String
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Number,
        default: 1
    },
    hostel_allocated: {
        hostel_name: {
            type: String,
            default: 'None'
        },
        room_no: {
            type: Number,
            default: 0
        }

    }

})


module.exports = mongoose.model('User', userSchema)

