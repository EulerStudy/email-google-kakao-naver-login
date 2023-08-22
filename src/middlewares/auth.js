// 로그인이 안 된 사람은 로그인 페이지로 이동
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// login 페이지나 signup 페이지는 못들어오게
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
}