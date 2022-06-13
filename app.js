//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
})

const userSchema = new mongoose.Schema({
    login: String,
    password: String
})


userSchema.plugin(encrypt,{
    secret:process.env.SECRET,
    encryptedFields:['password']
})
const User = new mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const user = new User({
        login: req.body.username,
        password: req.body.password
    })
    user.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ login: username }, (err, foundUser) => {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets')
                }
            }
        } else {
            console.log(err);
        }
    })
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000!');
})