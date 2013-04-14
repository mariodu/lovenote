(function($) {
  $.fn.extend({
    resizeImg: function(element, w, h){
      var _element = $(element);
      if (!_element || _element.size() == 0) {
        return;
      }
      if (!h) {
        var h = w;
      }
      var proportion = w / h;
      var resetImg = function() {
        if (_element.length === 0) {
          return;
        }
        var img = $(_element[0]);
        _element = _element.slice(1);
        if (img[0].complete) {
          resize(img, "complete");
          setTimeout(resetImg, w, h, 25);
          return;
        }
        if (img.width() > w) {
          resize(img, "notload");
          setTimeout(resetImg, w, h, 25);
        } else {
          img.load(function() {
            resize(img, "load");
            setTimeout(resetImg, w, h, 25);
          });
        }
      };
      resetImg();

      function resize(img, _w, _h, t) {
        var width = _w;
        var height = _h;
        var p;
        if (!width || !height) {
          if (img[0].naturalWidth !== undefined) {
            width = img[0].naturalWidth;
            height = img[0].naturalHeight;  //html5
          }else{
            img.css({
              "width": "auto",
              "height": "auto",
              "max-width": "none",
              "max-height": "none"
            });
            width = img.width();
            height = img.height();
            if (width === 0){
              var pic = img.clone();
              pic.css({
                "visibility": "hidden",
                "position": "absolute"
              });
              $("body").append(pic);
              width = pic.width();
              height = pic.height();
              pic.remove();
              pic = null;
            }
          }
        }
        p = width / height;
        if (proportion <= p) {
          p = height / h;
          img.width(Math.floor(width / p));
          img.height(h);
          img.css("marginLeft", -Math.floor((img.width() - w) / 2));
        }else{
          p = width / w;
          img.height(Math.floor(height / p));
          img.width(w);
          img.css("marginTop", -Math.floor((img.height() - h) / 4));
        }
      };
    }
  });
})(jQuery);
