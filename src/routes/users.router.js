const express = require('express')
const passport = require('passport')
const Users = require('../models/users.models')
const sendMail = require('../mail/mail')
const usersRouter = express.Router()

usersRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json({ msg: info })
  
    // 세션 생성 (passport에서 제공)
    req.logIn(user, function(err) {
      if (err) return next(err)
        res.redirect('/')
    })
  })(req, res, next)
})

usersRouter.post('/logout', (req, res, next) => {
  req.logout(function(err) {
  if (err) return next(err)
    res.redirect('/')
  })
})

usersRouter.post('/signup', async (req, res) => {
  // user 객체를 생성
  const user = new Users(req.body)
  try {
    console.log(req.body)
    // await user.save()
    // 이메일 보내기
    sendMail(req.body.email, null, 'welcome')
    res.redirect('/login')
  } catch (err) {
    console.log(err)
  }
})

usersRouter.get('/google', passport.authenticate('google'))
usersRouter.get('/google/callback', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

usersRouter.get('/kakao', passport.authenticate('kakao'))
usersRouter.get('/kakao/callback', passport.authenticate('kakao', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

usersRouter.get('/naver', passport.authenticate('naver'))
usersRouter.get('/naver/callback', passport.authenticate('naver', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

module.exports = usersRouter