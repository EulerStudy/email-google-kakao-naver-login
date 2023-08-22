const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const cookieSession = require('cookie-session')
const passport = require('passport')

const Users = require('./models/users.models')
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')

dotenv.config()
app.use(cookieSession({
  name: 'email-google',
  keys: [ process.env.COOKIE_ENCRYPTION_KEY ]
}))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb()
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb()
    }
  }
  next()
})


app.use(express.json())
app.use(express.urlencoded({ extended: false }))  // form 안에 있는 값을 parsing해서 가져오기 위해서

// view engine configuration
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

mongoose.set('strictQuery', false)  // 몽고디비를 연결할 때 warning이 많이 뜨면
mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log('MongoDB connected')
  })
  .catch((err)=>{
    console.log(err)
  })

app.use('/static', express.static(path.join(__dirname, 'public')))  // 정적 파일 제공

app.use('/', mainRouter)
app.use('/auth', usersRouter)

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})