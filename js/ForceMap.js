var ForceMap = function(x,y,w,h) {
	
	var neighbors = [
		[1,	 0, 0.17],	// East
		[0,	-1, 0.17],	// North
		[-1,	 0, 0.17],	// West
		[0,	 1, 0.17],	// South
		[1,	-1, 0.08],	// North-east
		[-1,	-1, 0.08],	// North-west
		[-1,	 1, 0.08],	// South-West
		[1,	 1, 0.08]	// South-east
	];
	
	var field = new nArray(w,h);
	var fieldBuffer = new nArray(w,h);
	
	var forcesTest;
	
	var c = 0;
	
	var updateLoopTest = Benchmark.create("Entire update loop");
	var drawLoopTest = Benchmark.create("Entire draw loop");
	
	this.update = function(forces) {
		Benchmark.run(updateLoopTest);
		
		forcesTest = forces;
		
		if (c++%1 != 0) return;
		
		fieldBuffer.clearAll();
		
		for (var i = forces.length - 1; i >= 0; i--){			
			var force = forces[i];
			field.add(Math.round(force.x),Math.round(force.y),force.force)
			
			if(true) {
				var fo = getForceAt(force.x,force.y);
				force.x += force.vx += fo[0]*0.001;
				force.y += force.vy += fo[1]*0.001;				
				force.x = (force.x+w)%w
				force.y = (force.y+h)%h
			}
						
		}
		
		field.setEach(function(x,y,value) {
			
			for (var i = neighbors.length - 1; i >= 0; i--){
				
				fieldBuffer.add(
					x+neighbors[i][0],
					y+neighbors[i][1],
					value * neighbors[i][2] * 0.8
				);
			};
			
			return value*0.1;			
		});
				
		field.addArray(fieldBuffer);		
		
		
		Benchmark.end(updateLoopTest);		
	}

	
	var q = new particle();
	q.x = 2;
	q.y = 50;
	q.vy = 0;
	q.vx = 1;
		
	
	this.debug = function(context) {
		Benchmark.run(drawLoopTest);
		var f = 6
		
		if (false) {
			var maxValue = 1;
			field.each(function(x,y,value) {
				if (value > maxValue) maxValue = value;				
			});
			
			field.each(function(x,y,value) {			
				context.fillStyle = 'rgba(0,0,0,'+value/maxValue+')';
				context.beginPath();
				//context.arc(x*10,y*10,5,0,Math.PI*2);
				context.fillRect(Math.round(x)*f,Math.round(y)*f,f,f);
				context.closePath();
			});
			
		}			
		
		
		for (var i = forcesTest.length - 1; i >= 0; i--){
			var force = forcesTest[i];
			context.beginPath();
			context.strokeStyle = '#0000ff';
			context.lineWidth = 1;
			
			context.arc(force.x*f,force.y*f,3+force.force*.3,0,Math.PI*2);
			context.stroke();
			
			context.closePath();
		}
		
		
		if (true) {
			
		
			var fo = getForceAt(q.x,q.y);
			q.x += q.vx += fo[0]	*.01;
			q.y += q.vy += fo[1]	*.01;
			
			q.x += w;
			q.y += h;
							
			q.x %= w;
			q.y %= h;	
			
			
			
			context.beginPath();
			context.strokeStyle = '#ff00ff';
			context.lineWidth = 1;
			
			context.arc(q.x*f,q.y*f,3,0,Math.PI*2);
			context.stroke();
			
			context.closePath();
			
			
			var p = q.clone();		
      	
      	
      	
			context.beginPath();		
			context.strokeStyle = '#ff0000';
			context.lineWidth = 1;
					
			context.moveTo( p.x * f , p.y * f)
			for (var i = 50 - 1; i >= 0; i--){
      	
				fo = getForceAt(p.x,p.y);
				p.vx += fo[0]	*.01;
				p.vy += fo[1]	*.01;
				p.x += p.vx;
				p.y += p.vy;
				context.lineTo( p.x *f, p.y *f) 
				
			};	
			context.stroke();
	   	
			context.closePath();	
		}		
				
		Benchmark.end(drawLoopTest);
	}
	
	
	
	var getForceAt = function(x,y) {
		var nV = []
		for (var j = neighbors.length - 1; j >= 0; j--){				
			nV[j] = field.get(
				Math.round(x)+neighbors[j][0],
				Math.round(y)+neighbors[j][1]					
			);
		};
		
		
		
		return [
			(nV[0]-nV[2]+(nV[4]+nV[7]-nV[5]-nV[6])*0.5),
			(nV[3]-nV[1]+(nV[7]+nV[6]-nV[5]-nV[4])*0.5)
		]
	}
	
		
};


var particle = function() {
	
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	
	this.clone = function() {
		var c = new particle();
		c.x = this.x;
		c.y = this.y;
		c.vx = this.vx;
		c.vy = this.vy;		
		return c;
	}
	
}

var nArray = function(aw,ah) {
	var w = this.w = aw;
	var h = this.h = ah;
	var l = this.l = w*h;
	
	var data = this.data = [];
	
	this.get = function(x,y) {				
		if (x < 0 || y < 0 || x >= w-1 || y >= h-1) return 0;
		return data[ y*w + x ]
	}
	this.set = function(x,y,value) {
		if (x < 0 || y < 0 || x >= w-1 || y >= h-1) return;
		return data[ y*w + x ] = value
	}
	
	this.add = function(x,y,value) {
		if (x < 0 || y < 0 || x >= w-1 || y >= h-1) return;
		return data[ y*w + x ] += value		
	}

	this.multiply = function(x,y,value) {
		if (x < 0 || y < 0 || x >= w-1 || y >= h-1) return;
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
