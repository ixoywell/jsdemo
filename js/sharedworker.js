// 创建一个共享线程用于接收从不同连接发送过来的指令，指令处理完成后将结果返回到各个不同的连接用户。

onconnect = function(e) {
    var port = e.ports[0];
    var data = e.data;
    port.onmessage = function(e) {
        port.postMessage(e.data+"123");
    }
}