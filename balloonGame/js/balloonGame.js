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
    alert('你的设备是手机！')
}else{
    alert('你的设备不不不不不是手机！');
};

try{
	var ctx = GC.getContext("2d");
	console.log("html5 canvas is supported");
}catch(err){
	alert("html5 canvas is not supported");
}
//create object ballGame
var ballGame = window.ballGame || {};

ballGame = {
    canvasWidth : GC.width,
    canvasHeight : GC.height,
    canvasId: "GameCanvas",
    ballons : [],
    balloons : [],
    speed : 5,
    grade : 0,
    framerate : 20,
    balloonspeed : 20,
    fps : -1,
    gamestart : true,
    touchX : 0, //游戏触碰位置
    touchY : 0,
    gameTime : 1000 * 30,  //倒计时
    countdown : 0  //
}
//背景图片
var imgbg = new Image();
imgbg.src="./img/gamebg.png";

// 分数图片对象
var imgfenshu_bg = new Image();
imgfenshu_bg.src="./img/fenshu_bg.png";

var imgenemy1 = new Image();
imgenemy1.src="./img/enemy1.png";

var imgenemy2 = new Image();
imgenemy2.src="./img/enemy2.png";

var imgenemy1e = new Image();
imgenemy1e.src="./img/enemy1e.png";

var imgenemy2e = new Image();
imgenemy2e.src="./img/enemy2e.png";

//背景
var bg = {
	y:canvasHeight,
	draw:function (){
		ctx.drawImage(imgbg, 0, 0, 750, 1334, 0, 0, canvasWidth, canvasHeight);
	},
};

var imgballons = ['images/c1.png', 'images/c2.png', 'images/c3.png', 'images/c4.png', 'images/c5.png', 'images/c6.png', 'images/c7.png', 'images/c8.png', 'images/c9.png'];
var imgfraction = ['images/add1.png', 'images/add2.png', 'images/add3.png', 'images/add4.png', 'images/add5.png', 'images/add6.png', 'images/add7.png', 'images/add8.png', 'images/add9.png'];

var ballonsObj = [];
for (var i = 0,len = imgballons.length; i < len; i++) {
	ballonsObj[i] = new Image();
	ballonsObj[i].src = imgballons[i];
}


//随机数
ballGame.prototype.fnRand = function(min,max){
	return parseInt(Math.random()*(max-min)+min);
}

//撞击判断
ballGame.prototype.crash = function(obj1,obj2){
	var l1 = obj1.x;
	var t1 = obj1.y;
	var l2 = obj2.x;
	var r2 = obj2.x+obj2.w;
	var t2 = obj2.y;
	var b2 = obj2.y+obj2.h;

	if (l1<r2&&l1>l2&&t1<b2&&t1>t2){
		return true;
	}else{
		return false;
	}
}

ballGame.prototype.bullets = {
    blood: 1,
    x: touchX,
    y: touchY,
    move: function () {
        if (this.blood <= 0) {
            this.x = null;
            this.y = null;
        }
    }
}

