/*
var Klass = function(arg1,arg2) {
  //Privates:
  var private1 = 1;
  
  //Publics:
  this.public1 = "hi";
  
  //Public methods:
  this.method1 = function(arg1) {};
  
  //Constructor:
  (function() { 
  })();    
};
*/

//renderable
var Renderable = function() {
  this.update = function(fraction) {}
  this.draw = function(context) {}
};

//Base particle
var BaseParticle = function() {
  this.init = function() {
    this.age = 0;
    this.lifespan = 1000;
    this.isDead = false;
    this.p = new v2f();//Position
    this.v = new v2f();//Velocity
  }
  this.init();
  
  this.update = function(fraction) {
    fraction = fraction || 1;
    this.age += fraction;
    this.p.x += this.v.x*fraction;
    this.p.y += this.v.y*fraction;
    this.isDead = this.isDead || (this.age > this.lifespan);
  };
  this.draw = function(context) { //override
    context.beginPath();
		context.strokeStyle = '#ff00ff';
		context.lineWidth = 1;		
		context.arc(this.p.x,this.p.y,3,0,Math.PI*2);
		context.stroke();
		context.closePath();
  };
  
  
}.inheritsFrom(Renderable);

//Base class for agents and forces.
var BaseAgent = function() {
  var groups = []
  this.addGroup = function(group) {groups.push(group);};
  this.getAll = function() {    
    var arys = []
    var i = groups.length;    
    while (i--){arys[i] = groups[i].members;}
    var a = [];
    return a.concat.apply(a,arys);
  };
}.inheritsFrom(Renderable);

//Group particles, Forces and agents interact with particles trough groups.
// WARN: Particles belonging to multiple groups will be updated more often than they should.
var PGroup = function() {
  this.members = [];
  this.addMember = function(p) {this.members.push(p);};
  this.update = function(fraction) {
    var ary = [];
    var i = this.members.length;    
		while (i--){
		  if (!this.members[i].isDead) {
			  this.members[i].update(fraction);
			  ary.push(this.members[i]);
		  }
		}
		this.members = ary;
  };
  this.draw = function(context) {
    var i = this.members.length;    
    while (i--){ this.members[i].draw(context); }
  };    
  
}.inheritsFrom(Renderable);

//Kills off particles outside of bounds.
var ParticleBounds = function(rectangle) {	  
  this.rectangle=rectangle;
    
  this.update = function(fraction) {
    p = this.getAll();
    i = p.length;
    while(i--) {
      var pos = p[i].p;      
      p[i].isDead = p[i].isDead || pos.x < rectangle.x || pos.x > rectangle.x+rectangle.w || pos.y < rectangle.y || pos.y > rectangle.y+rectangle.h;      
    }
  };  
  this.draw = function(context) {
    context.save();
		context.strokeStyle = 'rgba(255,0,0,0.3)';
		context.lineWidth = 1;		
		context.strokeRect(rectangle.x,rectangle.y,rectangle.w,rectangle.h);
    context.restore();
  };  
  this.randomPointWithin = function() {
    return new v2f(rectangle.x + rectangle.w*Math.random(),rectangle.y + rectangle.h*Math.random())
  };
  
}.inheritsFrom(BaseAgent);
