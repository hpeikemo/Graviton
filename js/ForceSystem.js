
var v2 = function(x,y) {
  this.x = x || 0;
  this.y = y || 0;
  this.clone = function() { return new v2(this.x,this.y) };
  this.add = function(v) { return new v2(this.x+v.x,this.y+v.y) };
  this.subtract = function(v) { return new v2(this.x-v.x,this.y-v.y) };
  this.multiply = function(v) { return new v2(this.x*v.x,this.y*v.y) };
  this.addI = function(v) { this.x+=v.x;this.y+=v.y;return this };
  this.subtractI = function(v) { this.x-=v.x;this.y-=v.y;return this };
  this.multiplyI = function(v) { this.x*=v.x;this.y*=v.y;return this };

  // (function() {
  //   })();  
}



var Particlesystem = function() {
	
	var particles = [];
	var forces = [];
	var emitters = [];
	
  this.addParticle = function(p) {
    particles.push(p);
  };
  this.addForce = function(p) {
    
  };
  this.update = function() {
    var ary = [];
    var i = particles.length;    
		while (i--){if (!particles[i].isDead) {
			  particles[i].update();ary.push(particles[i]);
		}}
		particles = ary;
  };
  this.draw = function() {
    var i = particles.length;    
		while (i--){ particles[i].draw(); }
  };
		
}

var ForceParticle = function(acontext) {  
  var context = acontext;
  this.age = 0;
  this.lifespan = 100;
  this.isDead = false;
  this.p = new v2();//Position
  this.v = new v2(3,3);//Velocity
      
  this.update = function(context) {
    this.age += 1;
    this.p.addI(this.v);
    this.isDead = this.isDead || (this.age > this.lifespan);
  }
  this.draw = function() {
    context.beginPath();
		context.strokeStyle = '#ff00ff';
		context.lineWidth = 1;		
		context.arc(this.p.x,this.p.y,3,0,Math.PI*2);
		context.stroke();
		context.closePath();
  }
   
}