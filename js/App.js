var App = function(canvas) {
	var app = this,
		model = {},
		canvas = canvas,
		context;		
	
	var c = 0
	app.update = function() {
		if (++c%150 == 0) Benchmark.reportAndResetAll()
		
    if (mouse.pressed) model.forceMap.addToForce(Math.round(mouse.x/6),Math.round(mouse.y/6),40);

		model.forceMap.update(model.forces);
		
	}
	
	app.draw = function() {
    // context.clearRect(0,0,canvas.width, canvas.height);
    
    context.fillStyle = '#bb000000';
  	context.fillRect( 0, 0, canvas.width, canvas.height );
  	
		model.forceMap.debug(context,model.forces,debug);
	}
	
	var debug = false;
	app.keyup = function() {
		debug =! debug;
	};
	
	var mouse = {
	  pressed:false,
	  x:0,
	  y:0
	};
	
	app.mousedown = function(e) {
		mouse.pressed = true;
	};
	
	app.mouseup = function(e) {
		mouse.pressed = false
	};	
	app.mousemove = function(e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	};
	
	
	app.resize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
	
	(function() {
		context = canvas.getContext('2d');
		
		model.forceMap = new ForceMap(0,0,100, 100, 1);
		model.forces = []
		for (var i=0; i < 50; i++) {
			model.forces.push(
				new Force( Math.random()*100,Math.random()*100,Math.random()*150 )
			)
		};
//		var f=new Force( 50,50,150 )
    // f.vx = 3
    // f.vy = 2
//		model.forces.push(f);
		
		app.resize();
	})();
};