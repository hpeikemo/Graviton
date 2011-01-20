function radialLookupTable() {	
	var ary=[];
	var sa = Math.PI/2
	var l  = Math.round(Math.PI*2/sa)
	for (var a=0; a < Math.PI*2; a += sa) {		
		var x = Math.round(Math.cos(a));
		var y = Math.round(Math.sin(a));
		var d = 1/Math.sqrt(x*x+y*y);
		ary.push([x,y,d/l])
	};
	return ary;	
};

var ForceMap = function(x,y,w,h) {		
	var nbs = radialLookupTable();	
	var field = new nArray(w,h);
	var fieldBuffer = new nArray(w,h);					
	var c = 0;
	
	var updateLoopTest = Benchmark.create("Entire update loop");
	var forcePropagationTest = Benchmark.create("Force propagation loop");
	var drawLoopTest = Benchmark.create("Entire draw loop");
	
	this.getForceAt = function(x,y) {
		for (var nV = [],j = nbs.length - 1; j >= 0; j--){
			nV[j] = field.get(Math.round(x)+nbs[j][0],Math.round(y)+nbs[j][1]);
		};
		if (nbs.length == 4) {
			return [(nV[0]-nV[2]),(nV[1]-nV[3])]
		} else {
			return [(nV[0]-nV[4]+(nV[7]+nV[1]-nV[3]-nV[5])*0.5),(nV[2]-nV[6]+(nV[1]+nV[3]-nV[5]-nV[7])*0.5)]
		}
	}
		
	this.addToForce = function(x,y,force) {
	  field.add(x,y,force);
	}
	
	this.update = function(forces) {
		Benchmark.run(updateLoopTest);					
		fieldBuffer.clearAll();
		var i = forces.length;
		while (i--){
			var force = forces[i];
			//var radius = 1+Math.floor(force.force/10)
			
			// var j = nbs.length
			// 			while(j--) {
			// 				var n = nbs[j];
			// 				field.add(Math.round(force.x)+n[0],Math.round(force.y)+n[1],force.force)
			// 			}
			field.add(Math.round(force.x),Math.round(force.y),force.force)
		}		
		Benchmark.run(forcePropagationTest);				
		field.each(function(x,y,value) {
			
			if (true) { //Propagate up-hill (away from gravity sink)
				var weights = [];
				var total = 0;						
				var i = nbs.length;
				while (i--){total += weights[i] = 1+field.get(x+nbs[i][0],y+nbs[i][1])*nbs[i][2];}				
				var multiplier = 1/(total*(weights.length-1))
			}
			
			var i = nbs.length;			
			while (i--){ 
				var f = multiplier ? (total-weights[i])*multiplier : nbs[i][2];
				fieldBuffer.add(x+nbs[i][0],y+nbs[i][1],value * f * .78); 
			};
			fieldBuffer.add(x,y,value*.2);
		});		
		
		var swapper = field;
		field = fieldBuffer;
		fieldBuffer = swapper;				
		Benchmark.end(forcePropagationTest);
						
						
		if(false) {
			var i = forces.length;
			while (i--){			
				var force = forces[i];
				var fo = this.getForceAt(force.x,force.y);
				force.x += force.vx += fo[0]*0.0001;
				force.y += force.vy += fo[1]*0.0001;				
				force.x = (force.x+w)%w
				force.y = (force.y+h)%h
			}
		}					
		
		if(true) {
			var i = forces.length;
			while (i--){			
				var force = forces[i];
				force.x += force.vx += (Math.random()-0.5)*0.01;
				force.y += force.vy += (Math.random()-0.5)*0.01;				
				force.x = (force.x+w)%w
				force.y = (force.y+h)%h
			}						
		}
				
		Benchmark.end(updateLoopTest);		
	}


	
	var q = new Particle();
	q.x = 2;
	q.y = 50;
	q.vy = 0;
	q.vx = 1;
		
	
	this.debug = function(context,forces,drawField) {
		Benchmark.run(drawLoopTest);
		var f = 6
		
		if (drawField) {
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
		
		if (false) {
  		for (var i = forces.length - 1; i >= 0; i--){
  			var force = forces[i];
  			context.beginPath();
  			context.strokeStyle = 'rgba(0,0,0,0.2)';
  			context.lineWidth = 1;

  			context.arc(force.x*f,force.y*f,3+force.force*.3,0,Math.PI*2);
  			context.stroke();

  			context.closePath();
  		}		  
		}
		
		
		if (true) {
			
			var FRICTION = .995;
			var MULT = .1;
			var FORCE_CLAMP = .2;
			var VELOCITY_CLAMP = 20;
					
			var fo = this.getForceAt(q.x,q.y);
			// q.vx += fo[0]	*.5;			
			// q.vy += fo[1]	*.5;
			
			q.applyForce(fo,MULT,FORCE_CLAMP)			
			q.friction(FRICTION,VELOCITY_CLAMP);
			
			q.x += q.vx;
			q.y += q.vy;
			
			q.x += w;
			q.y += h;
							
			q.x %= w;
			q.y %= h;	
			
			
			
			//context.beginPath();
			//context.strokeStyle = '#ff00ff';
			//context.lineWidth = 1;
			//
			//context.arc(q.x*f,q.y*f,3,0,Math.PI*2);
			//context.stroke();
			//
			//context.closePath();
			
			
			var p = q.clone();		
      	
      	
      	
			context.beginPath();		
			context.strokeStyle = 'rgba(200,200,200,0.4)';
			context.lineWidth = 1;
					
			context.moveTo( p.x * f , p.y * f)
			for (var i = 50 - 1; i >= 0; i--){
      	
				fo = this.getForceAt(p.x,p.y);
				// p.vx += fo[0]	*.5;
				// p.vy += fo[1]	*.5;
				
				p.applyForce(fo,MULT,FORCE_CLAMP);				
				p.friction(FRICTION,VELOCITY_CLAMP);
				
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


