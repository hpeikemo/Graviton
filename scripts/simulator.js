
var Proton = function(mass) {  
  this.mass = mass||5;
  this.init();
  
  this.draw = function(context) {
	  context.save();
    context.beginPath();
  	context.strokeStyle = 'rgba(0,0,70,.05)';
  	context.lineWidth = 1;		
  	context.arc(this.p.x,this.p.y,3+this.mass*.3,0,Math.PI*2);
	  context.stroke();
	  context.closePath();  
	  context.restore();
  }
}.inheritsFrom(BaseParticle);


var CreationAgent = function() {
  this.prototype = Renderable;
  
  var age = 0;
  
  this.update = function(fraction) {
    age += fraction;            
  };
  
};

