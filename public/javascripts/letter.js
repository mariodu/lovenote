$.pnotify.defaults.styling = "bootstrap";
$.pnotify.defaults.history = false;

var gardenCtx, gardenCanvas, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var offsetX, offsetY;
var yesBtn, noBtn, returnBtn;

$(window).resize(function() {
  var newWidth = $(window).width();
  var newHeight = $(window).height();
  if (newWidth != clientWidth && newHeight != clientHeight) {
    location.replace(location);
  }
});

//function
var Letter = {
  getHeartPoint: function(angle){
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
  },
  startHeartAnimation: function(){
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
      var bloom = Letter.getHeartPoint(angle);
      var draw = true;
      for (var i = 0; i < heart.length; i++) {
        var p = heart[i];
        var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
        if (distance < Garden.options.bloomRadius.max * 1.3) {
          draw = false;
          break;
        }
      }
      if (draw) {
        heart.push(bloom);
        garden.createRandomBloom(bloom[0], bloom[1]);
      }
      if (angle >= 30) {
        clearInterval(animationTimer);
        Letter.showMessages();
      } else {
        angle += 0.2;
      }
    }, interval);
  },
  showMessages: function(){
    Letter.adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
      Letter.showLoveU();
    });
  },
  adjustWordsPosition: function(){
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
  },
  showLoveU: function(){
    $('#loveu').fadeIn(3000);
  },
  timeElapse: function(date){
    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
      hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
    $("#elapseClock").html(result);
  },
  adjustCodePosition: function(){
    $('#letter-words').css("margin-top", ($("#garden").height() - $("#letter-words").height()) / 2);
  },
  noBtnEffect: function(){
    var i = 1;
    $("#disagreeBtn").mousemove(function(e){
      alert("\u4F60\u5FCD\u5FC3\u561B\uFF1FT-T");
      i = i + 1;
      if(i > 5){
        alert("\u592A\u6851\u5FC3\u4E86\uFF0C\u518D\u89C1\uFF01");
        App.closeWindow();
      }
    })
  },
  showButtons: function(){
    $('#letter-words').append("<br/>");
    $.each([yesBtn, noBtn, returnBtn], function(index, ele){
      if(ele != undefined){
        ele.hide();
        ele.appendTo('#letter-words');
        ele.fadeIn(2000);
      }
    });
    if($("#returnBtn").html() != undefined){
      $("#returnBtn").click(function(){
        location.href = "/"
      });
    }else{
      $("#agreeBtn").click(function(){
        var message = "\u73B0\u5728\u5728\u4F60\u7684\u5BDD\u5BA4\u697C\u4E0B\u5462\uFF0C\u6709\u4E00\u4E2A\u7537\u751F\u5728\u50BB\u50BB\u7684\u7AD9\u7740\uFF0C\u4F60\u8981\u4E0D\u8981\u4E0B\u53BB\u770B\u770B\u5462\uFF1F";
        var button = "<a href='javascript;;' class='mybtn'>\u53BB\u770B\u770B</a>";
        App.show_stack_info("\u5B59\u8212\u5B81\u540C\u5B66", message + button);
        $(".modal-notice a.mybtn").bind("click", function(e){
          e.preventDefault();
          $.pnotify_remove_all();
          $.ajax({
            type: "POST",
            url: "/letter_read",
            success: function(e){
              if(e.code != 103){
                alert(e.description);
              }
              App.closeWindow();
            },
            dataType: "json"
          });
        })
      });
      Letter.noBtnEffect();
    }
  }
}

$.fn.typewriter = function(callback){
  this.each(function() {
    var ele = $(this), str = ele.html(), progress = 0;
    ele.html('');
    var timer = setInterval(function() {
      var current = str.substr(progress, 1);
      if (current == '<') {
        progress = str.indexOf('>', progress) + 1;
      } else {
        progress++;
      }
      ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
      if (progress >= str.length) {
        clearInterval(timer);
        (callback && typeof(callback) === "function") && callback();
      }
    }, 75);
  });
  return this;
};

$(function(){
  if($("#returnBtn").html() != undefined){
    returnBtn = $("#returnBtn").clone();
    $("#returnBtn").remove();
  }else{
    yesBtn = $("#agreeBtn").clone();
    noBtn = $("#disagreeBtn").clone();
    $("#agreeBtn").remove();
    $("#disagreeBtn").remove();
  }
  $("#loading").fadeOut(1000);
  //set up garden
  loveHeart = $("#loveHeart");
  offsetX = loveHeart.width() / 2;
  offsetY = loveHeart.height() / 2 - 55;
  gardenCanvas = $("#garden")[0];
  gardenCanvas.width = loveHeart.width();
  gardenCanvas.height = loveHeart.height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  $("#letter-content").css("width", loveHeart.width() + $("#letter-words").width());
  $("#letter-content").css("height", Math.max(loveHeart.height(), $("#letter-words").height()));
  $("#letter-content").css("margin-top", Math.max(($(window).height() - $("#letter-content").height()) / 2, 10));
  $("#letter-content").css("margin-left", Math.max(($(window).width() - $("#letter-content").width()) / 2, 10));

  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);

  var ifallloveyou = new Date();
  ifallloveyou.setFullYear(2012, 12, 12);
  ifallloveyou.setHours(20);
  ifallloveyou.setMinutes(0);
  ifallloveyou.setSeconds(0);
  ifallloveyou.setMilliseconds(0);

  if (!document.createElement('canvas').getContext) {
    var msg = document.createElement("div");
    msg.id = "errorMsg";
    msg.innerHTML = "Your browser doesn't support HTML5!<br/>Recommend use Chrome 14+/IE 9+/Firefox 7+/Safari 4+";
    document.body.appendChild(msg);
    $("#letter-words").css("display", "none")
    $("#copyright").css("position", "absolute");
    $("#copyright").css("bottom", "10px");
    document.execCommand("stop");
  } else {
    setTimeout(function () {
      Letter.startHeartAnimation();
    }, 5000);

    Letter.timeElapse(ifallloveyou);
    setInterval(function () {
      Letter.timeElapse(ifallloveyou);
    }, 500);

    Letter.adjustCodePosition();
    $("#letter-words").typewriter(Letter.showButtons);
  }
});