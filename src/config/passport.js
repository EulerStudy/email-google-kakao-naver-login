const passport = require('passport')
const Users = require('../models/users.models')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const kakaoStrategy = require('passport-kakao').Strategy
const naverStrategy = require('passport-naver').Strategy

const dotenv = require('dotenv')
dotenv.config()

// req.login(user), 세션을 생성하고 저장
passport.serializeUser((user, done) => {
  done(null, user.id) // err와 id
})

// user가 페이지에 들어갈 때마다 deserializeUser를 호출함
// 여기에서는 serializeUser에서 사용된 id를 이용해서 데이터베이스에서 유저를 찾아 유저의
// 모든 정보를 가져옴
// client => session => request
// req.user = user가 들어감
passport.deserializeUser((id, done) => {
  Users.findById(id)
    .then(user => {
      done(null, user)  // req.user = user
    })
})

const localStorageConfig = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password'}, (email, password, done) => 
{
  Users.findOne({ email: email.toLocaleLowerCase() })
  .then((user) => {
    if (!user) return done(null, false, { msg: `Email ${email} not found`})
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err)
      if (!isMatch) return done(null, false, { msg: 'Invalid email or password'})
      return done(null, user)
    })
  })
  .catch((err) => {
    return done(err)
  })  
})
passport.use('local', localStorageConfig)

const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['email', 'profile']
}, (accessToken, refreshToken, profile, done) => {
  Users.findOne({ googleId: profile.id })
  .then((existingUser) => {
    if (existingUser) return done(null, existingUser)
    const user = new Users()
    user.email = profile.emails[0].value
    user.googleId = profile.id
    user.save()
    .catch((err) => {
      done(err)
    })
    return done(null, user)
  })
  .catch((err) => {
    return done(err)
  })
})
passport.use('google', googleStrategyConfig)

const kakaoStrategyConfig = new kakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: '/auth/kakao/callback'
}, (accessToken, refreshToken, profile, done) => {
  Users.findOne({ kakaoId: profile.id })
  .then((existingUser) => {
    //console.log(profile)
    if (existingUser) return done(null, existingUser)
    const user = new Users()
    user.email = profile._json.kakao_account.email
    user.kakaoId = profile.id
    console.log(profile)
    console.log(user)
    user.save()
    .catch((err) => {
      done(err)
    })
    return done(null, user)
  })
  .catch((err) => {
    return done(err)
  })
})
passport.use('kakao', kakaoStrategyConfig)

const naverStrategyConfig = new naverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: '/auth/naver/callback'
}, (accessToken, refreshToken, profile, done) => {
  Users.findOne({ naverId: profile.id })
  .then((existingUser) => {
    if (existingUser) return done(null, existingUser)
    const user = new Users()
    user.email = profile._json.email
    user.naverId = profile.id
    console.log(profile)
    console.log(user)
    user.save()
    .catch((err) => {
      done(err)
    })
    return done(null, user)
  })
  .catch((err) => {
    return done(err)
  })
})
passport.use('naver', naverStrategyConfig)