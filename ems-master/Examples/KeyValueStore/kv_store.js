/*-----------------------------------------------------------------------------+
 |  Extended Memory Semantics (EMS)                            Version 1.4.5   |
 |  Synthetic Semantics       http://www.synsem.com/       mogill@synsem.com   |
 +-----------------------------------------------------------------------------+
 |  Copyright (c) 2011-2014, Synthetic Semantics LLC.  All rights reserved.    |
 |  Copyright (c) 2015-2017, Jace A Mogill.  All rights reserved.              |
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
 +-----------------------------------------------------------------------------*/
'use strict';
var ems = require('ems')(1, false, 'user');
var http = require('http');
var url_module = require("url");
var cluster = require('cluster');
var port = 8080;
var shared_counters;
var persistent_data;
var myID;
var persistent_data_options = {
    dimensions: [100000],
    heapSize: [10000000],
    useExisting: false,
    useMap: true,
    filename: '/tmp/persistent_shared_web_data.ems'
};

var shared_counters_options = {
    dimensions: [100],
    heapSize: [10000],
    useExisting: false,
    useMap: true,
    filename: '/tmp/counters.ems'
};


function handleRequest(request, response) {
    var requestN = shared_counters.faa('nRequests', 1);  // Increment the count of requests
    var parsed_request = url_module.parse(request.url, true);
    var key = Object.keys(parsed_request.query)[0];
    var value = parsed_request.query[key];
    if (value === '') { value = undefined; }
    var data;
    var opname;

    if (!key) {
        response.end("ERROR: No key specified in request");
        return;
    }

    if (parsed_request.pathname.indexOf("/readFE") >= 0) {
        data = persistent_data.readFE(key);
        opname = 'readFE';
    } else if (parsed_request.pathname.indexOf("/readFF") >= 0) {
        data = persistent_data.readFF(key);
        opname = 'readFF';
    } else if (parsed_request.pathname.indexOf("/read") >= 0) {
        data = persistent_data.read(key);
        opname = 'read';
    } else if (parsed_request.pathname.indexOf("/writeXE") >= 0) {
        data = persistent_data.writeXE(key, value);
        opname = 'writeXE';
    } else if (parsed_request.pathname.indexOf("/writeXF") >= 0) {
        data = persistent_data.writeXF(key, value);
        opname = 'writeXF';
    } else if (parsed_request.pathname.indexOf("/writeEF") >= 0) {
        data = persistent_data.writeEF(key, value);
        opname = 'writeEF';
    } else if (parsed_request.pathname.indexOf("/write") >= 0) {
        data = persistent_data.write(key, value);
        opname = 'write';
    } else if (parsed_request.pathname.indexOf("/faa") >= 0) {
        data = persistent_data.faa(key, value);
        opname = 'faa';
    } else if (parsed_request.pathname.indexOf("/cas") >= 0) {
        opname = 'cas';
        var old_new_vals = value.split(',');
        if (old_new_vals[0] === '') { old_new_vals[0] = undefined; }
        if (old_new_vals[1] === '') { old_new_vals[1] = undefined; }
        data = persistent_data.cas(key, old_new_vals[0], old_new_vals[1]);
    } else {
        data = "ERROR: No EMS command specified.";
    }
    var datastr = JSON.stringify(data);
    console.log("Request #" + requestN + ", slave process " + myID + ":   Op(" +
        opname + ")  key(" + key + ")  val(" + value + ")   data=" + datastr);
    response.end(datastr);
}


if (cluster.isMaster) {
    /* The Master Process creates the EMS arrays that the slave processes
     * will attach to before creating the slave processes.  This prevents
     * parallel hazards if all slaves tried creating the EMS arrays.
     */
    persistent_data_options.setFEtags = 'empty';
    persistent_data_options.doSetFEtags = true;
    persistent_data = ems.new(persistent_data_options);

    shared_counters_options.dataFill = 0;
    shared_counters_options.doDataFill = true;
    shared_counters_options.setFEtags = 'full';
    shared_counters_options.doSetFEtags = true;
    shared_counters = ems.new(shared_counters_options);

    // Seed the GUID generator with a unique starting value
    shared_counters.writeXF('GUID', Math.floor(Math.random() * 10000000));

    // All the one-time initialization is complete, now start slave processes.
    // The number of processes is the limit of the number of pending requests
    // before deadlock occurs.
    var nProcesses = Number(process.argv[2]) || 8;  // Number of "cluster" processes to start
    for (var procnum = 0; procnum < nProcesses; procnum++) {
        cluster.fork();
    }

    console.log(
        "REST API:  <EMSCommand>?key[=value]\n" +
        "  EMSCommand:  read, readFE, readFF, writeXE, writeXF, writeEF, faa, cas\n" +
        "  key: The index into the EMS array, must be a valid JSON element\n" +
        "  value: For write commands, the value stored in EMS.\n" +
        "         For CAS, the value is the old and new values separated by a comma:\n" +
        "         /cas?key=oldval,newval\n");

    cluster.on('exit', function (worker, code, signal) {
        console.log("worker " + worker.process.pid + "died");
    });
} else {
    /* Each Slave Cluster processes must connect to the EMS array created
     * by the master process.
     */
    persistent_data_options.useExisting = true;
    persistent_data = ems.new(persistent_data_options);

    shared_counters_options.useExisting = true;
    shared_counters = ems.new(shared_counters_options);

    myID = shared_counters.faa('myID', 1);
    http.createServer(handleRequest).listen(port, function () {
        console.log("Server " + myID + " listening on: http://localhost:" + port);
    });
}
