var i = 0;
onconnect = function(e) {
    i++;
    var port = e.ports[0];
    port.postMessage('hello, ' + i);
    port.onmessage = function(e) {
        port.postMessage('pong');
    }
} 