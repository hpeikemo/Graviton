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
	
	
};
