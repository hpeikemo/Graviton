var App = function(canvas) {
	var app = this,
		model = {},
		canvas = canvas,
		context;		
	
	var c = 0
	app.update = function() {
		if (++c%150 == 0) Benchmark.reportAndResetAll()

		mouse.force += 2;
    if (mouse.pressed) model.forceMap.addToForce(Math.round(mouse.x/6),Math.round(mouse.y/6),mouse.force);

		model.forceMap.update(model.forces);
		
	}
	
	app.draw = function() {
    //context.clearRect(0,0,canvas.width, canvas.height);
    
    context.fillStyle = 'rgba(0,0,0,.001)';
  	context.fillRect( 0, 0, canvas.width, canvas.height );
  	
		model.forceMap.debug(context,model.forces,drawdebug);
	}
	
	var drawdebug = false;
	app.keyup = function() {
		//drawdebug =! drawdebug;
	};
	
	var mouse = {
	  force:0,
	  pressed:false,
	  x:0,
	  y:0
	};
	
	app.mousedown = function(e) {
		mouse.pressed = true;
	};
	
	app.mouseup = function(e) {
		mouse.pressed = false
		mouse.force = 0;
	};	
	app.mousemove = function(e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	};
	
	
	app.resize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		context.fillStyle = 'rgba(0,0,0,1)';
  	context.fillRect( 0, 0, canvas.width, canvas.height );
    
	};
	
	(function() {
		context = canvas.getContext('2d');
		
		model.forceMap = new ForceMap(0,0,100, 100, 1);
		model.forces = []
		for (var i=0; i < 20; i++) {
			model.forces.push(
				new Force( Math.random()*100,Math.random()*100,Math.random()*50 )
			)
		};
//		var f=new Force( 50,50,150 )
    // f.vx = 3
    // f.vy = 2
//		model.forces.push(f);
		
		app.resize();
	})();
};