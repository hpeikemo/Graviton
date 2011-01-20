var App = function(canvas) {
	var app = this,
		model = {},
		canvas = canvas,
		context;		
	
	var c = 0
	app.update = function() {
		if (++c%150 == 0) Benchmark.reportAndResetAll()
		model.system.update();
	}
	
	app.draw = function() {
//		context.clearRect(0,0,canvas.width, canvas.height);
//		model.forceMap.debug(context,model.forces,debug);
    model.system.draw();
	}
	
	var debug = false;
	app.keyup = function() {
//		debug =! debug;
	};
	
	app.resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	};
	
	(function() {
		context = canvas.getContext('2d');
		app.resize();
		
		model.system = new Particlesystem();
		model.system.addParticle(new ForceParticle(context));
		
	})();
};