var Force = function(x,y,force) {
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.force = force;
};

var Particle = function() {
	
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	
	this.clone = function() {
		var c = new Particle();
		c.x = this.x;
		c.y = this.y;
		c.vx = this.vx;
		c.vy = this.vy;		
		return c;
	}
	
	this.friction = function(fr,max) {		
		this.vx = Math.min(Math.max(this.vx*fr,-max),max);
		this.vy = Math.min(Math.max(this.vy*fr,-max),max);		
	}
	
	this.applyForce = function(fo,mult,clamping) {
		var clamping = clamping || 0;
		this.vx += Math.min(Math.max(fo[0]*mult,-clamping),clamping);
		this.vy += Math.min(Math.max(fo[1]*mult,-clamping),clamping);		
	}
	
}

