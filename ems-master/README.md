OSX | Linux | Node 0.10-8.x, Python2/3:
[![Build Status](https://travis-ci.org/SyntheticSemantics/ems.svg?branch=master)](https://travis-ci.org/SyntheticSemantics/ems)
[![npm version](https://badge.fury.io/js/ems.svg)](https://www.npmjs.com/package/ems)
[![NPM](https://nodei.co/npm/ems.png?downloads=true&stars=true&downloadRank=true)](https://www.npmjs.org/package/ems)
[![NPM](https://nodei.co/npm-dl/ems.png?months=1&height=3)](https://www.npmjs.com/package/ems)

### [API Documentation](http://syntheticsemantics.com/EMS.js/reference.html) | [EMS Website](http://syntheticsemantics.com/EMS.js)

# Extended Memory Semantics (EMS)
__EMS makes possible persistent shared memory parallelism between Node.js, Python, and C/C++__.

Extended Memory Semantics (EMS) unifies synchronization and storage primitives
to address several challenges of parallel programming:
+ Allows any number or kind of processes to share objects
+ Manages synchronization and object coherency
+ Implements persistence to non-volatile memory and secondary storage
+ Provides dynamic load-balancing between processes
+ May substitute or complement other forms of parallelism

## [Examples: Parallel web servers, word counting](https://github.com/SyntheticSemantics/ems/tree/master/Examples) 

#### Table of Contents
* [Parallel Execution Models Supported](#Types-of-Concurrency) Fork Join, Bulk Synchronous Parallel, User defined
* [Atomic Operations](#Built-in-Atomic-Operations) Atomic Read-Modify-Write operations
* [Examples](https://github.com/SyntheticSemantics/ems/tree/master/Examples) Parallel web servers, word counting
* [Benchmarks](#Examples-and-Benchmarks) Bandwidth, Transaction processing
* [Synchronization as a Property of the Data, Not a Duty for Tasks](#Synchronization-Property) Full/Empty tags
* [Installation](#Installation) Downloading from Git or NPM
* [Roadmap](#Roadmap) The Future™! It's all already happened

#### EMS is targeted at tasks too large for one core or one process but too small for a scalable cluster

A modern multi-core server has 16-32 cores and nearly 1TB of memory,
equivalent to an entire rack of systems from a few years ago.
As a consequence, jobs formerly requiring a Map-Reduce cluster
can now be performed entirely in shared memory on a single server
without using distributed programming.

## Sharing Persistent Objects Between Python and Javascript
<img src="http://synsem.com/images/ems_js_py.gif" />

Inter-language example in [interlanguage.{js,py}](https://github.com/SyntheticSemantics/ems/tree/master/Examples/Interlanguage)
The animated GIF demonstrates the following steps:
* Start Node.js REPL, create an EMS memory
* Store "Hello"
* Open a second session, begin the Python REPL
* Connect Python to the EMS shared memory
* Show the object created by JS is present in Python
* Modify the object, and show the modification can be seen in JS
* Exit both REPLs so no programs are running to "own" the EMS memory
* Restart Python, show the memory is still present
* Initialize a counter from Python
* Demonstrate atomic Fetch and Add in JS
* Start a loop in Python incrementing the counter
* Simultaneously print and modify the value from JS
* Try to read "empty" data from Python, the process blocks
* Write the empty memory, marking it full, Python resumes execution

## Types of Concurrency
<table>
    <tr>
      <td width="50%">
EMS extends application capabilities to include transactional memory and
other fine-grained synchronization capabilities.
<br><br>
EMS implements several different parallel execution models:
<ul>
<li> <B>Fork-Join Multiprocess</B>: execution begins with a single process that creates new processes
  when needed, those processes then wait for each other to complete.

<li> <B>Bulk Synchronous Parallel</B>: execution begins with each process starting the program at the
  <code>main</code> entry point and executing all the statements

<li> <B>User Defined</B>: parallelism may include ad-hoc processes and mixed-language applications
</ul>
		</td>
        <td width="50%">
        <center>
    		  <img height="350px" style="margin: 10px;" src="http://synsem.com/images/ems/typesOfParallelism.svg" type="image/svg+xml"  />
            </center>
            </td>
    </tr>
    <tr>
    <td width="50%">
        <center>
    		  <img height="350px" style="margin: 10px;" src="http://synsem.com/images/ems/ParallelContextsBSP.svg" type="image/svg+xml" />
        </center>
    </td>
    <td>
        <center>
    		  <img height="350px" style="margin: 10px;" src="http://synsem.com/images/ems/ParallelContextsFJ.svg" type="image/svg+xml" />
        </center>
    </td>
    </tr>
</table>


## Built-in Atomic Operations
EMS operations may performed using any JSON data type, read-modify-write operations
may use any combination of JSON data types.
like operations on ordinary data.

Atomic read-modify-write operations are available
in all concurrency modes, however collectives are not 
available in user defined modes.

- __Atomic Operations__: 
	Read, write, readers-writer lock, read when full and atomically mark empty, write when empty and atomically mark full

- __Primitives__:
	Stacks, queues, transactions

- __Read-Modify-Write__:
	Fetch-and-Add, Compare and Swap

- __Collective Operations__:
	All basic [OpenMP](https://en.wikipedia.org/wiki/OpenMP)
    collective operations are implemented in EMS:
    dynamic, block, guided, as are the full complement of static loop scheduling, 
    barriers, master and single execution regions

## Examples and Benchmarks

### Word Counting Using Atomic Operations
[Word counting example](https://github.com/SyntheticSemantics/ems/tree/master/Examples)

Map-Reduce is often demonstrated using word counting because each document can
be processed in parallel, and the results of each document's dictionary reduced
into a single dictionary.  This EMS implementation also
iterates over documents in parallel, but it maintains a single shared dictionary
across processes, atomically incrementing the count of each word found.
The final word counts are sorted and the most frequently appearing words
are printed with their counts.

<img height="300px" src="http://synsem.com/images/ems/wordcount.svg" />

The performance of this program was measured using an Amazon EC2 instance:<br>
`c4.8xlarge (132 ECUs, 36 vCPUs, 2.9 GHz, Intel Xeon E5-2666v3, 60 GiB memory`
The leveling of scaling aroung 16 cores despite the presence of ample work
may be related to the use of non-dedicated hardware:
Half of the 36 vCPUs are presumably HyperThreads or otherwise shared resoruce.
AWS instances are also bandwidth limited to EBS storage, where our Gutenberg
corpus is stored.

### Bandwidth Benchmarking
[STREAMS Example](https://github.com/SyntheticSemantics/ems/tree/master/Examples/STREAMS)

A benchmark similar to [STREAMS](https://www.cs.virginia.edu/stream/)
gives us the maximum speed EMS double precision
floating point operations can be performed on a
`c4.8xlarge (132 ECUs, 36 vCPUs, 2.9 GHz, Intel Xeon E5-2666v3, 60 GiB memory`.

<img src="http://synsem.com/images/ems/streams.svg" type="image/svg+xml" height="300px">


### Benchmarking of Transactions and Work Queues
[Transactions and Work Queues Example](https://github.com/SyntheticSemantics/ems/tree/master/Examples)

Transactional performance is measured alone, and again with a separate
process appending new processes as work is removed from the queue.
The experiments were run using an Amazon EC2 instance:<br>
<code>c4.8xlarge (132 ECUs, 36 vCPUs, 2.9 GHz, Intel Xeon E5-2666v3, 60 GiB memory</code>

#### Experiment Design
Six EMS arrays are created, each holding 1,000,000 numbers.  During the
benchmark, 1,000,000 transactions are performed, each transaction involves 1-5
randomly selected elements of randomly selected EMS arrays.
The transaction reads all the elements and
performs a read-modify-write operation involving at least 80% of the elements.
After all the transactions are complete, the array elements are checked
to confirm all the operations have occurred.

The parallel process scheduling model used is *block dynamic* (the default),
where each process is responsible for successively smaller blocks
of iterations.  The execution model is *bulk synchronous parallel*, each
processes enters the program at the same main entry point
and executes all the statements in the program.
`forEach` loops have their normal semantics of performing all iterations,
`parForEach` loops are distributed across threads, each process executing
only a portion of the total iteration space.


<table width=100%>
	<tr>
    	<td width="50%">
	    <center>
			<img style="vertical-align:text-top;" src="http://synsem.com/images/ems/tm_no_q.svg" />
            <br><b>Immediate Transactions:</b> Each process generates a transaction on integer data then immediately performs it.
    	</center>
	    </td>
    	<td width="50%">
	    <center>
			<img style="vertical-align:text-top;" src="http://synsem.com/images/ems/tm_from_q.svg" />
            <br><b>Transactions from a Queue:</b> One of the processes generates the individual transactions and appends
				them to a work queue the other threads get work from.  
                <B>Note:</b> As the number of processes increases, the process generating the transactions
		    	and appending them to the work queue is starved out by processes performing transactions,
                naturally maximizing the data access rate.
	    </center>
	    </td>
    </tr>
	<tr>
    	<td width="50%">
	    <center>
			<img style="vertical-align:text-top;" src="http://synsem.com/images/ems/tm_no_q_str.svg"/>
            <br><b>Immediate Transactions on Strings:</b> Each process generates a transaction appending to
			a string, and then immediately performs the transaction.
    	</center>
	    </td>
    	<td width="50%">
        <center>
        <b>Measurements</b>
        </center><br>
        <b>Elem. Ref'd:</b> Total number of elements read and/or written
		<br>
        <b>Table Updates:</b> Number of different EMS arrays (tables) written to
		<br>
        <b>Trans. Performed:</b> Number of transactions performed across all EMS arrays (tables)
		<br>
        <b>Trans. Enqueued:</b> Rate transactions are added to the work queue (only 1 generator thread in these experiments)
	    </td>
    </tr>
</table>



## [Synchronization as a Property of the Data, Not a Duty for Tasks](#Synchronization-Property)

EMS internally stores tags that are used for synchronization of
user data, allowing synchronization to happen independently of
the number or kind of processes accessing the data.  The tags
can be thought of as being in one of three states, _Empty,
Full,_ or _Read-Only_, and the EMS intrinsic functions
enforce atomic access through automatic state transitions.

The EMS array may be indexed directly using an integer, or using a key-index
mapping from any primitive type.  When a map is used, the key and data
itself are updated atomically.

<table >
    <tr>
      <td>
    <center>
      <img style="width:350px; "
	   src="http://synsem.com/EMS.js/memLayoutLogical.svg" type="image/svg+xml" />
      <em>    <br><br> 
    EMS memory is an array of JSON values
        (Number, Boolean, String, Undefined, or Object) accessed using atomic
        operators and/or transactional memory.  Safe parallel access
        is managed by passing through multiple gates: First mapping a
        key to an index, then accessing user data protected by EMS
        tags, and completing the whole operation atomically.
      </center>
    </em>
    </td>
    <td width="50%">
      <center>
  <img style="height:270px; "
   src="http://synsem.com/EMS.js/fsmSimple.svg" type="image/svg+xml" />
    <em>    <br><br> EMS Data Tag Transitions & Atomic operations:
    F=Full, E=Empty, X=Don't Care, RW=Readers-Writer lock (# of current readers)
    CAS=Compare-and-Swap, FAA=Fetch-and-Add</em>
      </center>
    </td>
    </tr>
</table>


## More Technical Information

For a more complete description of the principles of operation,
[visit the EMS web site.](http://synsem.com/EMS.js/)

[ Complete API reference ](http://synsem.com/EMS.js/reference.html)
  
<br>
<center>
  <img src="http://synsem.com/EMS.js/blockDiagram.svg" type="image/svg+xml" height="300px" style="vertical-align:text-top;"/>
</center>


## Installation

Because all systems are already multicore, 
parallel programs require no additional equipment, system permissions,
or application services, making it easy to get started.
The reduced complexity of
lightweight threads communicating through shared memory
is reflected in a rapid code-debug cycle for ad-hoc application development.

### Quick Start with the Makefile
To build and test all C, Python 2 and 3, and Node.js targets,
a makefile can automate most build and test tasks.

```sh
dunlin> make help
         Extended Memory Semantics  --  Build Targets
===========================================================
    all                       Build all targets, run all tests
    node                      Build only Node.js
    py                        Build both Python 2 and 3

    py[2|3]                   Build only Python2 or 3
    test                      Run both Node.js and Py tests
    test[_js|_py|_py2|_py3]   Run only Node.js, or only Py tests, respectively
    clean                     Remove all files that can be regenerated
    clean[_js|_py|_py2|_py3]  Remove Node.js or Py files that can be regenerated
```


### Install via npm
EMS is available as a NPM Package.  EMS depends on several other NPM packages
to compile the native addon:
the Foreign Function Interface (ffi), C-to-V8 symbol renaming (bindings),
and the native addon abstraction layer (nan).
                                                   
```sh
npm install ems
```

### Install via GitHub
Download the source code, then compile the native code:

```sh
git clone https://github.com/SyntheticSemantics/ems.git
cd ems
npm install
```


### Installing for Python
Python users should download and install EMS git (see above).
There is no PIP package, but not due lack of desire or effort.
A pull request is most welcome!


### Run Some Examples

Click here for __[Detailed Examples](https://github.com/SyntheticSemantics/ems/tree/master/Examples)__.

On a Mac and most Linux 
distributions EMS will "just work", but
some Linux distributions restrict access to shared memory.  The
quick workaround is to run jobs as root, a long-term solution will
vary with Linux distribution.


Run the work queue driven transaction processing example on 8 processes:
```sh
npm run <example>
```

Or manually via:
```sh
cd Examples
node concurrent_Q_and_TM.js 8
```

Running all the tests with 8 processes:
```sh
npm run test      # Alternatively: npm test
```

```sh
cd Tests
rm -f EMSthreadStub.js   # Do not run the machine generated script used by EMS
for test in `ls *js`; do node $test 8; done
```

## Platforms Supported
As of 2016-05-01, Mac/Darwin and Linux are supported.  A windows port pull request is welcomed!


## Roadmap
EMS 1.0 uses Nan for long-term Node.js support, we continue to
develop on OSX and Linux via Vagrant.

EMS 1.3 introduces a C API.

EMS 1.4 Python API

EMS 1.4.8 Improved examples and documentation

EMS 1.5 **[This Release]** Refactored JS-EMS object conversion temporary storage 

EMS 1.6 **[Planned]** Key deletion that frees all resources.  Replace open hashing with chaining.

EMS 1.6 **[Planned]** Memory allocator improvements (non-power 2 sizes, packed metadata, extensible heap),
    low-level EMS diagnostic tools.

EMS 1.7 **[Planned]** Support for NVDIMMs and other technologies that behave
     as [persistent main system memory](http://pmem.io/).

EMS 2.0 **[Planned]** New API which more tightly integrates with 
ES6, Python, and other dynamically typed languages languages,
making atomic operations on persistent memory more transparent.

## License
BSD, other commercial and open source licenses are available.

## Links
[Visit the EMS web site](http://synsem.com/EMS.js/)

[Download the NPM](https://www.npmjs.org/package/ems)

[Get the source at GitHub](https://github.com/SyntheticSemantics/ems)

## About
Jace A Mogill specializes in resource constrained computing at both the largest and smallest scales.  
He has over 20 years experience optimizing software for distributed, multi-core, and 
FPGA/GPU/CPU hybrid computer architectures.

###### Copyright (C)2017 Jace A Mogill
