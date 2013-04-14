var App = {
  show_stack_info: function(title, message){
    var modal_overlay;
    if (typeof info_box != "undefined") {
      info_box.pnotify_display();
      return;
    }
    info_box = $.pnotify({
      title: title,
      text: message,
      type: "info",
      delay: 20000,
      history: false,
      stack: false,
      closer_hover: false,
      addclass: "modal-notice",
      hide: false,
      before_open: function(pnotify) {
        // Position this notice in the center of the screen.
        pnotify.css({
          "top": ($(window).height() / 2) - (pnotify.height() / 2),
          "left": ($(window).width() / 2) - (pnotify.width() / 2)
        });
        // Make a modal screen overlay.
        if (modal_overlay) modal_overlay.fadeIn("fast");
        else modal_overlay = $("<div />", {
          "class": "ui-widget-overlay",
          "css": {
            "display": "none",
            "position": "fixed",
            "top": "0",
            "bottom": "0",
            "right": "0",
            "left": "0"
          }
        }).appendTo("body").fadeIn("fast");
      },
      before_close: function() {
        modal_overlay.fadeOut("fast");
      }
    });
  },
  closeWindow: function(){
    window.opener=null;
    window.open('','_self');
    window.close();
  }
}
