const mongoose = require('mongoose')
require('dotenv').config();
const process = require('process');

const password = process.env.MONGOPASSWORD
const username = process.env.MONGOUSERNAME

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY
const SECRET_KEY = process.env.SECRET_KEY

const PORT = 3000 || process.env.PORT

console.log(username)
mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.rprzzwl.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,     
        useUnifiedTopology: true
    })

const port = 3000 || process.env.PORT

var expressLayouts = require("express-ejs-layouts");
const express = require('express')
const app = express()

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