// 创建一个共享线程用于接收从不同连接发送过来的指令，指令处理完成后将结果返回到各个不同的连接用户。

/*

 * define a connect count to trace connecting

 * this variable will be shared within all connections

 */

var connect_number = 0;

onconnect = function(e) {

    connect_number =connect_number+ 1;

    //get the first port here

    var port = e.ports[0];

    port.postMessage('A new connection! The current connection number is '

        + connect_number);

    port.onmessage = function(e) {

        //get instructions from requester

        var instruction=e.data.instruction;

        var results=execute_instruction(instruction);

        port.postMessage('Request: '+instruction+' Response '+results

            +' from shared worker...');

    };

};

/*

 * this function will be used to execute the instructions send from requester

 * @param instruction

 * @return

 */

function execute_instruction(instruction)

{

    var result_value;

    //implement your logic here

    //execute the instruction...

   // return result_value
    return instruction + "123";

}