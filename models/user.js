var validator = require('../public/javascripts/validator');
var bcrypt = require('bcryptjs');
var debug = require('debug')('signin:user');
var __ = require('lodash');

module.exports = function(db){
  const mydb = db.db('login');
  var users = mydb.collection('login');

  return {
    findUser: function(username, userpassword){
      debug("The user to be search in the database is: ", username, "[", userpassword, "]");
      return users.findOne({username: username})
                  .then(function(user){
                    debug("findUser...");
                    return user ? bcrypt.compare(userpassword, user.userpassword)
                                        .then(function(result){
                                          return result ? user : null;
                                        })
                                : Promise.reject("user doesn't exist!");
                  });
    },

    createUser: function(newUser){
      debug("newUser is : ", newUser);
      newUser = __.omit(newUser, 'userrepeat');
      var salt = 10;
      // debug("attempting to create a new user:\n", newUser);
      return bcrypt.hash(newUser.userpassword, salt)
                   .then(function(hash){
                     debug("hash successfully!");
                     newUser.userpassword = hash;
                     users.insertOne(newUser);
                     return newUser;
                   });
    },

    checkUser: function(user){
      var formatErrors = validator.getAllErrorMessage(user);
      return new Promise(function(resolve, reject){
                          formatErrors ? reject(formatErrors) : resolve(user);
                        }).then(function(user){
                          return users.findOne(getQuery(user))
                                      .then(function(duplicatedUser){
                                        if (duplicatedUser) {
                                          debug("duplicateUser is: ", duplicatedUser);
                                          return Promise.reject("user isn't unique!")
                                        } else {
                                          return Promise.resolve(user);
                                        }
                                      })
                        })
      }
  }
}

function getQuery(user){
  return {
    $or: __(user).omit('userpassword').toPairs()
                .map(function(pair){
                  obj = {};
                  obj[pair[0]] = pair[1];
                  return obj;
                }).value()
  }
}