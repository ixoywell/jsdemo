//==TRIM==
String.prototype.Trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//==获取对象==
function $(obj){return document.getElementById(obj)}

//==获取问卷URL参数==
/*
	obj:隐含域id
	name:url参数名
*/
function getUrlPara(obj,name){
	var urlSearch = window.location.search;
	var pattern = new RegExp("[?&]" + name +"=([^&\\s]+)","g");
	var value = pattern.exec(urlSearch);
	if(value != null){
		$(obj).value=value[1];
	}
}

//==获取答卷时间==
/*
	surveyTime:隐含域id
*/
startTime = 0;
function surveyStart(){
	var start = new Date();
	startTime = start.getTime();
}
function surveyOver(){
	if($("surveyTime")){
		var now = new Date();
		$("surveyTime").value=(now.getTime() - startTime)/1000;
	}
}

//window.onload=surveyStart;
surveyStart();

//==cookie设置＆读取==
/*
	name:cookie值名
	value:上诉cookie值名对应cookie值
	expires:cookie值生存期，单位是分钟，默认60分钟
	path:cookie路径，默认在该页面的目录下
	domain:跨域名访问
*/
function setCookie(name,value,expires,path,domain){
	var cookie=""
	if(name && value){cookie += name + "=" + escape(value) + ";"}
	if(expires){cookie +="expires=" + (new Date((new Date()).getTime() + expires * 60000)).toGMTString() + ";"}
	if(path){cookie += "path=" + path + ";"}
	if(domain){cookie += "domain=" + domain + ";"}
	if(cookie!=null && cookie!=""){document.cookie = cookie}
}
/*
	name:获取cookie值名
	getCookie(name):返回值
*/
function getCookie(name){
	var cookie =  new String(document.cookie);
	var pattern = new RegExp(name + "=([^;\\s]+)");
	var value = pattern.exec(cookie);
	if(value!=null){return value[1];}
	else {return null}
}