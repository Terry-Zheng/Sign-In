var express = require("express");
var router = express.Router();
var debug = require("debug")("signin:index");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var queryString = require('querystring');
var url = require('url');

module.exports = function(db){
  // var registed_Users = db.collection("users");
  // debug("users collection setup as: ", registed_Users);
  var userManager = require("../models/user")(db);

  router.get("/", function(req, res, next) {
    if (req.session.user) {
      var testname = getUserName(req.url);
      // The url's username is not the current user
      if (!!testname && testname != req.session.user.username) {
        res.render("DetailPage", {title: "详情", user: req.session.user, error: "只能够访问自己的数据"});
      } else res.redirect("/detail");
    }
    else res.redirect("/login");
  });

  /* LoginPage routes. */
  router.get("/login", function(req, res, next) {
    res.render("LoginPage", {title: "登录", user:{}});
  });
  
  router.post("/login", function(req, res, next) {
    userManager.findUser(req.body.username, req.body.userpassword)
                .then(function(user){
                  if (user == null) return Promise.reject("错误的用户名或者密码")
                  req.session.user = user;
                  // debug("current login session.user is:", req.session.user);
                  res.end();
                  res.redirect(301, "/detail");
                }).catch(function(err){
                  res.render("LoginPage", {title: "登录", user: {username: req.body.username}, error: err});
                });
  });

  router.get("/logout", function(req, res, next){
    delete req.session.user;
    res.end();
    res.redirect("/login");
  });

  /* RegistPage routes. */
  router.get("/regist", function(req, res, next) {
    res.render("RegistPage", {title: "注册", user:{}});
  });
  
  router.post("/regist", function(req, res, next) {
    var newUser = req.body;
    userManager.checkUser(newUser)
                .then(userManager.createUser)
                .then(function(){
                  // debug("current newUser is: \n", newUser);
                  req.session.user = newUser;
                  // debug("current request.session is: ", req.session);
                  res.end(); 
                  res.redirect(301, "/detail");
                }).catch(function(err){
                  debug("Failed to create a new user, turn back to render registPage");
                  res.render("RegistPage", {title: "注册", user: newUser, error: err})
                });
  });  

  // Routes below is protected by the login checker
  /* DetailPage routes. */
  router.get("/detail", function(req, res, next) {
    // debug("current detail request.session is: ", req.session);
    res.render("DetailPage", {title: "详情", user: req.session.user});
  });
  
  router.all("*", function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
	  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');  
    res.setHeader("Content-Type", "application/json;charset=utf-8");

    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  return router;
};

function getUserName(URL){
  return queryString.parse(url.parse(URL).query).username;
}