//气球
function Balloon(){
	var fn = fnRand(0,15);
	this.fn = fn;
	this.speed = speed*0.8;
	this.bai_spend = 0;

	//出现不同气球的概率
	if (this.fn < 10) {
		this.img = imgenemy1;
		this.blood = 2;
		this.w = 90;
		this.h = 87;
	}else if (this.fn >= 10 && this.fn <= 14) {
		this.speed = speed*0.5;
		this.img = imgenemy2;
		this.blood = 5;
		this.w = 110;
		this.h = 88;
	};

	this.imgenemyX = 0;
	this.imgenemyY = 0;
	this.x = fnRand(0,canvasWidth - this.w);
	//this.y = fnRand(canvasHeight+this.h + 10,canvasHeight+this.h);
	this.y = canvasHeight-this.h;
	this.draw = function (){
		this.move();
		ctx.drawImage(this.img,
			this.imgenemyX, this.imgenemyY, this.w, this.h,
			this.x, this.y, this.w, this.h);
	};
	//气球帧动画效果
	this.move = function (){
		if (this.blood > 0) {
			this.y -= this.speed;
			this.bai_spend++;
			if (this.bai_spend >= 5) {
				this.bai_spend = 0;
				this.imgenemyX += this.w;
				if (this.imgenemyX > this.w) {
					this.imgenemyX = 0;
				};
			}
		};

		//气球爆炸动画效果  blood <= 0 :爆炸动画
		if (this.blood <= 0) {
			if (this.bai_spend >= 0) {
				this.bai_spend = -1;
				if (this.fn < 10) {
					this.w = 115;
					this.h = 95;
					this.imgenemyX = 0;
					this.img = imgenemy1e;
				}else if (this.fn <= 14) {
					this.w = 126;
					this.h = 95;
					this.imgenemyX = 0;
					this.img = imgenemy2e;
				}
			};

			if (this.imgenemyX < this.w*10) {
				this.imgenemyX += this.w;
			};
		};
	};
}
//CANVAS
ballGame.canvas.prototype = {
    ctx: null,
    width: ballGame.CANVAS_WIDTH,
    height: ballGame.CANVAS_HEIGHT,
    init: function(canvasId){
        var canvas = document.getElementById(canvasId);
        //if ( ! canvas || ! canvas.getContext ) return false;
        try{
            this.ctx = canvas.getContext('2d');
            console.log("html5 canvas is supported");
        }catch(err){
            alert("html5 canvas is not supported");
        }
    },
    clear: function(){
        this.ctx.clearRect(0, 0, this.width, this.height );
    }
};

ballGame.bg.prototype = {
    draw:function (){
        ctx.drawImage(imgbg, 0, 0, 750, 1334, 0, 0, canvasWidth, canvasHeight);
    }
};

