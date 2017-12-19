/*-----------------------------------------------------------------------------+
 |  Extended Memory Semantics (EMS)                            Version 1.0.0   |
 |  Synthetic Semantics       http://www.synsem.com/       mogill@synsem.com   |
 +-----------------------------------------------------------------------------+
 |  Copyright (c) 2011-2014, Synthetic Semantics LLC.  All rights reserved.    |
 |  Copyright (c) 2015-2016, Jace A Mogill.  All rights reserved.              |
 |                                                                             |
 | Redistribution and use in source and binary forms, with or without          |
 | modification, are permitted provided that the following conditions are met: |
 |    * Redistributions of source code must retain the above copyright         |
 |      notice, this list of conditions and the following disclaimer.          |
 |    * Redistributions in binary form must reproduce the above copyright      |
 |      notice, this list of conditions and the following disclaimer in the    |
 |      documentation and/or other materials provided with the distribution.   |
 |    * Neither the name of the Synthetic Semantics nor the names of its       |
 |      contributors may be used to endorse or promote products derived        |
 |      from this software without specific prior written permission.          |
 |                                                                             |
 |    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS      |
 |    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT        |
 |    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR    |
 |    A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL SYNTHETIC         |
 |    SEMANTICS LLC BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,   |
 |    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,      |
 |    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR       |
 |    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF   |
 |    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING     |
 |    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS       |
 |    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.             |
 |                                                                             |
 +-----------------------------------------------------------------------------+
 |  Program Description:                                                       |
 |                                                                             |
 |  Enqueue the transactions from a parallel loop.                             |
 |  When all the operations have been queued they all begin                    |
 |  processing transactions.                                                   |
 |                                                                             |
 |  Unlike the concurrent_Q_and_TM.js example, randomInRange() is called       |
 |  from every thread, so it is declared from every thread.                    |
 |                                                                             |
 +-----------------------------------------------------------------------------*/
'use strict';
var ems = require('ems')(parseInt(process.argv[2]), true, 'fj');
var assert = require('assert');
var workQ;
var totalNops;
var checkNops;
var arrLen;
var heapSize;
var nTransactions;
var nTables;
var maxNops;
var tables;

//-------------------------------------------------------------------
//  Timer functions
function timerStart() {
    return new Date().getTime();
}

function timerStop(timer, nOps, label, myID) {
    function fmtNumber(n) {
        var s = '                       ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (n < 1) return n;
        else {
            return s.substr(s.length - 15, s.length);
        }
    }

    var now = new Date().getTime();
    var opsPerSec = (nOps * 1000000) / ((now - timer) * 1000);
    if (typeof myID === undefined || myID === 0) {
        console.log(fmtNumber(nOps) + label + fmtNumber(Math.floor(opsPerSec).toString()) + " ops/sec");
    }
}


//---------------------------------------------------------------------------
//  Initialize shared data: global scalars, EMS buffers for statistics
//  and checksums, an EMS array to be used as a work queue, and many
//  tables to perform transactions on.
//
function initializeSharedData() {
    arrLen = 1000000;         // Maximum number of elements the EMS array can contain
    heapSize = 100000;        // Amount of persistent memory to reserve for transactions
    nTransactions = 1000000;  // Number of transactions to perform in the experiment
    nTables = 6;              // Number of EMS arrays to perform transactions across
    maxNops = 5;              // Maximum number of EMS arrays to update during a transaction
    tables = [];
    totalNops = ems.new(2);
    checkNops = ems.new(1);

    //---------------------------------------------------------------------------
    //  The queue of transactions to perform
    //     [ table#, index, read-only ]
    workQ = ems.new({
        dimensions: [nTransactions + ems.nThreads],
        heapSize: nTransactions * 200,
        useExisting: false,
        dataFill: 0,
        doDataFill: true,
        setFEtags: 'empty'
    });


    //---------------------------------------------------------------------------
    //  Create all the tables
    for (var tableN = 0; tableN < nTables; tableN++) {
        tables[tableN] = ems.new({
            dimensions: [arrLen],
            heapSize: 0,
            useExisting: false,
            filename: '/tmp/EMS_tm' + tableN,
            dataFill: 0,
            doDataFill: true,
            setFEtags: 'full'
        });
    }
}


