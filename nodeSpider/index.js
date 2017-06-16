var fs = require('fs');
var async = require('async');
var request = require('request');

var url = "https://www.zhihu.com/api/v4/members/jin-xi-xi-35/followers?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20";
var url1 = "https://www.zhihu.com/api/v4/members/ni-ba-tie-ren/followees?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&amp;offset=0&amp;limit=20";
 
var zurl = "https://www.zhihu.com/api/v4/members/demouser/followees?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&amp;offset=0&amp;limit=20";
 
//request请求的options
var options = {
    url: url,
    headers: {
        "authorization": "Bearer Mi4wQUFCQTZFc3FBQUFBTUVCMnAtYWhDU1lBQUFCZ0FsVk5TdFpBV1FDZl9FRXFJMlFoa3RJMVV2enQ3N2J6N2U1dTdn|1494832046|e8add976cfdc4762ba6f093fb70d625112098647",
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
}

//获取用户数据
function getDataList(url) {
    options.url = url;
	console.log(url);
    request.get(options, function(error, response, body) {
		console.log(response);
        if(!error && response.statusCode == 200) {
            var response = JSON.parse(response.body);
			console.log(response);
            var zhList = response.data;
            zhList.forEach(function(item) {
                //item.gender == 0 性别判断
                if(item.gender == 0) {
                    console.log(`正在抓取${item.avatar_url}`)
                    users.push({
                        "name": item.name,
                        "img": item.avatar_url.replace("_is", ""),
                        "url_token": item.url_token
                    })
                }
            })
            //is_end当前用户的关注用户是否到最后一页
            if(response.paging.is_end) {
                //这里判断抓取的条数
                if(users.length >= 1000) {
                    console.log(`抓取完成`);
                    downLoadContent(JSON.stringify(users));
                    return;
                } else {
                    console.log(`第${i+1}个用户的数据`);
                    getDataList(zurl.replace("demouser", users[i].url_token))
                    i++;
                }
            } else {
                if(users.length >= 1000) {
                    console.log(`抓取完成`);
                    downLoadContent(JSON.stringify(users));
                    return;
                }
                getDataList(response.paging.next);
            }
        }
    })
}

//保存数据下载到data.js
function downLoadContent(cont) {
    fs.appendFile('./' + 'data.js', "module.exports =" + cont, 'utf-8', function(err) {
        if(err) {
            console.log(err);
        } else
            console.log('success');
    });
}


//人脸识别API
var eyeUrl = "http://api.eyekey.com/face/Check/checking";
var options = {
    "app_id": "f89ae61fd63d4a63842277e9144a6bd2",
    "app_key": "af1cd33549c54b27ae24aeb041865da2",
    "url": "https://pic4.zhimg.com/43fda2d268bd17c561ab94d3cb8c80eb.jpg"
}
function face(item) {
    options.url = item.img;
    request.post({
        url: eyeUrl,
        form: options
    }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            try {
                if(data.face[0].attribute.gender == 'Female') {//判断妹子头像
                    console.log(`正在下载${item.img}`);
                    downLoadImg(item)
                }
            } catch(e) {
                console.log(`验证失败${item.img}~`);
            }
        }
    })
}

//下载图片
function downLoadImg(image) {
    request.head(image.img, function(err, res, body) {
        if(err) {
            console.log(err);
        }
    });
    request(image.img).pipe(fs.createWriteStream('./image/' + image.name + Date.now() + '.' + image.img.substring(image.img.lastIndexOf(".") + 1, image.img.length)));
}

//开始下载
function startDownLoad(imgdata){
    //控制并发量,在5个以内
    async.eachLimit(imgdata, 3, function (item, callback) {
        face(item);
        callback();
    }, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log('success!');
        }
    });
}

//下载入口
getDataList(url) //#获取数据的入口,把数据保存到文件中
//startDownLoad(imgdata) //#下载图片数据的入口,把数据拿出来分享下载