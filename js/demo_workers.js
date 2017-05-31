var i=0;

onmessage=function(e) {
/*
 var data = e.data;
 if(data == 'init')
    init();
 else
 */
    timedCount(e.data);
 }

 function timedCount(e){
     postMessage(e);
     i= e+1;
     setTimeout("timedCount(i)",500);
 }