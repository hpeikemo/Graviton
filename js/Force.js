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
	
}
