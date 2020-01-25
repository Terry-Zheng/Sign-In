$(function(){
  // The operation when the input text box is blur
  $("#input-bar input").blur(function(){
    // console.log(this.name, "is blur!");
    if (validator.checkInfoFormat(this.name, $(this).val())){
      $(this).parent().find("span.status").text('').hide();
    } else {
      $(this).parent().find("span.status").text(validator.getErrorMessage(this.name)).show();
    }
  });

  $("#clear").click(function(event){
    event.preventDefault();
    $("#input-bar input").val("");
    $("#error-bar span").text("");
  });

  $("#submit").click(function(){
    $("#input-bar input").blur();
    if (!validator.checkFormFormat()) {
      alert("请按提示输入注册信息");
      return false;
    }
  });
});