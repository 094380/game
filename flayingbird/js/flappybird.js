var wrapGame = document.getElementById("wrapGame");
var headDiv = document.getElementById("head");
// 开始按钮
var startMenu = document.getElementById("startMenu");
//结束菜单
var endMenu = document.getElementById("endMenu");
// 当前得分
var currentScore = document.getElementById("currentScore");
//最高得分
var bestScore = document.getElementById("bestScore");
var pipesUL = document.getElementById("pipes");
// 小鸟
var birdImg = document.getElementById("bird");
// 记录分数的图片
var score = document.getElementById("score");
//草坪对象
var grass = document.getElementById("grass");
var gameMusic = document.getElementById("gameMusic");
var bulletMusic = document.getElementById("bulletMusic");
var gameOverMusic = document.getElementById("gameOver");
var birdDownTimer;//小鸟下落的定时器
var birdFlyTimer;//小鸟上升的定时器
var createPipesTimer;//创建管道的定时器
//开始按钮的点击事件
startMenu.onclick = function (e){
	var event1 = window.event || e;
	// 1.取消事件冒泡 - 只执行开始按钮的点击事件,不执行点击wrap的事件
	event1.cancelBubble = true;
	event1.stopPropagation();
	// 2.播放游戏背景音乐
	gameMusic.play();
	gameMusic.loop = true;//循环播放
	// 3.隐藏开始按钮
	headDiv.style.display = "none";
	startMenu.style.display = "none";
	// 4.显示小鸟以及所得分数的图片
	birdImg.style.display = "block";
	score.style.display = "block";
	// 5.处理草坪的移动
	setInterval(grassMove,30);
	// 6.小鸟的下落
	birdDownTimer = setInterval(birdDown,30);
	//7.小鸟上升
	wrapGame.onclick = function (){
		clickBirdFly();
	}
	// 8.创建管道
	createPipesTimer = setInterval(createPipes,3000);
	// 9.处理碰撞检测
	setInterval(dealCrash,30);//每隔30毫秒检测一次，是否碰撞
}

function dealCrash(){
	//获取页面中的所有li上下管道 与小鸟检测是否碰撞
	var lis = document.getElementsByClassName("pipe");
	for (var i = 0;i < lis.length;i++) {
		//判断上管道与小鸟是否碰撞
		if (isCrash(birdImg,lis[i].firstElementChild)) {
			//碰撞了，调用游戏结束的函数
			// alert("小鸟碰撞到上管道");
			gameOver();
		}
		//判断下管道与小鸟是否碰撞
		if (isCrash(birdImg,lis[i].lastElementChild)) {
			//碰撞了，调用游戏结束的函数
			// alert("小鸟碰撞到下管道");
			gameOver();
		}
		
	}
}

//两个物体碰撞检测的函数  obj1 指代小鸟   obj2 指代上管道，下管道
function isCrash(obj1,obj2){
	var boolCrash = true;//假设true是碰撞到了
	var left1 = obj1.offsetLeft;
	var right1 =  obj1.offsetLeft + obj1.offsetWidth;
	var top1 = obj1.offsetTop;
	var bottom1 = obj1.offsetTop + obj1.offsetHeight;
	//管道的上下左右边距  offsetParent 父级元素 找到定位父级li
	var left2 = obj2.offsetParent.offsetLeft;
	var right2 = obj2.offsetParent.offsetLeft + obj2.offsetWidth;
	var top2 = obj2.offsetTop;
	var bottom2 = obj2.offsetTop + obj2.offsetHeight;
	//判断碰撞条件
	// 碰不到的条件  right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2
	if (!(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2)) {
		//碰撞了
		boolCrash = true;
	}else{
		//未碰撞
		boolCrash = false;
	}
	return boolCrash;
}

//随机函数
function random(m,n){
	return Math.floor(Math.random() * (n - m + 1) + m);
}

//创建管道的函数
function createPipes(){
	//创建上下管道所在的一组li节点
	var li = document.createElement("li");
	li.className = "pipe";//添加的样式
	li.style.left = wrapGame.offsetWidth + "px";//每次创建li在屏幕的右侧
	pipesUL.appendChild(li);
	//随机上管道的高度
	var top_height = random(80,200);
	//获取下管道的高度  假设通道口的高度为150
	var bottom_height = li.offsetHeight - 180 - top_height;
	//创建上管道
	var topDiv = document.createElement("div");
	topDiv.className = "up_pipe";
	topDiv.style.height = top_height + "px";
	//添加到li管道中
	li.appendChild(topDiv);
	//创建下管道
	var bottomDiv = document.createElement("div");
	bottomDiv.className = "down_pipe";
	bottomDiv.style.height = bottom_height + "px";
	//添加到li管道中
	li.appendChild(bottomDiv);
	// 获取此时li的left值,就是移动距离
	var distance = wrapGame.clientWidth;
	
	//让管道移动
	var pipeMoveTimer = setInterval(function (){
		distance -= 2;//和草坪移动的速度和距离一致
		li.style.left = distance + "px";
		//当创建的li管道移出屏幕时，删除li节点
		if (distance <= -li.offsetWidth) {
			// 删除li管道
			pipesUL.removeChild(li);
			//清除管道移动的定时器
			clearInterval(pipeMoveTimer);
		}
		//处理得分操作
		if (distance == -3) {//小鸟飞过管道了
			changeScore();
		}
	},30);
}

