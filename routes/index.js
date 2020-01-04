var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');

var registed_Users = {};

/* RegistPage routes. */
router.get('/regist', function(req, res, next) {
  res.render('RegistPage', {title: '注册', user:{}});
});

router.post('/regist', function(req, res, next) {
  var newUser = req.body;
  // console.log(newUser);
  try {
    checkUser(newUser);
    req.session.user = registed_Users[newUser["username"]] = newUser;
    res.redirect('/detail');
  } catch (err) {
    res.render('RegistPage', {title: '注册', user: newUser, error: err.message})
  }
});

router.all('*', function(req, res, next){
  req.session.user ? next() : res.redirect('/login');
});

/* DetailPage routes. */
router.get('/detail', function(req, res, next) {
  res.render('DetailPage', {title: '详情', user: req.session.user});
});

module.exports = router;

// Check user validation
function checkUser(user){
  var errMsg = [];

  for (var info in user) {
    if (!validator.checkInfoFormat(info, user[info]))
      errMsg.push(validator.getErrorMessage(info));
    if (info == "userpassword" || info == "userrepeat") continue;
    if (!validator.checkAttrValueUnique(registed_Users, user, info))
      errMsg.push("This " + info + " has been used, please input another " + info);
  }

  if (errMsg.length > 0) throw new Error(errMsg.join('<br/>'));
}
