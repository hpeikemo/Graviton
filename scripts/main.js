var runloopTest = Benchmark.create("Entire runloop");
var updateTest = Benchmark.create("Update Phase");
var drawTest = Benchmark.create("Draw Phase");
var runloopInterval = Benchmark.create("Runloop interval");

var WORLD_WIDTH = 600;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');


var protons = new PGroup();
var g2 = new PGroup();


var universeBounds = new rectf(20,20,560,400);
var bounds = new ParticleBounds(universeBounds);
bounds.addGroup(protons);
bounds.addGroup(g2);

var gravityField = new GravityField(universeBounds,70,50);
gravityField.addGroup(protons)




var lTime = 0;
var c = 0;
var runLoop = function() {  
	var nTime = new Date().getTime();elapsed=(nTime-lTime);lTime=nTime;
  if (elapsed > 10000) return;
  c++
  if (c == 100 || c%250 == 0) Benchmark.reportAndResetAll();
  Benchmark.insert(runloopInterval,elapsed);
  Benchmark.run(runloopTest);
	  
  var fraction = 25*(elapsed/1000);
    
  Benchmark.run(updateTest);
  
  gravityField.update(fraction);
  gravityField.applyForce(protons.members.concat(g2.members));
  bounds.update(fraction);
	protons.update(fraction);
	g2.update(fraction);
	
	Benchmark.end(updateTest);
	Benchmark.run(drawTest);
	
	context.clearRect(0,0,canvas.width, canvas.height);  
//	gravityField.draw(context);
	protons.draw(context);
	g2.draw(context);
	bounds.draw(context);

  Benchmark.end(drawTest);
	
	while (protons.members.length < 300) {
	  var p = new Proton(Math.random()*30);
    p.p.addD(bounds.randomPointWithin());
    p.v.randomize().multiplyFD(.3);
    p.lifespan = Math.random() * 2500;
    protons.addMember(p);	  	    
	}
  if (c % 10 == 0 && g2.members.length < 10) {
	  var p = new BaseParticle();
    p.v.randomize().multiplyFD(.2);
    p.p.addD(bounds.randomPointWithin());
    g2.addMember(p);
	};	
	
	Benchmark.end(runloopTest);	
}

var sfactor = 1;

var resize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;  
  sfactor = canvas.width / WORLD_WIDTH;
  context.restore()
  context.scale(sfactor,sfactor)
}

var pressed = false;
var mousedown = function(e) {
  pressed = true;
//	console.log(e)	
};

var mouseup = function(e) {
  pressed = false;
	//mouse.pressed = false
	//mouse.force = 0;
};	
var mousemove = function(e) {
  if (pressed) {
    var p = new Proton(Math.random()*30);
    p.p.x = e.offsetX/sfactor;
    p.p.y = e.offsetY/sfactor;
    g2.addMember(p);	  	
  }
};



window.addEventListener('resize', resize);
document.addEventListener('mousemove',    mousemove, false);
document.addEventListener('mousedown', 		mousedown, false);
document.addEventListener('mouseup',			mouseup, false);
resize();
setInterval(runLoop, 40);



