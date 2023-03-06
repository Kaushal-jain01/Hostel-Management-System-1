const User = require('../models/userModel')
const Hostel = require('../models/hostelModel')
const Complaint = require('../models/complaintModel')
const Warden = require('../models/wardenModel')
const bcrypt = require('bcrypt')


const loadDashboard = async (req, res) => {

    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

const loadLogin = async (req, res) => {

    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    loadDashboard,
    loadLogin
}


