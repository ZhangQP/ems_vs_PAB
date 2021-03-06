# ems_vs_PAB

This repository compares the performance of [ems](https://www.npmjs.com/package/ems) and newly designed [PersistentArrayBuffer](https://github.com/how759/quicklake-js/blob/master/src/pab_doc.md).

The folder "ems_master" is the raw code and tests of ems copied from  [ems](https://github.com/SyntheticSemantics/ems).

## Experiments

### Size:
  Number of operations for each experiment is 20,000,000. <br>
  The initial size of ABs and PABs are all 80,000,000 Bytes, and the TypeArray is Uint32Array.
	
### Disks:
  There are five different disks: HDD, SSD, [emu_pmem](http://pmem.io/2016/02/22/pm-emulation.html), ramdisk and Optane.

### Content:
1. ems <br>
 Examples: streams_bulk_sync_parallel.js (native STREAMS example of ems) <br>
 Run with "$ time node (testfile_path) n"  <br> 
 //n is the number of processes <br>  

2. node with PAB <br>
Examples: AB_opts.js, PAB_opts.js and PAB_opts_nomsync.js <br>
Difference between PAB_opts.js and PAB_opts_nomsync.js lies on whether the msync() of PAB write is counted in the time. <br>
A compiled node version which supports PAB is in the folder "node". You can use it directly or install first. <br>
Run with "$ /node/Release/node (testfile_path)" <br> 

## Results
The experiment results are in the excel file "results.xlsx".
