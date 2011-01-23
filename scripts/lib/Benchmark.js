// js-benchmark by Hans Petter Eikemo.
// http://github.com/hpeikemo/js-benchmark

var Benchmark = new function() {
	
	var BenchmarkLocale = {
		FRACTIONAL_INSERT_ERR : 	"Benchmark: Insert milliseconds, not seconds.",
		INSERT_WHILE_RUNNING_ERR : 	"Benchmark: Should not use insert while running.",
		RUN_WHILE_RUNNING_ERR : 	"Benchmark: test already running.",
		END_WITHOUT_RUNNING_ERR: 	"Benchmark: Cannot end test when not running.",
		NO_TEST_WITH_ID: 			 	"Benchmark: Trying to access non existing test."
	}
	
	var counter = 0;
	var tests = {};

	var benchmark = function(aDescription) {
		this.description = aDescription;
		
		var sum;
		var basis;
		var lastResult;
		var currentTime;
		
		this.run = function() {
			if (currentTime) throw new Error(BenchmarkLocale.RUN_WHILE_RUNNING_ERR);							
			currentTime = new Date().getTime();
		}
				
		this.end = function() {
			if (!currentTime) throw new Error(BenchmarkLocale.END_WITHOUT_RUNNING_ERR);			
			sum += lastResult = ( new Date().getTime()-currentTime );
			basis++;
			currentTime = null;
		}
		
		this.insertResult = function(value) {
			if (value < 1 && value > 0) throw new Error(BenchmarkLocale.FRACTIONAL_INSERT_ERR);			
			if (currentTime) throw new Error(BenchmarkLocale.INSERT_WHILE_RUNNING_ERR);			
			sum += value;
			basis++;
		}		
		
		this.isRunning = function() {
			return currentTime == null
		}
		
		this.reset = function() {
			currentTime = null;
			sum = 0;
			basis = 0;			
		}
		
		this.basis = function() {
			return basis;
		}
		
		this.lastResult = function() {
			return lastResult;
		}
				
		this.averageResult = function() {			
			return basis > 0 ? sum/basis : 0;
		}
		
		this.reset();				
	}
	
	var output = function(str) {
		
		console.log(str)
		
	}
	
	var getById = function(id) {
		var test = tests[id];
		if (!test) throw new Error(BenchmarkLocale.NO_TEST_WITH_ID);
		return test;		
	}
	
	this.create = function(description) {		
		var test = new benchmark(description);
		var id = ++counter;
		tests[id] = test;
		return id;
	}
	
	this.run = function(id) {
		getById(id).run()
	}
	this.end = function(id) {
		getById(id).end()
	}
	this.insert = function(id,value) {
		getById(id).insertResult(value)
	}	
	
	this.reset = function(id) {
		getById(id).reset()
	}	
	this.report = function(id) {
		var test = getById(id);
		var avg = Math.ceil(test.averageResult() * 1000000)/1000000
		output("AVG: "+ avg +"  ("+test.basis()+") '"+test.description+"'");
		
	}
	
	this.reportAndResetAll = function() {
		
		output("--- BENCHMARK REPORT ---")		
		for (id in tests) {
			this.report(id);
			this.reset(id);
		}
		output("------------------------")
		
	}
	
	this.doOnce = function(description,callback) {
		var id = this.create(description);
		var test = getById(id);
		test.run();
		callback();
		test.end(id);
		return id;
	}
	
	this.doRepeated = function(description,i,callback) {
		var id = this.create(description);
		var test = getById(id);
		while	(i--) {
			test.run();
			callback();
			test.end(id);			
		}
		return id;
	}

	
}();
