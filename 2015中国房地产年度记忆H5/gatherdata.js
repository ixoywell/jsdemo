!function(){
var Cookie = (function(){var b={};var f=decodeURIComponent;var e=encodeURIComponent;b.get=function(j,i){h(j);if(typeof i==="function"){i={converter:i}}else{i=i||{}}var k=d(document.cookie,!i["raw"]);return(i.converter||g)(k[j])};b.set=function(l,n,k){h(l);k=k||{};var i=k["expires"];var m=k["domain"];var o=k["path"];if(!k["raw"]){n=e(String(n))}var p=l+"="+n;var j=i;if(typeof j==="number"){j=new Date();j.setDate(j.getDate()+i)}if(j instanceof Date){p+="; expires="+j.toUTCString()}if(c(m)){p+="; domain="+m}if(c(o)){p+="; path="+o}if(k["secure"]){p+="; secure"}document.cookie=p;return p};b.remove=function(j,i){i=i||{};i["expires"]=new Date(0);return this.set(j,"",i)};function d(r,t){var s={};if(a(r)&&r.length>0){var j=t?f:g;var p=r.split(/;\s/g);var q;var k;var m;for(var l=0,n=p.length;l<n;l++){m=p[l].match(/([^=]+)=/i);if(m instanceof Array){try{q=f(m[1]);k=j(p[l].substring(m[1].length+1))}catch(o){}}else{q=f(p[l]);k=""}if(q){s[q]=k}}}return s}function a(i){return typeof i==="string"}function c(i){return a(i)&&i!==""}function h(i){if(!c(i)){throw new TypeError("Cookie name must be a non-empty string")}}function g(i){return i}return b})();
 /**
 * 动态加载js文件
 * @param  {string}   url      js文件的url地址
 * @param  {Function} callback 加载完成后的回调函数
 */
function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0],
        js = document.createElement('script');

    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);

    head.appendChild(js);

    //执行回调
    var callbackFn = function() {
        if (typeof callback === 'function') {
            callback();
        }
    };

    if (document.all) { //IE
        js.onreadystatechange = function() {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                callbackFn();
            }
        }
    } else {
        js.onload = function() {
            callbackFn();
        }
    }
}

function callback(obj) {
	if(!obj || obj.status!=='succ') return;
	var ock = Cookie.get('gatheruuid');
	var nck = obj.info;
    nck && nck != ock && Cookie.set('gatheruuid', nck, {
        expires: 365,
        path:'/'
    });
}

window.__setGatherCookie__ = callback;

getScript('http://m.leju.com/touch/js/get_cookie.html?callback=__setGatherCookie__');

}();