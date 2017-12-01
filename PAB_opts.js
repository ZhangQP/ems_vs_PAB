var arrLen = 10000000;
pab_x = new PersistentArrayBuffer(arrLen * 8, "/home/zhangqp/PAB_test/pabfile/pab_x", "c");
pab_y = new PersistentArrayBuffer(arrLen * 8, "/home/zhangqp/PAB_test/pabfile/pab_y", "c");
pab_z = new PersistentArrayBuffer(arrLen * 8, "/home/zhangqp/PAB_test/pabfile/pab_z", "c")
var x = new Uint8Array(pab_x);
var y = new Uint8Array(pab_y);
var z = new Uint8Array(pab_z);

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
pab_x.msync(0, arrLen * 8);
stopTimer(timeStart, arrLen, " write   ");

timeStart = new Date().getTime();
for(idx = 0;  idx < arrLen;  idx++ ) {  x[idx] += idx }
pab_x.msync(0, arrLen * 8);
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
pab_y.msync(0, arrLen * 8);
stopTimer(timeStart, arrLen, " copy    ");

timeStart = new Date().getTime();
for(idx = 0;  idx < arrLen;  idx++ ) { y[idx] += x[idx] }
pab_y.msync(0, arrLen * 8);
stopTimer(timeStart, arrLen, " rmwcopy ");

timeStart = new Date().getTime();
for(idx = 0;  idx < arrLen;  idx++ ) { z[idx] = x[idx] * y[idx] }
pab_z.msync(0, arrLen * 8);
stopTimer(timeStart, arrLen, " c=a*b   ");

timeStart = new Date().getTime();
for(idx = 0;  idx < arrLen;  idx++ ) { z[idx] += x[idx] * y[idx] }
pab_z.msync(0, arrLen * 8);
stopTimer(timeStart, arrLen, " c+=a*b  ");

timeStart = new Date().getTime();
stopTimer(timeStart, arrLen, " sum ");
