// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
  (function() {
    var noop = function() {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var length = methods.length;
    var console = window.console = {};
    while (length--) {
      console[methods[length]] = noop;
    }
  }());
}

// Place any jQuery/helper plugins in here.

// Canvas background
// (function() {
  var mouse = {x:0, y:0};
  var colors = [ "#445E96", "#667FAF", "#C9E1F5", "#BA3A33", "#CA5E5B", "#FACECE" ];
  var canvas = document.getElementById('canvas-background');
  var context;
  var dots = [];

  var C_WIDTH;
  var C_HEIGHT;
  var DOT_SPACING = 48;
  var DOT_RADIUS = 30;

  // parallax
  var shiftx, shifty;
  var OFFSETX = 2;
  var OFFSETY = 2;
  
  function initialize() {
    resize_canvas();

    $(window).on({
      mousemove: function(e) {
        if (e.pageX != undefined && e.pageY != undefined) {
          mouse.x = e.pageX;
          mouse.y = e.pageY;
        } else {
          mouse.x = e.clientX + document.body.scrollLeft + 
            document.documentElement.scrollLeft;
          mouse.y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
        }      
        shiftx = Math.pow((mouse.x - C_WIDTH/2) / (C_WIDTH/2),3) * OFFSETX * DOT_SPACING;
        shifty = Math.pow((mouse.y - C_HEIGHT/2) / (C_HEIGHT/2),3) * OFFSETY * DOT_SPACING;
      }
      , mousedown: function(e) {
        mouse_down();
      }
    });
    
    var doit;
    $(window).resize(function() {
      $('#canvas-background').hide();
      clearTimeout(doit);
      doit = setTimeout(function() {
        resize_canvas();
        $('#canvas-background').show();
      }, 500);
    }); 

    setInterval( function() {
      update_dots();
      redraw_canvas();
    }, 20 );
  }

  function resize_canvas() {
    C_WIDTH = $(window).width();
    C_HEIGHT = Math.max($('#content-wrapper').height(), $(document).height());
    canvas.width = C_WIDTH;
    canvas.height = C_HEIGHT;
    context = canvas.getContext('2d');
    
    initialize_dots();
  }

  function mouse_down() {
    for (var i = 0; i < dots.length; i++) {
      dot = dots[i];
      if (dots[i] != null) {
        // animate dots in mouse radius
        distance = distance_between({ x: dot.x, y: dot.y }, mouse);
        if (distance < DOT_SPACING * 2.5) {
          // add random velocity
          dot.vy = Math.floor( Math.random() * 10 ) - 5;
          dot.vx = Math.floor( Math.random() * 20 ) - 10; // can be negative
          dot.time = 1;

          // set max size
          dot.size = DOT_RADIUS;
        }
      }
    }
  }

  function initialize_dots() {
    // empty dot array
    dots = [];
    
    // initialize dot matrix with size and color
    for (var r = -OFFSETY; r < C_HEIGHT / DOT_SPACING + OFFSETY; r++) {
      for (var c = -OFFSETX; c < C_WIDTH / DOT_SPACING + OFFSETX; c++) {
        dots.push({
          x: c*DOT_SPACING+DOT_RADIUS,
          y: r*DOT_SPACING+DOT_RADIUS,
          vx: 0,
          vy: 0,
          time: 0, // time counter used for gravity calc
          size: 0,
          size_acc: 0,
          active: false, // dot has been awakened by proximity
          color: colors[ Math.floor( Math.random() * colors.length ) ]
        });
      }
    }
  }

  function update_dots() {
    for (var i = 0; i < dots.length; i++) {
      dot = dots[i];

      if (dot != null) {
        // adjust to mouse position
        if (distance_between({ x: dot.x, y: dot.y }, mouse) < DOT_SPACING * 2.5) {
          // close to mouse position
          dot.size = DOT_RADIUS;
          dot.size_acc = -.7;
          dot.active = true;
        }

        // add movement

        // x,y coord
        dot.x = dot.x + dot.vx;
        dot.y = dot.y + dot.vy;
        if (dot.time > 100) {
          // kill
          dots[i] = null;
          break;
        } else if (dot.time > 0) {
          dot.time++;
        }

        // minimum size for active 
        min_size = (dot.active ? 4 : 0);        

        dot.size = Math.max( Math.min(dot.size + dot.size_acc, DOT_RADIUS), min_size );
      }
    }
  }

  function redraw_canvas() {
    context.clearRect(0, 0, C_WIDTH, C_HEIGHT);

    for (var i = 0; i < dots.length; i++) {
      dot = dots[i];

      if (dot != null) {
        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.x - shiftx, dot.y - shifty, dot.size, 0, Math.PI*2);
        context.closePath();
        context.fill(); 
      }
    }
  }

  function distance_between(p1,p2) {
    return Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
  }
// }());