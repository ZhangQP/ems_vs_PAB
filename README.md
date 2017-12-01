# ems_vs_PAB

This repository compares the performance of ems (https://www.npmjs.com/package/ems) and newly designed PersistentArrayBuffer (https://github.com/how759/quicklake-js/blob/master/src/pab_doc.md).

Experiments

	example.js is an example of PAB.
	Number of operations for each experiment is 20,000,000. 
	The initial size of ABs and PABs are all 80,000,000 Bytes, and the TypeArray is Uint32Array.

	1.  ems
		examples: streams_bulk_sync_parallel.js (native STREAMS example of ems) , streams_withAB.js 
		run with "$ time node *** n       
		//n is the number of processes.
  
	2.  node with PAB
		examples: AB_opts.js, PAB_opts.js and PAB_opts_1.js
		run with "$ ./node ***"

Results
	
	The experiment results are in the folder "results"
