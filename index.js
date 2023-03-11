const mongoose = require('mongoose')
require('dotenv').config();
const process = require('process');
const path = require('path')

const password = process.env.MONGOPASSWORD
const username = process.env.MONGOUSERNAME
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY
const SECRET_KEY = process.env.SECRET_KEY

const PORT = 3000 || process.env.PORT

//for local testing *comment it when not in use*
// mongoose.connect("mongodb://localhost:27017/hostel-mgmt", {useNewUrlParser: true})
// .then(()=> {
//     console.log("Mongo local database connected")
// })
// .catch(err => {
//     console.log(err)
// })

//for cloud testing *comment it when not in use*
mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.rprzzwl.mongodb.net/hostel-management?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,     
        useUnifiedTopology: true
    }).then(() => {
        console.log("Mongo Connected to Database")
    }).catch(err => {
        console.log(err)
    })




const port = 3000 || process.env.PORT

var expressLayouts = require("express-ejs-layouts");
const express = require('express')
const app = express()



app.use(express.static(path.join(__dirname, "public")))


//for user routes
const userRoute = require('./routes/userRoute')
app.use(expressLayouts);
app.use('/', userRoute)

//for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute)

//for warden routes 
const wardenRoute = require("./routes/wardenRoute")
app.use('/warden', wardenRoute)

app.listen(3000, function () {
    console.log(`Server is running at http://127.0.0.1:${PORT}`)
})




