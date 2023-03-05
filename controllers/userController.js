const User = require('../models/userModel')
const Hostel = require('../models/hostelModel')
const bcrypt = require('bcrypt')

const nodemailer = require('nodemailer')


const randomHostel = async (reg_no, gender, name, session_key) => {
    try {

        var boys_hos = []
        var girls_hos = []
        var rooms = []
        var vacan = 0

        const userData = await User.findOne({_id: session_key})
        const hostelsData = await Hostel.find({})
        hostelsData.forEach(function (hostel) {
            vacan = hostel.vacancy //existing vacancy
            if(hostel.vacancy){
                if(hostel.type=="male")
                { 
                    boys_hos.push(hostel.name)
                }else{
                    girls_hos.push(hostel.name)
                }
            }
            
        })
        var allocatedHostel = ""


        console.log(`data ************** ${userData} ************* \n`)

        if (userData.hostel_allocated.hostel_name == 'None'){
            if(gender=="male"){
                allocatedHostel = boys_hos[Math.floor(Math.random() * boys_hos.length)];
            }
            else{
                allocatedHostel = girls_hos[Math.floor(Math.random() * girls_hos.length)];
            }
    
            await Hostel.findOne({ name: allocatedHostel }).then((hostel) => {
                hostel.rooms.forEach(function (room) {
                    if(room.vacant){
                        rooms.push(room.room_no)
                    }
                })
            })
    
            var allocatedRoom = rooms[Math.floor(Math.random() * rooms.length)];
    
            //updating hostel vacancies and student allocated
    
            await Hostel.updateOne(
                { name: allocatedHostel, "rooms.room_no": allocatedRoom },
                { $set: { 
                    "rooms.$.vacant":  false,
                    "rooms.$.student_reg_no": reg_no,
                    "rooms.$.student_allocated": name,
                    vacancy: vacan - 1
             } }
              )
    
            allocatedData = ({
                'hostel_name': allocatedHostel,
                'room_no': allocatedRoom
            })

            return allocatedData
        } 
        else {
            return false
        }



        
        

    } catch (error) {
        console.log(error.message)
    }
}


const securePassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch (error) {
        console.log(error.message)
    }
}

//for sending mail
const sendVerifyMail = async (name, email, user_id) => {

    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'jainkaushal899@gmail.com',
                pass: ''
            }
        })

        const mailOptions = {
            from: 'jainkaushal899@gmail.com',
            to: email,
            subject: 'For Mail Verification',
            html: '<p>Hi' + name + '. Please click <a href="http://localhost:3000/verify?id' + user_id + '">here</a> to verify your mail.</p>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Email has been sent:- ", info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

const loadRegister = async (req, res) => {
    try {

        //using this for testing
        console.log(randHostel)
        res.render('registration')

    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async (req, res) => {

    try {

        const spassword = await securePassword(req.body.password)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.mno,
            password: spassword,
            reg_no: req.body.regNo,
            gender: req.body.gender,
            is_admin: 0
        })

        if(await User.findOne({reg_no : req.body.reg_no}) || await User.findOne({email: req.body.email})){
            res.send("A user with the same registration no or email is already registered")
        } else {
            await user.save()
        }


    } catch (error) {
        console.log(error.message)
    }
}

const loadApplyHostel = async (req, res) => {
    try {

        res.render('apply-hostel')

    } catch (error) {
        console.log(error.message)
    }
}

//got it working
const applyHostel = async (req, res) => {
    try {

        const randHostel = await randomHostel(req.body.reg_no, req.body.gender, req.body.name, req.session.user_id)

        if(await User.findOne({reg_no : req.body.reg_no})){
            console.log(User.reg_no)
            if (!randHostel){
                res.send("You have already been allocated") 
            } else {
                User.updateOne({ _id: req.session.user_id },
                    {
                        $set: {
                            dept: req.body.dept,
                            semester: req.body.semester,
                            address: req.body.address,
                            guardian_name: req.body.guardian_name,
                            guardian_phone: req.body.guardian_phone,
                            hostel_allocated: randHostel
        
        
                        }
                    }, function (err, result) {
                        if (err) {
                            console.log(`error ${err}`);
                        } else {
                            console.log(result);
                            res.send(`You have been allocated at ${randHostel.hostel_name} room no ${randHostel.room_no}`)
                        }
                    });
            }
        }else{
            res.send("Invalid Reg no.")
        }
        

    } catch (error) {
        console.log(`errrrro ${error.message}`)
    }

}


const verifyMail = async (req, res) => {

    try {

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } })

        console.log(updateInfo)
        res.render("email-verified")

    } catch (error) {
        console.log(error.message)
    }
}

//login user method started

const loginLoad = async (req, res) => {

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

                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail." })
                } else {
                    req.session.user_id = userData._id
                    res.redirect('/home')
                }

            } else {
                res.render('login', { message: "Incorrect Email/Password." })
            }

        } else {
            res.render('login', { message: "Incorrect Email/Password." })
        }

    } catch (error) {
        console.log(error.message)
    }

}

const loadHome = async (req, res) => {


    try {

        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { user: userData })
    } catch (error) {
        console.log(error.message)
    }
}

const userLogout = async (req, res) => {

    try {

        req.session.destroy()
        res.redirect('/')

    } catch (error) {
        console.log(error.message)
    }
}

const editLoad = async (req, res) => {

    try {
        const id = req.query.id

        const userData = await User.findById({ _id: id })

        if (userData) {
            res.render('edit', { user: userData })
        } else {
            res.redirect('/home')
        }

    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async (req, res) => {

    try {

        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, phone: req.body.mno } })
        } else {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, phone: req.body.mno } })
        }



        res.redirect('/home')

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadRegister,
    applyHostel,
    loadApplyHostel,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}