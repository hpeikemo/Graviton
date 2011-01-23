//Rectangle
var rectf = function(x,y,w,h) {
  this.x=x||0;
  this.y=y||0;
  this.w=w||0;
  this.h=h||0;
};
//2dmiensional point.
var v2f = function(x,y) {
  this.x = x || 0;
  this.y = y || 0;
  this.clone = function() { return new v2f(this.x,this.y) };
  this.add = function(v) { return new v2f(this.x+v.x,this.y+v.y) };
  this.subtract = function(v) { return new v2f(this.x-v.x,this.y-v.y) };
  this.multiply = function(v) { return new v2f(this.x*v.x,this.y*v.y) };
  this.multiplyF = function(n) { return new v2f(this.x*n,this.y*n) };
  this.addD = function(v) { this.x+=v.x;this.y+=v.y;return this };
  this.subtractD = function(v) { this.x-=v.x;this.y-=v.y;return this };
  this.multiplyD = function(v) { this.x*=v.x;this.y*=v.y;return this };  
  this.multiplyFD = function(n) { this.x*=n;this.y*=n;return this };  
  this.randomize = function() {this.x = Math.random()*2-1;this.y = Math.random()*2-1;return this;}
};
//Two dimensional Array.
var array2f = function(aw,ah) {
	var w = this.w = aw;
	var h = this.h = ah;
	var l = this.l = w*h;	
	var data = this.data = [];	
	this.get = function(x,y) {				
		if (x < 0 || y < 0 || x > w-1 || y > h-1) return 0;
		return data[ y*w + x ]
	}
	this.set = function(x,y,value) {
		if (x < 0 || y < 0 || x > w-1 || y > h-1) return;
		return data[ y*w + x ] = value
	}
	this.add = function(x,y,value) {
		if (x < 0 || y < 0 || x > w-1 || y > h-1) return;
		return data[ y*w + x ] += value		
	}
	this.multiply = function(x,y,value) {
		if (x < 0 || y < 0 || x > w-1 || y > h-1) return;
		return data[ y*w + x ] *= value
	}		
	this.each = function(callback) {
		for (var i = l - 1; i >= 0; i--){
			var x = i % w;
			var y = Math.floor(i/w);
			callback(x,y,data[i]);			
		};
	}
	this.addArray = function(value) {
		for (var i = l - 1; i >= 0; i--){
			data[i] += value.data[i];			
		}
	}	
	this.setEach = function(callback) {
		for (var i = l - 1; i >= 0; i--){
			var x = i % w;
			var y = Math.floor(i/w);
			data[i] = callback(x,y,data[i]);
		};
	}
	var clearAll = this.clearAll = function(value) {
		value = value || 0;
		for (var i = l - 1; i >= 0; i--){
			data[i] = value;
		};
	}
	var v = function() {
		clearAll()		
	}();
}
