var express = require("express");
var router = express.Router();
var debug = require("debug")("signin:index");
var queryString = require('querystring');

module.exports = function(db){
  // var registed_Users = db.collection("users");
  // debug("users collection setup as: ", registed_Users);
  var userManager = require("../models/user")(db);

  // router.get("/", function(req, res, next) {
  //   var data = queryString.parse(str)
  // });

  /* LoginPage routes. */
  router.get("/login", function(req, res, next) {
    // debug("-------------------------------------------------------");
    res.render("LoginPage", {title: "登录", user:{}});
  });
  
  router.post("/login", function(req, res, next) {
    // debug("-------------------------------------------------------");
    userManager.findUser(req.body.username, req.body.userpassword)
                .then(function(user){
                  if (user == null) return Promise.reject("用户名或密码错误")
                  // debug("current return user from findUser is: ", user);
                  if (req.session.user) {
                    // debug("old req.session.user is:", req.session.user.username);
                    delete req.session.user;
                    req.session.user ? debug("delete error") : debug("delete successfully");
                  }
                  req.session.user = user;
                  debug("current session.user is:", req.session.user);
                  res.redirect("/detail");
                }).catch(function(error){
                  res.render("LoginPage", {title: "登录", user: {username: req.body.username}, error: "用户名或密码错误"});
                });
  });

  router.get("/logout", function(req, res, next){
    // debug("-------------------------------------------------------");
    delete req.session.user;
    res.redirect("/login");
  });

  /* RegistPage routes. */
  router.get("/regist", function(req, res, next) {
    // debug("-------------------------------------------------------");
    res.render("RegistPage", {title: "注册", user:{}});
  });
  
  router.post("/regist", function(req, res, next) {
    // debug("-------------------------------------------------------");
    var newUser = req.body;
    // debug("user is: ", newUser.username);
    userManager.checkUser(newUser)
               .then(userManager.createUser)
               .then(function(newUser){
                //  debug("create new user: ", newUser.username, "successfully!");
                 if (req.session.user) {
                  //  debug("old req.session.user is:", req.session.user.username);
                   delete req.session.user;
                   req.session.user ? debug("delete error") : debug("delete successfully");
                 }
                 req.session.user = newUser;
                //  debug("current req.session.user is:", req.session.user.username);
                 res.redirect("/detail");
               }).catch(function(err){
                 res.render("RegistPage", {title: "注册", user: newUser, error: "The input user is not unique!"})
               });
  });  

  // Routes below is protected by the login checker
  /* DetailPage routes. */
  router.get("/detail", function(req, res, next) {
    // debug("-------------------------------------------------------");
    // debug("current session.user is:", req.session.user);
    res.render("DetailPage", {title: "详情", user: req.session.user});
  });
  
  router.all("*", function(req, res, next){
    // debug("-------------------------------------------------------");
    // debug("current req.url is: ", req.url);
    // debug("current req.body is: ", req.body);
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  return router;
};