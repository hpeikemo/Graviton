var runLoop = function() {
	app.update();
	app.draw();
}

var app = new App(document.getElementById('canvas'));
window.addEventListener('resize', app.resize);
document.addEventListener('keyup', app.keyup, false);

setInterval(runLoop, 40);