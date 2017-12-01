//  Also see the Fork-Join version in the Examples directory
// ===============================================================================
var ems = require('ems')(parseInt(process.argv[2]), false);
var arrLen = 10000000;
var a = ems.new(arrLen);
var b = ems.new(arrLen);
var c = ems.new(arrLen);
var x = new Uint8Array(new ArrayBuffer(arrLen*8));
var y = new Uint8Array(new ArrayBuffer(arrLen*8));
var z = new Uint8Array(new ArrayBuffer(arrLen*8));

//-------------------------------------------------------------------
//  Timer function
function stopTimer(timer, nOps, label) {
    function fmtNumber(n) {
        var s = '                       ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(n < 1) return n;
        else    { return s.substr(s.length - 15, s.length); }
    }
    ems.master( function() {
        var now = new Date().getTime();
        var x = (nOps*1000000) / ((now - timer) *1000);
        ems.diag(fmtNumber(nOps) + label + fmtNumber(Math.floor(x).toString()) + " ops/sec");
    } );
}


var timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.write(idx, idx) } );
stopTimer(timeStart, arrLen, " write   ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.writeXE(idx, idx) } );
stopTimer(timeStart, arrLen, " writeXE ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.writeXF(idx, idx) } );
stopTimer(timeStart, arrLen, " writeXF ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.read(idx, idx) } );
stopTimer(timeStart, arrLen, " read    ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.read(idx, idx) } );
stopTimer(timeStart, arrLen, " reread  ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.readFF(idx, idx) } );
stopTimer(timeStart, arrLen, " readFF  ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.readFE(idx, idx) } );
stopTimer(timeStart, arrLen, " readFE  ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { a.writeEF(idx, idx) } );
stopTimer(timeStart, arrLen, " writeEF ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { b.writeXF(idx, a.readFF(idx)) } );
stopTimer(timeStart, arrLen, " copy    ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { b.writeXF(idx, a.readFF(idx)) } );
stopTimer(timeStart, arrLen, " recopy  ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { c.writeXF(idx, a.readFF(idx) * b.readFF(idx)) } );
stopTimer(timeStart, arrLen, " c=a*b   ");

timeStart = new Date().getTime();
ems.parForEach(0, arrLen, function(idx) { c.writeXF(idx, c.readFF(idx) + (a.readFF(idx) * b.readFF(idx))) } );
stopTimer(timeStart, arrLen, " c+=a*b  ");

timeStart = new Date().getTime();
stopTimer(timeStart, arrLen, " checksum ");


//===========================================================================================
var idx;

if(ems.myID == 0) {
    console.log('------------------------ START ARRAYBUFFER');
    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) {  x[idx] = idx }
    stopTimer(timeStart, arrLen, " write   ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) {  x[idx] += idx }
    stopTimer(timeStart, arrLen, " rd/write");

    timeStart = new Date().getTime();
    var dummy = 0;
    for(idx = 0;  idx < arrLen;  idx++ ) { dummy += x[idx] }
    stopTimer(timeStart, arrLen, " read    ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) { dummy += x[idx] }
    stopTimer(timeStart, arrLen, " reread  ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) { y[idx] = x[idx] }
    stopTimer(timeStart, arrLen, " copy    ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) { y[idx] += x[idx] }
    stopTimer(timeStart, arrLen, " rmwcopy ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) { z[idx] = x[idx] * y[idx] }
    stopTimer(timeStart, arrLen, " c=a*b   ");

    timeStart = new Date().getTime();
    for(idx = 0;  idx < arrLen;  idx++ ) { z[idx] += x[idx] * y[idx] }
    stopTimer(timeStart, arrLen, " c+=a*b  ");

    timeStart = new Date().getTime();
    stopTimer(timeStart, arrLen, " sum ");
}

