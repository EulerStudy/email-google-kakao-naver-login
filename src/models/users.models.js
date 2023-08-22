const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: false
  },
  password: {
    type: String,
    minLength: 5
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true    // 로그인 null 값이 unique에 적용이 안되도록 하기 위해서
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true
  },
  naverId: {
    type: String,
    unique: true,
    sparse: true
  }
})

// 저장하기 전에 실행 됨
const saltRounds = 10
userSchema.pre('save', function(next) {
  const user = this
  // 비밀 번호가 변경될 때만
 
  if (user.isModified('password')) {
    // salt를 생성합니다
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  // bcrypt compare 비교
  // plain password => client, this.password => DB에 있는 비밀번호
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })

  // if (plainPassword === this.password) {
  //   cb(null, true)
  // } else {
  //   cb(null, false)
  // }
  // return cb({ error: 'error' })
}

const Users = mongoose.model('users', userSchema)  // 모델 생성

module.exports = Users
