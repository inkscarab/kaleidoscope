var _img, img, flag, delta, A = 0,
  Aref = 0,
  deltaX = 0,
  deltaY = 0;
var _img = document.getElementById("img");

var _c = document.createElement("canvas");
var _ctx = _c.getContext("2d");

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var cw = c.width = _c.width = window.innerWidth,
  cx = cw / 2;
var ch = c.height = _c.height = window.innerHeight,
  cy = ch / 2;

var rad = Math.PI / 180;
var frames = 0;
var requestId = null;
var m = {
  x: cx,
  y: cy
}
var side = 250;
var h = side * Math.cos(30 * rad);
drawPath(side, _ctx); //for _ctx.clip();

function Draw() {
  _ctx.save(); // for _ctx.clip();
  frames += .1;
  flag = 0;
  delta = 0; // for hexagons layout
  if (Math.abs(Aref - A) > Math.PI) {
    var dif = 2 * Math.PI - Math.abs(Aref - A);
  } else {
    dif = Aref - A;
  }
  A += dif / 20;//lerp interpolation
  A_cos = Math.cos(A);
  A_sin = Math.sin(A);
  //rotate the first canvas: _c	
  _ctx.setTransform(A_cos, A_sin, -A_sin, A_cos, 0, 0);
  //clipping the first canvas: _c
  _ctx.clip();
  _ctx.drawImage(_img, -512, -512);
  // painting the 2-nd canvas: c
  img = _c;
  for (var y = 0; y < ch + side; y += h) {
    flag++;
    if (flag % 2 == 0) {
      delta = 0;
    } else {
      delta = 1.5 * side;
    }
    for (var x = 0 + delta; x < cw + delta + side; x += 3 * side) {
      placeHex(x, y, img)
    }
  }
  _ctx.restore();
  requestId = window.requestAnimationFrame(Draw);
}

function placeHex(x, y, img) {
  //in order to eliminate ctx.save y ctx.restore() use ctx.setTransform
  for (var i = 0; i < 6; i++) {
    if (i % 2 == 0) {
      ctx.scale(-1, 1); /*for the mirror*/
    }
    var a_cos = Math.cos(60 * i * rad);
    var a_sin = Math.sin(60 * i * rad);
    ctx.drawImage(img, 0, 0);
    ctx.setTransform(a_cos, a_sin, -a_sin, a_cos, x, y);
  }
}

function drawPath(side, ctx, fill) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(side, 0);
  ctx.lineTo(side * Math.cos(60 * rad), side * Math.sin(60 * rad));
  ctx.closePath();
}

function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}

c.addEventListener("mousemove", function(e) {
  m = oMousePos(c, e);
  deltaX = (m.x - cx) * .01;
  deltaY = (m.y - cy) * .01;
  Aref = Math.atan2(deltaY, deltaX);
}, false);

function Init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }
  cw = c.width = _c.width = window.innerWidth, cx = cw / 2;
  ch = c.height = _c.height = window.innerHeight, cy = ch / 2;
  m = {
    x: cx,
    y: cy
  }
  drawPath(side, _ctx);
  Draw();
}

setTimeout(function() {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);