//game
ballGame.game = {

    ready: function(){
        var canvas = new ballGame.canvas();
        canvas.init(ballGame.canvasId);
        var bg = new ballGame.bg();
    },
    // 开始定时器
    start: function(){
        this.ready();
        var timer = setInterval(function () {
            fps++;
            if (fps > 2000) {
                fps = 1;
            };
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            bg.draw();
            bullets.move();

            //触碰和气球的判断
            for (var j = 0,lenj = balloons.length; j < lenj; j++) {
                if (balloons[j].y < canvasHeight && balloons[j].blood > 0 && bullets.blood > 0 && crash(bullets,balloons[j])) {
                    balloons[j].blood = 0;
                    bullets.blood = 0;
                    if (balloons[j].blood <= 0) {
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
                            balloonspeed = 4;
                            speed = 17;
                        };
                        if (grade > 7000 && grade < 8000) {
                            balloonspeed = 4;
                            speed = 20;
                        };


                        if (balloons[j].fn < 10) {
                            grade += 10;
                        }else if (balloons[j].fn >= 10 && balloons[j].fn <= 14) {
                            grade += 20;
                        }
                    };

                    i--;
                    len--;
                    break;
                };
                bullets.blood = 1;
            };


            //气球创建
            console.log(fps+"  " +fps % balloonspeed);
            if (fps % balloonspeed == 0) {
                balloons.push(new Balloon());
                //alert(balloons.x)
                for (var i = 0,len = balloons.length; i < len; i++) {
                    if (balloons[i].y < -canvasHeight) {
                        balloons.splice(i,1);
                        i--;
                        len--;
                    };
                    //balloons[i].draw();
                    //console.log( "气球x坐标的位置："+balloons[i].x);

                };
            };
            for (var i = 0,len = balloons.length; i < len; i++) {
                balloons[i].draw();
            };


            // 绘制分数面板
            ctx.drawImage(imgfenshu_bg, 0, 0, 168, 71, canvasWidth - 188, 10, 168, 71);
            ctx.font = '32px 黑体';
            ctx.textBaseline = "top";
            ctx.fillText(grade,canvasWidth - 105,33);

            this.countdown++;
            // 计时器
            this.timmer(ctx, this.countdown);

            //游戏结束
            if(framerate * this.countdown >= gameTime){
                gameOver(grade, timer);

                //alert(grade);
            }

        }, framerate);

    },

    timmer: function(ctx, index){
        var minus = index * ballGame.FRAMERATE;
        ctx.font = '25px 微软雅黑';
        ctx.fillStyle = '#de5f0a';
        ctx.fillText('剩余时间:', 875, 550);
        ctx.font = '50px arial';
        ctx.fillText(Math.floor((ballGame.GAMETIMES - minus) /1000), 900, 610);
    },

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
		bullets.move();

		//触碰和气球的判断
		for (var j = 0,lenj = balloons.length; j < lenj; j++) {
			if (balloons[j].y < canvasHeight && balloons[j].blood > 0 && bullets.blood > 0 && crash(bullets,balloons[j])) {
				balloons[j].blood = 0;
				bullets.blood = 0;
				if (balloons[j].blood <= 0) {
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
						balloonspeed = 4;
						speed = 17;
					};
					if (grade > 7000 && grade < 8000) {
						balloonspeed = 4;
						speed = 20;
					};


					if (balloons[j].fn < 10) {
						grade += 10;
					}else if (balloons[j].fn >= 10 && balloons[j].fn <= 14) {
						grade += 20;
					}
				};

				i--;
				len--;
				break;
			};
			bullets.blood = 1;
		};


		//气球创建
		console.log(fps+"  " +fps % balloonspeed);
		if (fps % balloonspeed == 0) {
			balloons.push(new Balloon());
			//alert(balloons.x)
			for (var i = 0,len = balloons.length; i < len; i++) {
				if (balloons[i].y < -canvasHeight) {
					balloons.splice(i,1);
					i--;
					len--;
				};
				//balloons[i].draw();
				//console.log( "气球x坐标的位置："+balloons[i].x);

			};
		};
		for (var i = 0,len = balloons.length; i < len; i++) {
			balloons[i].draw();
		};


		// 绘制分数面板
		ctx.drawImage(imgfenshu_bg, 0, 0, 168, 71, canvasWidth - 188, 10, 168, 71);
		ctx.font = '32px 黑体';
		ctx.textBaseline = "top";
		ctx.fillText(grade,canvasWidth - 105,33);

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

function timmer(ctx, index){
	var minus = index * framerate;
	ctx.font = '25px 微软雅黑';
	ctx.fillStyle = '#de5f0a';
	ctx.fillText('剩余时间:', 0, 30);
	ctx.font = '50px arial';
//	ctx.fillText(grade,canvasWidth - 105,33);
	ctx.fillText(Math.floor((gameTime - minus) /1000), 105,33);
}
// 游戏触摸移动事件

