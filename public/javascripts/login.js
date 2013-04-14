// Put your application scripts here
function autoresizeImg(img){
  var h,w;
  if(!!(window.attachEvent&&!window.opera)){
    h = document.documentElement.clientHeight;
    w = document.documentElement.clientWidth;
  }else{
    h = window.innerHeight;
    w = window.innerWidth;
  }
  var _h = Math.max(625,h);
  if($.browser.msie){
    $(img).resizeImg({w : w, h : _h});
    $(img).css({"margin":0});
    $("#login_container").css({"height": _h});
  }else{
    $("#login_bg").hide();
    $("#login_container").css({"background-image": "url(" + img.src + ")"});
    $("#login_container").css({"height":_h});
    setTimeout(function(){
      $("#login_container").css({"opacity":1});
    },300);
  }
}

jQuery.fn.extend({myshow:function(){
  var ele=this;
  if(ele.css("visibility")=="visible"){
    return;
  }
  var element={_ele:ele,_eleWidth:ele.width(),_init:function(){
    this._setcss();
    this._fixCss();
  },_setcss:function(){
    this._ele.css({"transition":"margin 0.3s ease-out ","-moz-transition":"margin 0.3s ease-out ","-webkit-transition":"margin 0.3s ease-out "});
  },_fixCss:function(){
    var _element=this;
    this._ele.css("visibility","visible");
    setTimeout(function(){
      _element._ele.css({"margin-left":"0px","opacity":1});
    },300);
  }};
  element._init();
},myhide:function(){
  var ele_toh=this;
  if(this.css("visibility")=="hidden"){
    return;
  }
  this.css({"opacity":"0","margin-left":"-96px"});
  setTimeout(function(){
    ele_toh.css("visibility","hidden");
  },300);
}});

var loginAnimation=function(target){
  this.args=$.extend({delaytime:"3s",targetObj:[]},target);
  this.init();
};

loginAnimation.prototype={init:function(){
  var target=this;
  if($.browser.msie){
    return;
  }
  $.each(target.args.targetObj,function(i,obj){
    $(obj).css("margin-left","-"+$(obj).width()+"px");
  });
  this.fixCSS();
},fixCSS:function(){
  var target=this;
  $.each(target.args.targetObj,function(i,obj){
    setTimeout(function(){
      $(obj).css({"transition":"margin 0.8s ease-out 0.5s","-moz-transition":"margin 0.8s ease-out 0.5s","-webkit-transition":"margin 0.8s ease-out 0.5s"});
      $(obj).css("margin-left","0");
    },300);
  });
},_bindEvent:function(){
  var target=this;
},sliderOut:function(){
  var target=this;
  setTimeout(function(){
    $.each(target.args.targetObj,function(i,obj){
      $(obj).css("margin-left","-"+$(obj).width()+"px");
    });
  },200);
},_getResult:function(){
}};

var loginaction={
  loginurl: "/login",
  init: function(){
    this.userName = $("#username");
    this.password = $("#password");
    this.form = $(".loginForm");
    this.loginBtn = $("#login-btn");
    this.bind();
  }, bind:function(){
    var btn = this.loginBtn;
    var current = this;
    btn.click(function(e){
      e.preventDefault();
      var form = $(this.form);
      var data = form.serialize();
      var url = this.loginurl;
      $("#pwdErro").myhide();
      $("#usernameErro").myhide();
      if(current.checkdata()){
        current.request(url, "post", data, function(e){
          if(e.code == false){
            if(e.failCode == 100){
              $("#pwdErro").text(e.failDescription).myshow();
            }else if(e.failCode == 101){
              $("#usernameErro").text(e.failDescription).myshow();
            }else{
              $("#pwdErro").text(e.failDescription).myshow();
            }
          }else{
            window.loginanimation.sliderOut();
            setTimeout(function(){
              location.href = e.return_to;
            }, 1600);
          }
        })
      }
    })
  }, checkdata: function(){
    var username = this.userName;
    var pwd = this.password;
    if(username.val() == ""){
      $("#usernameErro").text("\u60a8\u6ca1\u6709\u586b\u5199\u7528\u6237\u540d");
      $("#usernameErro").myshow();
      return false;
    }else{
      if(pwd.val() == ""){
        $("#pwdErro").text("\u60a8\u8fd8\u6ca1\u6709\u586b\u5199\u5bc6\u7801");
        $("#pwdErro").myshow();
        return false;
      }
      return true;
    }
    return true;
  }, request: function(url, type, data, fun){
    $.ajax({url: url, type: type, data: data, dataType: "json", success: function(e){
      if(fun){
        fun(e);
      }
    }});
  }
};

$.fn.inputChange = function(callback){
  if($.browser.msie){
    this.bind("propertychange", function(e){
      if(e.originalEvent.propertyName == "value"){
        $(this).keyup();
      }
    });
    this.bind("keyup", callback);
  }else{
    this.bind("input", callback);
  }
  return( this );
}

$(function(){
  window.onresize = window.onload = function(){
    var img = $("#login_bg img")[0];
    autoresizeImg(img);
  }
  $("#loading").fadeOut(1000);
  window.loginanimation = new loginAnimation({targetObj:["#word_one","#word_two","#word_three",".group",".group-btn"]});
  loginaction.init();
  $(".group input").focus(function(){
    $(this).siblings("label").css("visibility","hidden");
    $(this).css("background","#030302");
  }).blur(function(){
    $(this).css("background","rgba(25, 35, 25, 0.75)");
    if($(this).val()==""||$(this).val()==$(this).siblings("label").text()){
      $(this).siblings("label").css("visibility","visible");
    }
  });
  var uninput = $("#username");
  var pwdinput = $("#password");

  uninput.inputChange(function(){
    if($("#usernameErro").css("visibility")=="visible"){
      $("#usernameErro").myhide();
    }
  });

  pwdinput.inputChange(function(){
    if($("#pwdErro").css("visibility")=="visible"){
      $("#pwdErro").myhide();
    }
  });

  $(".remember").click(function(e){
    e.preventDefault();
    $(this).toggleClass("remember-select");
    var _a=$("#autoLogin").val();
    if(_a=="true"){
      $(this).attr("title","\u672a\u81ea\u52a8\u767b\u5f55");
      $("#autoLogin").val("false");
    }else{
      $(this).attr("title","\u5df2\u81ea\u52a8\u767b\u5f55");
      $("#autoLogin").val("true");
    }
  });
})