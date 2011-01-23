//Precalculates offset and weighting for neigbour cells.
function createRadialLookupTable(useCorners) {	
	var ary=[];
	var sa = Math.PI / (useCorners ? 4 : 2);
	var l  = Math.round(Math.PI*2/sa);
	for (var a=0; a < Math.PI*2; a += sa) {		
		var x = Math.round(Math.cos(a));
		var y = Math.round(Math.sin(a));
		var d = 1/Math.sqrt(x*x+y*y);
    ary.push([x,y,d/l]);
	};
	return ary;	
};


var GravityField = function(aRectangle,acols,arows) {	  
  var rectangle = aRectangle;	
  var cols = acols;	
  var rows = arows;	
  var nbs = createRadialLookupTable(false);	
	var field = new array2f(cols,rows);
	var fieldBuffer = new array2f(cols,rows);					
	var c = 0;
			  
  var worldToField = function(x,y) {
    var fx = Math.round((x-rectangle.x)/rectangle.w*cols);   
    var fy = Math.round((y-rectangle.y)/rectangle.h*rows);   
    if (fx < 0 || fx > cols || fy < 0 || fy > rows) return false;
    return [fx,fy];
  }
  
  //Get gravitational vector at given point.
  this.getForceAt = function(x,y) {
    fPos = worldToField(x,y);
    if (!fPos) return [0,0];    
		for (var nV = [],j = nbs.length - 1; j >= 0; j--){
			nV[j] = field.get(fPos[0]+nbs[j][0],fPos[1]+nbs[j][1]);
		};
		if (nbs.length == 4) {
			return [(nV[0]-nV[2]),(nV[1]-nV[3])]
		} else {
			return [(nV[0]-nV[4]+(nV[7]+nV[1]-nV[3]-nV[5])*0.5),(nV[2]-nV[6]+(nV[1]+nV[3]-nV[5]-nV[7])*0.5)]
		}
	}
	  
  this.update = function(fraction) {
    var forces = this.getAll();
    fieldBuffer.clearAll();
    //Add forcemass to gravityfield.
    var i = forces.length;
		while (i--){
			var force = forces[i];
			var fPos = worldToField(force.p.x,force.p.y);
			if (fPos) field.add(fPos[0],fPos[1],force.mass);	
		}
		
		//Propagate force.
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
		
  };
  
  //Debug only! Very CPU intensive.    
  this.draw = function(context) {
		var maxValue = 1;
		field.each(function(x,y,value) {
			if (value > maxValue) maxValue = value;				
		});		
		field.each(function(x,y,value) {			
      context.fillStyle = 'rgba(0,255,0,'+value/maxValue+')';
      // context.fillStyle = 'rgba(0,0,0,1)';
			context.beginPath();			
			var w = rectangle.w/cols;
			var h = rectangle.h/rows;			
			context.fillRect(rectangle.x+x*w,rectangle.y+y*h,w,h);			
			context.closePath();
		});
    
  };  
  
  
  this.applyForce = function(ary) {
    if(true) {
			var i = ary.length;
			while (i--){        	
				var p = ary[i];								
				var fo = this.getForceAt(p.p.x,p.p.y);
				p.v.x += fo[0]*0.0001;
				p.v.y += fo[1]*0.0001;				
			}						
		}		
  };
  
}.inheritsFrom(BaseAgent);
