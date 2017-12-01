var arrLen = 20000000;
var x = new Uint32Array(new ArrayBuffer(arrLen*4));
var y = new Uint32Array(new ArrayBuffer(arrLen*4));
var z = new Uint32Array(new ArrayBuffer(arrLen*4));

function stopTimer(timer, nOps, label) {
    function fmtNumber(n) {
        var s = '                       ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(n < 1) return n;
        else    { return s.substr(s.length - 15, s.length); }
    }
       
    var now = new Date().getTime();
    var x = (nOps*1000000) / ((now - timer) *1000);
    console.log(fmtNumber(nOps) + label + fmtNumber(Math.floor(x).toString()) + " ops/sec");

}

var idx;

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
