
var Benchmark = new function() {
	
	var BenchmarkLocale = {
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
	
	//time() might be relevant for loops, but unimplemented for now:
	//this.time = function(id) {
	//	var test = getById(id);
	//	if (test.isRunning) {
	//		test.end()
	//		test.run()
	//	} else {
	//		test.run()
	//	}
	//}
	
	this.reset = function(id) {
		getById(id).reset()
	}	
	this.report = function(id) {
		var test = getById(id);
		var avg = Math.ceil(test.averageResult() * 10000)/10000
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

	
}();