var scoreNum = 0;//记录分数
//处理得分操作
function changeScore (){
	scoreNum++;
	score.innerHTML = "";//清空图片内容
	//添加分数图片
	if (scoreNum < 10) {//一位数
		//显示一张图片
		var img = document.createElement("img");
		// "img/0.jpg" 
		img.src = "img/" + scoreNum + ".jpg";
		score.appendChild(img);
	} else if(scoreNum >= 10 && scoreNum <= 99){//两位数
		  // n:56  个位数   n % 10 == 6
		  // n:56  十位数   math.floor(n / 10) == 5
		  // 十位的图片
		  var img1 = document.createElement("img");
		  img1.src = "img/" + Math.floor(scoreNum / 10) + ".jpg";
		  score.appendChild(img1);
		   // 个位的图片
		  var img2 = document.createElement("img");
		  img2.src = "img/" + scoreNum % 10 + ".jpg";
		  score.appendChild(img2);
	}
}


var speed = 0;//记录速度
// 小鸟的下落
function birdDown(){
	birdImg.src =  "img/down_bird1.png";
	speed += 0.5;
	// 最大速度
	if (speed > 10) {
		speed = 10;
	}
	// 修改位置
	birdImg.style.top = birdImg.offsetTop + speed + "px";
	//判断是否碰到草坪
	if (birdImg.offsetHeight + birdImg.offsetTop >= pipesUL.offsetHeight) {
		birdImg.src =  "img/bird1.png";
		//碰到草坪，游戏结束
		gameOver();
	}
}


//小鸟上升的操作
function clickBirdFly(){
	  //播放音乐
	  bulletMusic.play();
	  // 清除小鸟下降的定时器
	  clearInterval(birdDownTimer);
	  // 处理飞翔的定时器
	  speed = 10;//修改速度值，开始上升时速度最快
	   // 清除小鸟之前上升的定时器
	  clearInterval(birdFlyTimer);
	  birdFlyTimer = setInterval(function(){
		  birdImg.src =  "img/up_bird1.png";
		  speed -= 0.5;
		  //当速度小于或者等于0，小鸟就会重新下落，也就是重新启动小鸟下落的定时器
		  if (speed <= 0) {
		  	 // 清除小鸟上升的定时器
		  	clearInterval(birdFlyTimer);
			// 创新创建一个下降的定时器
			birdDownTimer = setInterval(birdDown,30);
		  }
		  // 修改小鸟的位置
		  birdImg.style.top = birdImg.offsetTop - speed + "px";
		  //判断是否碰到顶部
		  if (birdImg.offsetTop <= 0) {
		  	 gameOver();
		  }
	  },30)
}

//游戏结束的函数
function gameOver (){
	  // 启动游戏结束的音乐
	  gameOverMusic.play();
	  //关闭游戏的背景音乐
	  gameMusic.pause();
	  //显示结束菜单
	  endMenu.style.display = "block";
	  endMenu.style.zIndex = 2;
	  //清除页面当中所有的定时器
	  // 网页加载完成后,创建的所有定时器id是递增的,只要获取到最后一个定时器的id,就能遍历得到所有的定时器id,通过id删除对应的定时器即可
	  var timerId = setInterval(function(){},1);
	  for (var i = 1;i <= timerId;i++) {
	  	clearInterval(i);//清除每个id对应的定时器
	  }
	  // 显示当前得分和历史最高分
	  currentScore.innerHTML = scoreNum;
	  //显示最高分 使用本地存储
	  if (localStorage.bestS) {
	  	//获取本地存储的最高分和当前得分对比，获取最高值
		localStorage.bestS = localStorage.bestS > scoreNum ? localStorage.bestS : scoreNum;
		bestScore.innerHTML = localStorage.bestS;
	  } else{
	  	//第一次玩游戏，当前得分就是最高分
		localStorage.bestS = scoreNum;
		//显示最高分
		bestScore.innerHTML = scoreNum;
	  }
	 wrapGame.onclick = null;//清除点击事件
}



var index = 0;
function grassMove(){
	index += 2;
	if (index >= wrapGame.offsetWidth) {
		index = 0;//切换到第一张
	}
	grass.style.left = -index + "px";
}