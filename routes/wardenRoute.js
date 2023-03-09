const express = require('express')
const warden_route = express()

const auth = require('../middleware/wardenAuth')
const session = require('express-session')
const config = require('../config/config')
warden_route.use(session({secret: config.sessionSecret}))


const bodyParser = require('body-parser')
warden_route.use(bodyParser.json())
warden_route.use(bodyParser.urlencoded({extended:true}))

warden_route.set('view engine', 'ejs')
warden_route.set('views', './views/warden')

const wardenController = require('../controllers/wardenController')


warden_route.get('/', auth.isLogout, wardenController.loadLogin)

warden_route.post('/', wardenController.verifyLogin)

warden_route.get('/logout' , auth.isLogin , wardenController.logout)

warden_route.get('/dashboard', auth.isLogin, wardenController.loadDashboard)

warden_route.get('/hostel-details', auth.isLogin, wardenController.loadHostelDetails )


module.exports =  warden_route