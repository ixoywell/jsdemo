/*
 charset "utf-8";
 Author : 小丘
 Careate Date : 2016-2
 Version: 1.0
 */

var CW = document.getElementById('CanvasWrapper');
var GC = document.getElementById('GameCanvas');
var musicbomb = document.getElementById('musicbomb');

if (isAdater()) {
	GC.width = document.documentElement.clientWidth;
	GC.height = document.documentElement.clientHeight;
    //alert('你的设备是手机！')
}else{
    //alert('你的设备不不不不不是手机！');
};

try{
	var ctx = GC.getContext("2d");
	console.log("html5 canvas is supported");
}catch(err){
	alert("html5 canvas is not supported");
}

var canvasWidth = GC.width;
var canvasHeight = GC.height;
var balloonsObj = [];
var speed = 5;
var grade = 0;
var framerate = 20;
var balloonspeed = 20;
var fps = -1;
var gamestart = true;
var touchX = 0; //游戏触碰位置
var touchY = 0;
var gameTime = 1000 * 5;  //游戏时间
var countdown = 0;
var coin = 2; //金币，玩游戏机会
//背景图片
var imgbg = new Image();
imgbg.src="./img/gamebg.png";

// 分数图片对象
var scorebg = new Image();
scorebg.src="./img/scorebg.png";

var countdownbg = new Image();
countdownbg.src="./img/countdownbg.png";

var goldcoin = new Image();
goldcoin.src="./img/goldcoin.png";

//背景
var bg = {
	y:canvasHeight,
	draw:function (){
		ctx.drawImage(imgbg, 0, 0, 750, 1334, 0, 0, canvasWidth, canvasHeight);
	},
};

var imgballoons = ['img/ball1.png', 'img/ball2.png', 'img/ball3.png', 'img/ball4.png', 'img/ball5.png', 'img/ball6.png', 'img/ball7.png', 'img/ball8.png'];
var imgbombs = ['img/bomb-2.png', 'img/bomb-4.png', 'img/bomb-6.png', 'img/bomb-8.png', 'img/bomb-100.png', 'img/bomb-200.png'];

var balloons = [];
var bombs = [];
for (var i = 0,len = imgballoons.length; i < len; i++) {
	balloons[i] = new Image();
	balloons[i].src = imgballoons[i];
}

for (var j = 0; j < imgbombs.length; j++) {
	bombs[j] = new Image();
	bombs[j].src = imgbombs[j];
}


//随机数
function fnRand(min,max){
	return parseInt(Math.random()*(max-min)+min);
}

//撞击判断
function crash(obj1,obj2){
	var l1 = obj1.x;

	var t1 = obj1.y;
	var l2 = obj2.x;
	var r2 = obj2.x+obj2.w/2;
	var t2 = obj2.y;
	var b2 = obj2.y+obj2.h/2;

	if (l1<r2&&l1>l2&&t1<b2&&t1>t2){
		return true;
	}else{
		return false;
	}
}

var touchs = {
	blood : 1,
	x : touchX,
	y : touchY,
	move: function () {
		if (this.blood <= 0) {
			this.x = null;
			this.y = null;
		}
	}
}

