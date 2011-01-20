var runLoop = function() {
	app.update();
	app.draw();
}

var app = new App(document.getElementById('canvas'));
window.addEventListener('resize', app.resize);
document.addEventListener('keyup', app.keyup, false);
document.addEventListener('mousemove', app.mousemove, false);
document.addEventListener('mousedown', 		app.mousedown, false);
document.addEventListener('mouseup',			app.mouseup, false);


setInterval(runLoop, 40);