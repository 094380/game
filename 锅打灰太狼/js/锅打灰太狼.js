//文档加载成功之后触发的函数
window.onload = function (){
	//随机函数
	function random(m,n){
		return Math.floor(Math.random()*(n - m + 1) + m);
	}
	//分数对象
	var scoring = document.getElementById("scroing");
	//倒计时对象
	var countDown = document.getElementById("countDown");
	//获取所有灰太狼或者小灰灰的父级div
	var wolfs = document.getElementById("wolfs");
	//开始菜单
	var menu = document.getElementById("menu");
	//结束菜单
	var gameOver = document.getElementById("gameOver");
	//开始按钮
	var startBtn = document.getElementById("start");
	var countDownWidth = countDown.offsetWidth;//倒计时图片的宽度
	var timer;
	function dealcountDown(){
		timer = setInterval(function(){
			countDownWidth -= 2;
			if(countDownWidth < 0){
				//清除倒计时定时器
				clearInterval(timer);
				//游戏结束的操作
				gameOver.style.display = "block";
				clearInterval(createWolfTimer);//清楚随机狼出现的定时器
				
			}
			countDown.style.width = countDownWidth + "px";
		},100);
	}
	var createWolfTimer;//存储创建狼的定时器
	//灰太狼随机出现的位置,使用数组来存储对应关系的数据 -- 出现的位置
	  //随机出现以下9个位置
	  var arrPosi = [{
					l: "98px",
					t: "115px"
				}, {
					l: "17px",
					t: "160px"
				}, {
					l: "15px",
					t: "220px"
				}, {
					l: "30px",
					t: "293px"
				}, {
					l: "122px",
					t: "273px"
				}, {
					l: "207px",
					t: "295px"
				}, {
					l: "200px",
					t: "211px"
				}, {
					l: "187px",
					t: "141px"
				}, {
					l: "100px",
					t: "185px"
				}];
				
    var preIndex = -6;//记录上一次随机的位置下标
	//开始按钮的点击事件
	startBtn.onclick = function (){
		// 1.开始菜单隐藏
		menu.style.display = "none";
		//2.处理倒计时
		dealcountDown();
		//3.创建灰太狼或者小灰灰的定时器
		createWolfTimer = setInterval(function (){
			var wolf = document.createElement("img");
			//随机是灰太狼还是小灰灰 "h"   / "x"
			wolf.type = random(1,100) > 80 ? "x" : "h";
			// var a = random(2,8) * (random(0,1)>0 ? 1 : -1);
			//设置属性值，狼出现时的状态，第一张
			wolf.index = 0;
			//设置路径   "img/h0.png"
			wolf.src = "img/" + wolf.type + wolf.index + ".png";
			var resultBol = true;//代表是否继续随机，是否和上一次狼随机出现的位置一样
			var r = random(0,arrPosi.length - 1);//随机狼位置所在的下标
			while (resultBol){
				if (r == preIndex) {
					//说明和上一次的随机下标相同，继续随机下标
					 r = random(0,arrPosi.length - 1);
				} else{
					break;//不重复，跳出循环
				}
			}
			//将r下标对应的位置设置给创建的img节点
			wolf.style.left = arrPosi[r].l;
			wolf.style.top = arrPosi[r].t;
			//将wolf节点插入到wolfs节点中
			wolfs.appendChild(wolf);
			//狼上升的定时器
			wolf.upTimer = setInterval(function(){
				wolf.index++;
				if (wolf.index > 4) {
					clearInterval(wolf.upTimer);
					//启动狼下降的定时器
					wolf.downFn();
				}
				wolf.src = "img/" + wolf.type + wolf.index + ".png";
			},150);
			
			wolf.downFn = function (){
				wolf.downTimer = setInterval(function(){
					wolf.index--;
					if (wolf.index == 0) {
						clearInterval(wolf.downTimer);
						//移除狼所在的节点
						wolfs.removeChild(wolf);
					}
					wolf.src = "img/" + wolf.type + wolf.index + ".png";
				},150)
			}
			
			//记录狼点击的状态，假设true是未点击，只能点击一次该节点img
			wolf.clickBol = true;
			//添加点击事件
			wolf.onclick = function (){
				if (wolf.clickBol == false) {
					return;//提前终止函数的执行
				}
				wolf.clickBol = false;//每次点击之后，修改状态，表示已点击
				//清除上升和下降的定时器
				clearInterval(wolf.upTimer);
				clearInterval(wolf.downTimer);
				wolf.index = 5;//重置index为5，目的是为了处理击大动画
				//处理点击狼之后，执行的动画
				wolf.clickTimer = setInterval(function(){
					wolf.index++;
					if (wolf.index == 9) {
						clearInterval(wolf.clickTimer);
						//移除狼所在的节点
						wolfs.removeChild(wolf);
					}
					wolf.src = "img/" + wolf.type + wolf.index + ".png";
				},150)
				//处理得分还是失分
				if (wolf.type == "h") {//加10
					scoring.innerHTML = parseInt(scoring.innerHTML) + 10;
				} else{
					scoring.innerHTML = parseInt(scoring.innerHTML) - 10;
				}
			}
			
			
		//记录上一次的下标
			preIndex = r;
		},1000)
	}
}