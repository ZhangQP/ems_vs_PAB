# ems_vs_PAB

This repository compares the performance of ems (https://www.npmjs.com/package/ems) and newly designed PersistentArrayBuffer (https://github.com/how759/quicklake-js/blob/master/src/pab_doc.md).

example.js is an example of PAB.
The initial size of AB and PABs are all 80,000,000 Bytes.

1. ems
  examples: streams_bulk_sync_parallel.js, streams_withAB.js 
  run with "$ time node *** n       
  //n is the number of processes.
  
2. node with PAB
  examples: AB_opts.js, PAB_opts.js and PAB_opts_1.js
  run with "$ ./node ***"

