var UTIL = require("util");
var HTTP = require("http");
var HTTPS = require("https");
var URL = require("url");
var HTMLPARSER = require("htmlparser2");
var FORMDATA = require("form-data");
 
var username = "";
var password = "";
 
var get_login = function(url, cb){
    var url_obj = URL.parse(url);
    var __http = url_obj.protocol === "https:" ? HTTPS : HTTP;
    __http.get(url, function(res){
        res.setEncoding("utf8");
        var res_body = "";
        res.on("data", function(chunk) {
            res_body += chunk;
        });
        res.on("end", function() {
            var cook = res.headers["set-cookie"];
            var cookie_obj = {
                "wud": cook[0].split("; ")[0].split("=")[1],
                "new_wud": cook[1].split("; ")[0].split("=")[1],
                "cookie2": cook[4].split("; ")[0].split("=")[1],
                "t": cook[5].split("; ")[0].split("=")[1],
                "_tb_token_": cook[6].split("; ")[0].split("=")[1]
            };
            cb(null, cookie_obj, res_body);
        });
        res.on("error", function(err2){
            cb(err2);
        });
    });
};
 
var login_post = function(attr, cookie, cb){
    // 表单
    var form = new FORMDATA();
    for(var ele in attr){
        form.append(ele, attr[ele]);
    }
    form.append("TPL_username", username);
    form.append("TPL_password", password);
    form.append("ssottid", "");
    var options = {
        hostname: 'login.m.taobao.com',
        path: '/login.htm?_input_charset=utf-8&sid=' + attr.sid,
        method: 'POST',
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Cookie": UTIL.format("t=%s; wud=%s; new_wud=%s; v=0; cookie2=%s; _tb_token_=%s; SLnewses=1",
                cookie["t"], cookie["wud"], cookie["new_wud"], cookie["cookie2"], cookie["_tb_token_"]),
            "Host": "login.m.taobao.com",
            "Referer": "http://login.m.taobao.com/login.htm",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0"
        }
    };
    console.log("COOKIE_STRING:", options.headers.Cookie);
    // 发送带表单请求
    form.submit(options, function(err, res){
        if(err){
            cb(err);
        }else{
            var headers = JSON.stringify(res.headers);
            console.log('STATUS2: ' + res.statusCode);
            console.log('HEADERS2: ' + headers);
            cb(null, headers);
            res.setEncoding("utf8");
            var res_body = "";
            res.on("data", function(chunk) {
                res_body += chunk;
            });
            res.on("end", function(){
                console.log('DATA2: ' + res_body);
            });
            res.on("error", function(err2){
                console.error(err.message);
                cb(err2);
            });
        }
    });
};
 
 
get_login("http://login.m.taobao.com/login.htm", function(err, cookie_obj, body){
    if(err){
        console.error(err.message);
    }else{
        console.log("COOKIE: ", cookie_obj);
        var attr = {};
        var lis = ["_tb_token_", "action", "event_submit_do_login", "TPL_redirect_url", "sid", "_umid_token"];
        var parser = new HTMLPARSER.Parser({
            onopentag: function(name, attribs){
                if(name === "input" && attribs.type === "hidden"){
                    for(var ele in lis){
                        if(attribs.name === lis[ele]){
                            attr[attribs.name] = attribs.value;
                            break;
                        }
                    }
                }
            },
            onend: function(){
                console.log("FORM_DATA: ", attr);
                login_post(attr, cookie_obj, function(err, headers){
                    if(err){
                        console.log("login_post error.", err.message);
                        return;
                    }
                    var headers = JSON.parse(headers);
                    HTTP.get(headers.location, function (res) {
                        res.setEncoding("utf8");
                        var res_body = "";
                        res.on("data", function(chunk) {
                            res_body += chunk;
                        });
                        res.on("end", function(){
                            console.log('DATA3: ' + res_body);
                        });
                        res.on("error", function(err2){
                            console.error(err.message);
                        });
                    });
                });
            }
        });
        parser.write(body);
        parser.end();
    }
});