//---------------------------------------------------------------------------
//  Create 'nTransactions' many transactions, each having a random number (up
//  to maxNops) randomly chosen values, some of which are read-only.
//  Because tables and elements are chosen at random, it is necessary to
//  remove duplicate elements in a single transaction, to prevent deadlocks.
//
//  Transactions are pushed onto a shared queue
function generateTransactions() {
    //---------------------------------------------------------------------------
    //  Generate a random integer within a range (inclusive) from 'low' to 'high'
    var randomInRange = function (low, high) {
        return ( Math.floor((Math.random() * (high - low)) + low) );
    };

    //---------------------------------------------------------------------------
    // Generate operations involving random elements in random EMS arrays
    // and enqueue them on the work queue
    ems.parForEach(0, nTransactions, function (transN) {
        var ops = [];
        var nOps = randomInRange(1, maxNops);
        for (var opN = 0; opN < nOps; opN++) {
            var tableN = randomInRange(0, nTables);
            var idx = randomInRange(0, arrLen);
            if (transN % 2 == 0 || opN % 3 > 0) {
                ops.push([tableN, idx, true]);
            }
            else {
                ops.push([tableN, idx]);
            }
        }

        // De-duplicate operations in a transaction which would deadlock
        var indicies = [];
        var uids = [];
        for (var i = 0; i < ops.length; ++i) {
            indicies[i] = i;
            uids[i] = (ops[i][0] * 1000000000000) + ops[i][1];
        }
        var uniq = [];
        for (opN = 0; opN < ops.length; opN++) {
            var isDupl = false;
            for (var checkN = 0; checkN < ops.length; checkN++) {
                if (opN != checkN && uids[opN] == uids[checkN]) {
                    isDupl = true;
                    break;
                }
            }
            if (!isDupl) {
                uniq.push(ops[opN]);
            }
        }
        workQ.enqueue(uniq);
    });

    //  After all the work has been enqueued, add DONE semaphores to the
    //  end of the queue so they are processed only after all the work
    //  has been issued.  Each thread enqueues one event and can only
    //  consume one before exiting.
    workQ.enqueue("DONE")
}


//------------------------------------------------------------------
//  Consume transactions.  If there is nothing on the queue,
//  keep checking until the "DONE" message is dequeued.
//
function performTransactions() {
    var rwNops = 0;
    var readNops = 0;

    while (true) {
        var ops = workQ.dequeue();
        if (ops !== undefined) {
            if (ops === "DONE") {
                break;
            } else {
                for (var opN = 0; opN < ops.length; opN++) {
                    ops[opN][0] = tables[ops[opN][0]];
                }
                var transaction = ems.tmStart(ops);
                ops.forEach(function (op) {
                    var tmp = op[0].read(op[1]);
                    if (op[2] != true) {
                        rwNops++;
                        op[0].write(op[1], tmp + 1);
                    } else {
                        readNops++;
                    }
                });
                ems.tmEnd(transaction, true);
            }
        }
    }
    totalNops.faa(0, rwNops);
    totalNops.faa(1, readNops);
}


//------------------------------------------------------------------------
//  Main program entry point
//
ems.parallel(initializeSharedData);
totalNops.writeXF(0, 0);
totalNops.writeXF(1, 0);
checkNops.writeXF(0, 0);

//  Enqueue all the transaction
var startTime = timerStart();
ems.parallel(generateTransactions);
timerStop(startTime, nTransactions, " transactions enqueued ", ems.myID);

//  Perform all the transactions
startTime = timerStart();
ems.parallel(performTransactions);
timerStop(startTime, nTransactions, " transactions performed", ems.myID);
timerStop(startTime, totalNops.readFF(0), " table updates         ", ems.myID);
timerStop(startTime, totalNops.readFF(0) + totalNops.readFF(1), " elements referenced   ", ems.myID);

//  Validate the results by summing all the updates
startTime = timerStart();
ems.parallel(function () {
    ems.parForEach(0, nTables, function (tableN) {
        var localSum = 0;
        for (var idx = 0; idx < arrLen; idx++) {
            localSum += tables[tableN].read(idx);
        }
        checkNops.faa(0, localSum)
    })
});
timerStop(startTime, nTables * arrLen, " elements checked      ", ems.myID);

assert(checkNops.readFF(0) === totalNops.readFF(0),
    "Error in final sum = " + checkNops.readFF(0) + "   should be=" + totalNops.readFF(0));

console.log("Success: Got correct final sum = " + checkNops.readFF(0));

//  No more work coming -- Exit on all processes
ems.parallel(function () { process.exit(0); });
