function radialLookupTable() {	
	var ary=[];	
	var a=0;
	for (var i=0; i < 8; i++) {		
		var x = Math.round(Math.cos(a));
		var y = Math.round(Math.sin(a));
		var d = 1/Math.sqrt(x*x+y*y);
		ary.push([x,y,d/8])		
		a += Math.PI/4;
	};	
	return ary;	
};

var ForceMap = function(x,y,w,h) {
		
	var neighbors = radialLookupTable();	
	var field = new nArray(w,h);
	var fieldBuffer = new nArray(w,h);
	
	var getForceAt = function(x,y) {
		var nV = []
		for (var j = neighbors.length - 1; j >= 0; j--){				
			nV[j] = field.get(
				Math.round(x)+neighbors[j][0],
				Math.round(y)+neighbors[j][1]					
			);
		};		
		return [
			(nV[0]-nV[4]+(nV[7]+nV[1]-nV[3]-nV[5])*0.5),
			(nV[2]-nV[6]+(nV[1]+nV[3]-nV[5]-nV[7])*0.5)
		]
	}
			
	var c = 0;
	
	var updateLoopTest = Benchmark.create("Entire update loop");
	var forcePropagationTest = Benchmark.create("Force propagation loop");
	var drawLoopTest = Benchmark.create("Entire draw loop");
	
	this.update = function(forces) {
		Benchmark.run(updateLoopTest);					
		fieldBuffer.clearAll();
		
		for (var i = forces.length - 1; i >= 0; i--){			
			var force = forces[i];
			field.add(Math.round(force.x),Math.round(force.y),force.force)
			
			if(false) {
				var fo = getForceAt(force.x,force.y);
				force.x += force.vx += fo[0]*0.01;
				force.y += force.vy += fo[1]*0.01;				
				force.x = (force.x+w)%w
				force.y = (force.y+h)%h
			}
						
		}
				
		Benchmark.run(forcePropagationTest);				
		field.setEach(function(x,y,value) {
			
			var i = neighbors.length;
			while (i--){
				
				fieldBuffer.add(
					x+neighbors[i][0],
					y+neighbors[i][1],
					value * neighbors[i][2] * 0.9
				);
			};
			
			return value * 0.1;			
		});
		Benchmark.end(forcePropagationTest);
		field.addArray(fieldBuffer);
		Benchmark.end(updateLoopTest);		
	}


	
	var q = new Particle();
	q.x = 2;
	q.y = 50;
	q.vy = 0;
	q.vx = 1;
		
	
	this.debug = function(context,forces) {
		Benchmark.run(drawLoopTest);
		var f = 6
		
		if (true) {
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
		
		for (var i = forces.length - 1; i >= 0; i--){
			var force = forces[i];
			context.beginPath();
			context.strokeStyle = 'rgba(0,0,0,0.2)';
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
	
				
};


