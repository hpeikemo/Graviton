var runLoop = function() {
	app.update();
	app.draw();
}

var app = new App(document.getElementById('canvas'));
window.addEventListener('resize', app.resize);

setInterval(runLoop, 40);