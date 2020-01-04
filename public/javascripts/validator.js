var validator = {
  form: {
    username: {
      status: false,
      errMsg: "用户名6~18位英文字母、数字或下划线，必须以英文字母开头"
    },
    userpassword: {
      status: false,
      errMsg: "密码为6~12位数字、大小写字母、中划线、下划线"
    },
    userrepeat: {
      status: false,
      errMsg: "两次输入的密码不一致"
    },
    userid: {
      status: false,
      errMsg: "学号8位数字，不能以0开头"
    },
    usertel: {
      status: false,
      errMsg: "电话11位数字，不能以0开头"
    },
    useremail: {
      status: false,
      errMsg: "请输入合法的邮箱"
    }
  },
  
  checkUserNameFormat: function(testName){
    return this.form.username.status = /^[a-zA-Z][a-zA-Z_0-9]{5,17}$/.test(testName);
  },
  checkUserPasswordFormat: function(testPassword){
    this.userpassword = testPassword;
    return this.form.userpassword.status = /^[a-zA-Z0-9_\-]{6,12}$/.test(testPassword);
  },
  checkUserRepeatFormat: function(testRepeat){
    return this.form.userrepeat.status = this.userpassword == testRepeat;
  },
  checkUserIdFormat: function(testId){
    return this.form.userid.status = /^[1-9]\d{7}$/.test(testId);
  },
  checkUserTelFormat: function(testTel){
    return this.form.usertel.status = /^[1-9]\d{10}$/.test(testTel);
  },
  checkUserEmailFormat: function(testEmail){
    return this.form.useremail.status = /^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(testEmail);
  },
  
  checkInfoFormat: function(infoName, testInfo){
    var funcName = infoName[4].toUpperCase() + infoName.substring(5).toLowerCase();
    return this["checkUser" + funcName + "Format"](testInfo);
  },
  checkFormFormat: function(){
    return this.form.username.status &&
           this.form.userid.status &&
           this.form.usertel.status &&
           this.form.useremail.status &&
           this.form.userpassword.status &&
           ((typeof window !== "object") || // It's server-side if this is true
            this.form.userrepeat.status);   // Only client-side need to check repeat-password
  },

  getErrorMessage: function(infoName){
    return this.form[infoName].errMsg;
  },

  checkAttrValueUnique: function(registUsers, testUser, infoName){
    for (var tmpUserName in registUsers) {
      if (registUsers.hasOwnProperty(tmpUserName) && 
          registUsers[tmpUserName][infoName] == testUser[infoName]) {
        return false;
      }
    }
    return true;
  }
};
  
if (typeof module === "object") {
  module.exports = validator;
}