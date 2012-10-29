$(document).ready(function() {
  
  var Q = $({});
  
  // canvas background launcher
  if ($.browser.msie && parseInt($.browser.version) < 9) {
    if ($('canvas#canvas-background').length > 0) {
      $('canvas#canvas-background').remove();
    }      
  } else {
    // default canvas background
    if ($('canvas#canvas-background').length > 0) {
      Q.delay(500, 'anim');
      Q.queue('anim', function(next) {
        initialize();
        next();
      });
    } 
  }
  
  setTimeout(function() {
    Q.dequeue('anim');
  }, 500);
});