GC.addEventListener("touchstart", function (e){
	touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	//console.log(touchX + "   " + touchY);

	bullets.x= touchX;
	bullets.y = touchY;

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
	$('.gradeDoard').show();
	$('.nowScore').text(grade);
	clearInterval(timer);
	/*
	$.ajax({
		type: "post",
		timeout:10000,//设置超时时间为5秒
		url: "phphandle/score.php",
		data: {newScore:grade},
		dataType: "json",
		cache:false,
		success:function(data){
			$('.meng00').hide();
			if(data.res=='s'){
				if(isChallenge){
					if(grade>friendScore){
						$('.game3').show();
						resBoard=3;
						shareTitle="闭着眼睛也能赢"+friendNickName+"，太容易啦，看我轻松拿下榜首大奖！";
						shareDesc="别膜拜我，我只是个传说";
						share();
					}else{
						$('.game4').show();
						resBoard=4;
						shareTitle="要不是我顾及"+friendNickName+"的感受，才不会输给TA呢！放开奖品，我再试一次！";
						shareDesc="我努力一下，榜首一定是我的，奖品也是我的！";
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
					shareTitle="我在咕叽飞机大战获得"+grade+"分，敢跟我PK吗？挑战榜首赢大礼就现在！";
					shareDesc="赢了我就是人生赢家！";
					shareLink="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1da4cc96f128c9d7&redirect_uri=http://lesso.yangyue.com.cn/activity/merrygame/oauth1.php&response_type=code&scope=snsapi_userinfo&state="+data.id+"#wechat_redirect";
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
}





/*
//set canvas width & height
var canWidth = screen.width;
var canHeight = screen.height;
var CW = document.getElementById('CanvasWrapper');
//CW.style.width = canWidth+'px';
//CW.style.height = canHeight+'px';

//create object ballGame
var ballGame = window.ballGame || {};

//Constant
ballGame.CANVASID = 'gamesCanvas';
ballGame.CANVAS_WIDTH = canWidth;
ballGame.CANVAS_HEIGHT = canHeight;
ballGame.INITIMAGES = ['images/bg.jpg', 'images/c1.png', 'images/c2.png', 'images/c3.png', 'images/c4.png', 'images/c5.png', 'images/c6.png', 'images/c7.png', 'images/c8.png', 'images/c9.png'];
ballGame.FRACTION = ['images/add1.png', 'images/add2.png', 'images/add3.png', 'images/add4.png', 'images/add5.png', 'images/add6.png', 'images/add7.png', 'images/add8.png', 'images/add9.png'];
ballGame.AUDIO = true;
ballGame.FRAMERATE = 20;
ballGame.GAMETIMES = 1000 * 60;
ballGame.DOMS = null;

//safari
if ($.browser.safari) {
	ballGame.AUDIO = false;

}
//load material
ballGame.loadMaterial = function(){};
ballGame.loadMaterial.prototype = {
	mask: true,
	imgs: [],
	init: function(callback){
		if(ballGame.DOMS){
			callback(ballGame.DOMS);
			return false;
		}
		if(this.mask){
			var mask = '<div id="mask" style="position:absolute; left:0; top:0; width:100%; height:100%; background:#000; opacity:0.5;">' +
				'<div style="position:absolute; left:42%; top:48%; width:16%; height:1%; background:#000; padding:1px; border:1px solid #d6d8eb;">' +
				'<span style="width:0; height:100%; display:block; background:#d6d8eb;" id="progress"></span>' +
				'</div>' +
				'<span style="position:absolute; left:40%; top:51%; width:20%; text-align:center; color:#d6d8eb;font-family: times New Roman;" id="progress_material"></span>' +
				'<span style="position:absolute; left:40%; top:55%; width:20%; text-align:center; color:#d6d8eb;font-family: times New Roman;" id="progress_text">0%</span>' +
				'</div>';
			$(mask).appendTo($('body'));
		}
		var img;
		var index = 0;
		var imgs = this.imgs.concat(ballGame.FRACTION);
		var imgDoms = {
			scene: '',
			balloons: [],
			fraction: []
		};
		var _this = this;
		for(var i = 0; i < imgs.length; i++){
			img = new Image;
			img.src = imgs[i];
			if(i == 0){
				imgDoms.scene = img;
			}else if(i > 0 && i <this.imgs.length ){
				imgDoms.balloons.push(img);
			}else{
				imgDoms.fraction.push(img);
			}
			img.onload = function(){
				index++;
				$('#progress_material').text('素材加载中(' + imgs[index] +')');
				$('#progress').css('width', (100 / imgs.length * index) + '%');
				$('#progress_text').text( Math.floor(100 / imgs.length * index) + '%');
				if(index == imgs.length){
					if($('#mask')){
						$('#mask').fadeOut('2000');
					}
					ballGame.DOMS = imgDoms;
					callback(imgDoms);
				}
			}
		}
	}
};

//canvas
ballGame.canvas = function() {};
ballGame.canvas.prototype = {
	_ctx: null,
	_width: ballGame.CANVAS_WIDTH,
	_height: ballGame.CANVAS_HEIGHT,
	setCtx: function(thectx){
		this._ctx = thectx;
	},
	init: function(canvas_id){
		var _canvas = document.getElementById(canvas_id);
		if ( ! _canvas || ! _canvas.getContext ) return false;
		this.setCtx(_canvas.getContext('2d'));
	},
	clear: function(){
		this._ctx.clearRect(0, 0, this._width, this._height );
	}
};

//scene
ballGame.scene = function() {};
ballGame.scene.prototype = {
	_ctx: null,
	_img: null,
	init: function(imgDoms, ctx) {
		if(!ctx){
			var canvas = new ballGame.canvas();
			canvas.init(ballGame.CANVASID);
			ctx = canvas._ctx;
		}
		this._ctx = ctx;
		this._img = imgDoms
	},
	drawScene: function() {
		this._ctx.save();
		this._ctx.drawImage(this._img, 0, 0);
		this._ctx.restore();
	}
};
//balloons
ballGame.balloons = function() {};
ballGame.balloons.prototype = {
	_ctx: null,
	_img: null,
	_lv: -1,
	_x: 0,
	_y: 570,
	_broke: false,
	_brokeDelay: 0,
	_fraction: null,
	init: function(imgDoms, fractionDoms, ctx){
		if(!ctx){
			var canvas = new ballGame.canvas();
			canvas.init(ballGame.CANVASID);
			ctx = canvas._ctx;
		}
		this._ctx = ctx;
		this._img = imgDoms;
		this._fraction = fractionDoms;
	},
	drawBalloon: function(){
		this._ctx.save();
		if(this._x == 0){
			this._x = Math.floor( Math.random() * 874) + 50;
		}
		if(this._lv == -1){
			this._lv = Math.floor( Math.random() * this._img.length);
		}
		if(this._broke){
			this._ctx.drawImage(this._fraction[this._lv], this._x, this._y);
			this._brokeDelay ++;
		}else{
			this._ctx.drawImage(this._img[this._lv], this._x, this._y);
		}
		this._ctx.restore();
	}
};

//game
ballGame.game = {
	ready: function(){
		var gc = document.getElementById("gamesCanvas");
		if (gc.width  < window.innerWidth) {
			gc.width  = window.innerWidth;
		}
		if (gc.height < window.innerHeight) {
			gc.height = window.innerHeight;
		}
		$('#startGame').on('click', function(e){
			ballGame.game.run();
			$('.pop-up-bg').hide();
			e.preventDefault(); //取消事件的默认动作。
		})

	},
	run: function(){
		var self = this;
		//get canvas context
		var canvas = new ballGame.canvas();
		canvas.init(ballGame.CANVASID);
		var ctx = canvas._ctx;
		alert(123)
		//create mask
		var mask = new ballGame.loadMaterial();
		mask.imgs = ballGame.INITIMAGES;
		mask.init(function(doms){
			self.fraction = doms.fraction;
			var scene = new ballGame.scene();
			scene.init(doms.scene, ctx);

			var ballTimer = setInterval(function(){
				canvas.clear();
				scene.drawScene();
				self.idx++;
				//记时器
				self.timmer(ctx, self.idx);
				//增加1个气球
				if(self.idx % 25 == 0){
					self.balloon = new ballGame.balloons();
					self.balloon.init(doms.balloons, doms.fraction, ctx);
					self.balloons.push(self.balloon);
				}
				for(var i = 0; i < self.balloons.length; i++){
					if(!self.balloons[i]._broke){
						self.balloons[i]._y = self.balloons[i]._y - Math.floor((self.balloons[i]._lv + 1));
					}else{
						self.balloons[i]._y = self.balloons[i]._y - 2;
					}
					if(self.balloons[i]._y < -80 || (self.balloons[i]._broke && (self.balloons[i]._brokeDelay + 1) % 35 == 0)) {
						self.balloons[i] = null;
						self.balloons.splice(i,1);
					}else{

					}
					if(self.balloons[i]){
						self.balloons[i].drawBalloon();
					}
				}

				if(ballGame.FRAMERATE * self.idx >= ballGame.GAMETIMES){
					self.game_over(ballTimer, ctx);
				}

				self.showSummer(ctx);

			}, ballGame.FRAMERATE);
		});

		this.audio();
		this.start_monitor();


	},
	game_over: function(t, ctx){
		window.clearInterval(t);
		if($('#game_over').length > 0 ){
			$('#game_over').show();
			$('#game_score').show();
		}else{
			$('<div id=\"game_over\"></div>').css({
				width: ballGame.CANVAS_WIDTH,
				height: ballGame.CANVAS_HEIGHT,
				position: 'absolute',
				zIndex: 1000,
				background:'#000',
				opacity: 0.5,
				top: 0,
				left: 0,
			}).appendTo($('#CanvasWrapper'));

			$('<div id=\"game_score\"><span></span><a href="#"><img src="images/restart.png" /></a></div>').css({
				width: ballGame.CANVAS_WIDTH,
				height: ballGame.CANVAS_HEIGHT - 200,
				position: 'absolute',
				zIndex: 1001,
				top: 0,
				left: 0,
				fontSize: 25,
				paddingTop: 200,
				color: '#fff'
			}).appendTo($('#CanvasWrapper'));

		}
		$('#game_score span').css({float: 'left', width: '100%', textAlign: 'center', height: '40px'}).text('GAME OVER!Your score is ' + this.summer);

		this.idx = 0;
		this.summer = 0;
		this.balloons = [];

		$('#game_score a').css({float: 'left', marginLeft: '400px'}).unbind('click').bind('click', function(){
			ctx.clearRect(0, 0, ballGame.CANVAS_WIDTH, ballGame.CANVAS_HEIGHT );
			$('#game_over').hide();
			$('#game_score').hide();
			ballGame.game.run();
			return false;
		});

	},
	summer: 0,
	balloons: [],
	balloon: {},
	fraction: [],
	idx: 0,
	start_monitor: function(){
		var self = this;
		$('#'+ballGame.CANVASID).bind('mousedown', function(e){
			var offset = $(this).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			self.check_hit(x, y);
		});
	},
	check_hit: function(x, y){
		for(var i = 0; i < this.balloons.length; i++){
			var balloon = this.balloons[i];
			if((x > balloon._x + 28) && (x < balloon._x + 72) && (y > balloon._y + 6) && (y < balloon._y + 74)){
				//this.balloon = null;
				//this.balloons.splice(i,1);
				if(ballGame.AUDIO){
					document.getElementById('halleysBom').play();
				}
				this.balloons[i]._broke = true;
				this.summer += balloon._lv + 1;
			}
		}
	},
	audio: function(){
		if(ballGame.AUDIO){
			var audioHTML = '<audio id="halleysBom" style="display:none;">' +
							  '<source src="audio/bom.wav" type="audio/wav" />' +
							'</audio>';
			audioHTML += '<audio id="halleysBg" style="display:none;" autoplay="autoplay" loop="loop">' +
							  '<source src="audio/1029.mp3" type="audio/mp3" />' +
							  '<source src="audio/1029.wav" type="audio/wav" />' +
							'</audio>';
			$(audioHTML).appendTo($('body'));
		}

	},
	timmer: function(ctx, index){
		var minus = index * ballGame.FRAMERATE;
		ctx.font = '25px 微软雅黑';
		ctx.fillStyle = '#de5f0a';
		ctx.fillText('剩余时间:', 875, 550);
		ctx.font = '50px arial';
		ctx.fillText(Math.floor((ballGame.GAMETIMES - minus) /1000), 900, 610);
	},
	showSummer: function(ctx){
		ctx.font = '45px 微软雅黑';
		ctx.fillStyle = '#3769f7';
		ctx.fillText('总分:'+ this.summer, 435, 50);
		ctx.font = 'bold 15px arial';
		ctx.fillStyle = '#000000';
		ctx.fillText('Halley\'s HTML5打气球 V1.0', 15, 630);

	}
};

*/
