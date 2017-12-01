try {
    var pab = new PersistentArrayBuffer(128, "/home/zhangqp/PAB_test/pabfile/native", "c");
    // PersistentArrayBuffer instance cannot be directly manipulated. Instead, use TypedArray to read or write the buffer contents
    var pab_uint8 = new Uint8Array(pab);
    // Initialize the contents to be 1
    for (var i=0; i<pab_uint8.length; ++i){
        pab_uint8[i] = 1;
    }
    //flush changes to the file
    pab.msync(0, 128);    
}
catch (error){
    if (error instanceof RangeError) {  
        throw new RangeError('length out of range');
    }
}