//气球
function Balloon(){
	var fn = fnRand(0,100);
	this.fn = fn;
	this.speed = speed*0.8;
    this.bai_spend = 0;
    this.blood = 1;
    this.w = 137;
    this.h = 285;
	//出现不同气球的概率
	if (this.fn <= 20) {
        this.speed = speed;
		this.img = balloons[7];
        //this.blood = 5;  //被打到时blood自减， 当blood<0时爆炸
	}else if (this.fn > 20 && this.fn <= 35) {
		this.speed = speed*0.8;
		this.img = balloons[6];
	}else if (this.fn > 35 && this.fn <= 50) {
        this.speed = speed*0.6;
        this.img = balloons[5];
    }else if (this.fn > 50 && this.fn <= 60) {
        this.speed = speed*0.7;
        this.img = balloons[4];
    }else if (this.fn > 60 && this.fn <= 70) {
        this.speed = speed * 0.5;
        this.img = balloons[3];
    }else if (this.fn > 70 && this.fn <= 80) {
        this.w = 131;
        this.h = 330;
        this.speed = speed*0.5;
        this.img = balloons[2];
    }else if (this.fn > 80 && this.fn <= 90) {
        this.w = 127;
        this.h = 269;
        this.speed = speed*0.5;
        this.img = balloons[1];
    }else {
        this.w = 147;
        this.h = 347;
        this.speed = speed*0.3;
        this.img = balloons[0];
    };


    this.imgenemyX = 0;
	this.imgenemyY = 0;
	this.x = fnRand(0,canvasWidth - this.w/2);
	this.y = canvasHeight+this.h/4
	this.draw = function (){
		this.move();
		ctx.drawImage(this.img,
			this.imgenemyX, this.imgenemyY, this.w, this.h,
			this.x, this.y, this.w/2, this.h/2);
	};
	//气球帧动画效果

	this.move = function (){
		if (this.blood > 0) {
			this.y -= this.speed;
            this.bai_spend++;

		};
		//气球爆炸动画效果  blood <= 0 :爆炸动画
		if (this.blood <= 0) {
            this.y -= this.speed;
            this.w = 270;
            this.h = 200;
            if (this.bai_spend >= 0) {
                this.bai_spend = -4;
                if (this.fn < 20) {
                    this.imgenemyX = 0;
                    this.img = bombs[5];
                } else if (this.fn > 20 && this.fn <= 35) {
                    // this.w = 126;
                    // this.h = 95;
                    this.imgenemyX = 0;
                    this.img = bombs[4];
                } else if (this.fn > 35) {
                    this.imgenemyX = 0;
                    this.img = bombs[3];
                }
            };
			if (this.imgenemyX < this.w*10) {
				this.imgenemyX += this.w;
			};
		};
	};
}

// 开始定时器
function start(){

	var timer = setInterval(function () {
		fps++;
		if (fps > 2000) {
			fps = 1;
		};
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		bg.draw();
		touchs.move();

        //气球创建
        if (fps % balloonspeed == 0) {
            balloonsObj.push(new Balloon());
            //alert(balloons.x)
            for (var i = 0, len = balloonsObj.length; i < len; i++) {
                if (balloonsObj[i].y < -canvasHeight) {
                    balloonsObj.splice(i,1);
                    i--;
                    len--;
                };
                //balloonsObj[i].draw();
                //console.log( "气球x坐标的位置："+balloons[i].x);

            };
        };
        for (var i = 0, len = balloonsObj.length; i < len; i++) {
            balloonsObj[i].draw();
        };

		//触碰和气球的判断
		for (var j = 0,lenj = balloonsObj.length; j < lenj; j++) {
            if (balloonsObj[j].y < canvasHeight+balloonsObj[j].h/2 && balloonsObj[j].blood > 0 && touchs.blood > 0 && crash(touchs,balloonsObj[j])) {
               // console.log(touchs.blood +"  "+balloonsObj[j].blood);
				balloonsObj[j].blood = 0;
				touchs.blood = 0;
				if (balloonsObj[j].blood <= 0) {
					if (grade > 500 && grade < 1000) {
						balloonspeed = 15;
						speed = 8;
					};
					if (grade > 1500 && grade < 2500) {
						balloonspeed = 10;
						speed = 12;
					};
					if (grade > 3000 && grade < 4000) {
						balloonspeed = 6;
						speed = 14;
					};
					if (grade > 5000 && grade < 6000) {
						balloonspeed = 20;
						speed = 17;
					};
					if (grade > 7000 && grade < 8000) {
						balloonspeed = 30;
						speed = 20;
					};

                    //分数
					if (balloonsObj[j].fn < 20) {
						grade += 200;
                    }else if (balloonsObj[j].fn > 20 && balloonsObj[j].fn <= 35) {
                        grade += 100;
                    }else if (balloonsObj[j].fn > 35 && balloonsObj[j].fn <= 50) {
                        grade += 100;
                    }else if (balloonsObj[j].fn > 50 && balloonsObj[j].fn <= 60) {
                        grade += 100;
                    }else if (balloonsObj[j].fn > 60 && balloonsObj[j].fn <= 70) {
                        grade += 8;
                    }else if (balloonsObj[j].fn > 70 && balloonsObj[j].fn <= 80) {
                        grade += 6;
                    }else if (balloonsObj[j].fn > 80 && balloonsObj[j].fn <= 90) {
                        grade += 4;
                    }else {
                        grade += 2;
                    };
				};

				i--;
				lenj--;
				break;
			};
			touchs.blood = 1;
		};

        //记分板
        scoreboard(ctx, grade, coin)

		this.countdown++;
		// 计时器
		timmer(ctx, this.countdown);

		//游戏结束
		if(framerate * this.countdown >= gameTime){
			gameOver(grade, timer);

			//alert(grade);
		}

	}, framerate);

}

