const User = require('../models/userModel')
const Hostel = require('../models/hostelModel')
const Complaint = require('../models/complaintModel')
const Warden = require('../models/wardenModel')
const bcrypt = require('bcrypt')


const loadLogin = async (req, res) => {

    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email })
        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {

                if (userData.role === 0) {
                    res.render('login', { message: "Not an admin" })
                }
                else {
                    req.session.user_id = userData._id
                    req.session.role = userData.role
                    res.redirect('/admin/home')
                }

            } else {
                res.render('login', { message: "Email and password is incorrect" })
            }

        } else {
            res.render('login', { message: "Email and password is incorrect" })
        }
    }
    catch (error) {
        console.log(error.message)
    }
}


const loadHome = async (req, res) => {

    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { admin: userData })
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {

    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const loadDashboard = async (req, res) => {

    try {

        const usersData = await User.find({ role: 0 })
        const hostelsData = await Hostel.find({})
        res.render('dashboard', { users: usersData, hostels: hostelsData })
    } catch (error) {
        console.log(error.message)
    }
}

const loadUsersList = async (req, res) => {

    try {
        const page = req.query.page
        const limit = 20
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        results = {}
        const usersData = await User.find({ role: 0 })
        results.results = (usersData).slice(startIndex, endIndex);
        results.currentPage = page
        res.render('users-list', { userData: results })
    } catch (error) {
        console.log(error.message)
    }
}

const loadHostelsList = async (req, res) => {

    try {

        const hostelsData = await Hostel.find({})
        res.render('hostels-list', { hostels: hostelsData })
    } catch (error) {
        console.log(error.message)
    }
}



const loadAddHostel = async (req, res) => {

    try {
        res.render('addHostel')
    } catch (error) {
        console.log(error.message)
    }
}

const loadHostelDetails = async (req, res) => {

    try {
        const hostelName = req.query.id
        const page = req.query.page
        const limit = 20
        const hostelData = await Hostel.findOne({ name: hostelName })

        const results = {

        };
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        results.results = (hostelData.rooms).slice(startIndex, endIndex);
        results.currentPage = page

        res.render('hostel-details', { hostelData: hostelData, roomData: results })

    } catch (error) {
        console.log(error.message)
    }
}



const loadUserDetails = async (req, res) => {

    try {
        const regNo = req.query.id
        const users = await User.find({ reg_no: regNo }).exec()
        res.render('user-details', { userData: users })
    } catch (error) {
        console.log(error.message)
    }
}



const insertHostel = async (req, res) => {


    try {


        cap = req.body.capacity

        var rooms = []

        for (let i = 0; i < cap; i++) {
            rooms.push({
                room_no: i + 1
            })
        }

        console.log(rooms)

        const hostel = new Hostel({
            name: req.body.name,
            address: req.body.address,
            capacity: req.body.capacity,
            vacancy: req.body.capacity,
            type: req.body.type,
            contact: req.body.contact,
            rooms: rooms

        });

        const hostelData = await hostel.save()

        if (hostelData) {

            res.redirect('/admin/home')
        }
        else {
            res.render('addHostel', { message: "Process failed!" })
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loadComplaints = async (req, res) => {
    try {
        Complaint.find({}, (err, complaintList) => {
            if (err) {
                console.log(err);
                res.send('An error occurred while retrieving complaints.');
            } else {
                res.render('complaints', { complaintList: complaintList });
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};


const securePassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch (error) {
        console.log(error.message)
    }
}

const loadAddWarden = async (req, res) => {

    try {

        const hostelsData = await Hostel.find({})
        res.render('addWarden', { hostelsData: hostelsData })
    } catch (error) {
        console.log(error.message);
    }
}

const addWarden = async (req, res) => {

    try {

        const spassword = await securePassword(req.body.password)

        const warden = new Warden({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            password: spassword,
            hostel_name: req.body.hostel_name,
            role: 2

        });

        const wardenData = await warden.save()

        if (wardenData) {
            res.send(`
            <h1>Warden has been added
            <h3>Redirecting 
            <script>
            window.setTimeout(function(){
                window.location.href = "/admin/addWarden";
        
            }, 3000);
    </script>`);
        }
        else {
            res.send(`
            <h1>An error occured
            <h3>Redirecting 
            <script>
            window.setTimeout(function(){
                window.location.href = "/admin/addWarden";
        
            }, 3000);
    </script>`);

        }

    } catch (error) {
        console.log(error.message)
    }
}

const returnSearch = async (req, res) => {
    try {
        const payload = (req.body.payload.trim())
        let searchData = await User.find(
            { name: { $regex: new RegExp('^' + payload + '.*', 'i') } },
            { name: 1, _id: 0 }
        ).exec()
        searchData = searchData.slice(0, 5)
        console.log(searchData)
        res.send({ payload: searchData })

    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    logout,
    loadDashboard,
    insertHostel,
    loadAddHostel,
    loadHostelDetails,
    loadUserDetails,
    loadHostelsList,
    loadUsersList,
    loadComplaints,
    addWarden,
    loadAddWarden,
    returnSearch
}