// 绘制分数面板
function scoreboard(ctx, grade, coin){
    for(var i= 0; i<coin; i++){
        ctx.drawImage(goldcoin, 0, 0, 38, 38, 135+ i*25, canvasHeight-138, 19, 19);
    }
    ctx.font = '50px 黑体';
    ctx.fillStyle = 'black';
    ctx.textBaseline = "top";
    ctx.drawImage(scorebg, 0, 0, 728, 364, 8,canvasHeight-182, canvasWidth-15, 182);
    ctx.fillText(parseInt(grade/1000%10),canvasWidth*2/11+3 ,canvasHeight-90);
    ctx.fillText(parseInt(grade/100%10),canvasWidth*4/11+4,canvasHeight-90);
    ctx.fillText(parseInt(grade/10%10),canvasWidth*6/11+6,canvasHeight-90);
    ctx.fillText(grade%10,canvasWidth*8/11+7,canvasHeight-90);
}

function timmer(ctx, index){
	var minus = index * framerate;
	ctx.font = '30px 微软雅黑';
	ctx.fillStyle = 'white';
    var countw = canvasWidth - 295;
    ctx.drawImage(countdownbg, 0, 0, 589, 179, countw/2, 10, 295 , 90);
    ctx.fillText(Math.floor((gameTime - minus) /1000), countw+120, 25);
}

// 游戏触摸移动事件
GC.addEventListener("touchstart", function (e){
    touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	//console.log(touchX + "   " + touchY);
	touchs.x= touchX;
	touchs.y = touchY;

},false);

//brower judge
function isAdater(){
	var Agents = ["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"];
	var userAgentInfo = navigator.userAgent;
	var flag = false;
	for (var i = 0; i < Agents.length; i++) {
		if (userAgentInfo.indexOf(Agents[i]) > 0) {
			flag = true;
			break;
		}
	}
	return flag;
}

//游戏结束
function gameOver(grade,timer){
	$('.pop-up-bg').show();
	$('.game-result').show();
	$('.result-score').text(grade);
	clearInterval(timer);
	/*
	$.ajax({
		type: "post",
		timeout:10000,//设置超时时间为5秒
		url: "handle/score.jsp",
		data: {newScore:grade},
		dataType: "json",
		cache:false,
		success:function(data){
			$('.meng00').hide();
			if(data.res=='s'){
				if(isChallenge){
					if(grade>friendScore){

						share();
					}
				}else{
					if(grade>bestScore){
						bestScore=grade;
						$('.game1').show();
						resBoard=1;
					}else{
						$('.game2').show();
						resBoard=2;
					}

					share();
				}
				$('#over').show();
			}
		},
		error:function(x,status){
			$('.meng00').hide();
			if(status=='timeout'){
				alert("哎呀，您的网络好像有问题，点击确定再试试");
				endGame(grade);
				return false;
			}
		}
	});
	*/
};
