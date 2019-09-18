// 获取贪吃蛇所在的地图
var snakeMap = document.getElementById("snakeMap");
var score = document.getElementById("score");
//为了灵活的创建地图,将地图的行数和列数存储到变量中
var rowNumber = 24;//存储行数
var colNumber = 16;//存储列数
var smallDivW = 20;//每个小方格的宽高
// 地图的实际大小
snakeMap.style.width = smallDivW * colNumber + "px";
snakeMap.style.height = smallDivW * rowNumber + "px";
var divsSnake = [];//二维数组，用来存储地图上所有位置的表格 （为了获取div所在的位置） divsSnake[1][0]
var rowArr;
//使用双层for循环
for (var i = 0;i < rowNumber;i++) {
	//创建行所在的div  每行的div插入到该行 div中
	var rowDiv = document.createElement("div");
	rowDiv.style.height = smallDivW + "px";
	// rowDiv.className = "row";
	snakeMap.appendChild(rowDiv);
	//创建一个数组，用来存储每一行的所有表格
	rowArr = [];
	for (var j = 0;j < colNumber;j++) {
		//创建每行中的小方格div
		var colDiv = document.createElement("div");
		colDiv.style.width = smallDivW + "px";
		colDiv.style.height = smallDivW + "px";
		colDiv.className = "col";
		//将改行的div插入到改行的rowdiv中
		rowDiv.appendChild(colDiv);
		// 将该行的表格添加到改行数组中
		rowArr.push(colDiv);
	}
	//最后将行数组里的div全部添加到二维数组中
	divsSnake.push(rowArr);
}
console.log(divsSnake);
//创建数组,存储蛇身所占的div  默认第一行,前三个是蛇身
var snakeBodys = [];
for (var i = 0;i < 3;i++) {
	snakeBodys.push(divsSnake[0][i]);
	//或者
	// snakeBodys[i] = divsSnake[0][i];
	// 设置蛇身的颜色
	divsSnake[0][i].className = "moveSnake col";
}
//设置一个变量,用来存储蛇移动的方向
// 假设 left right top bottom 分别代表四个方向
var directionSnake = "right";
//添加键盘事件,通过按键的上,下,左,右方向,控制蛇移动的方向
document.onkeydown = function (e){
	var event1 = window.event || e;
	//判断几个特殊情况，为了合理性  蛇头和蛇尾不能交换方向
	// 蛇向右移动,不能点击左按钮,直接return即可
	if (directionSnake == "right" && event1.keyCode == 37) {
		return;//提前终止函数的执行
	}else if (directionSnake == "left" && event1.keyCode == 39) {
		return;//提前终止函数的执行
	}else if (directionSnake == "top" && event1.keyCode == 40) {
		return;//提前终止函数的执行
	}else if (directionSnake == "bottom" && event1.keyCode == 38) {
		return;//提前终止函数的执行
	}
	//点击不同的按键，重新设置蛇移动的方向
	switch (event1.keyCode){
		case 37:{
			directionSnake = "left";
			break;
		}
		case 38:{
			directionSnake = "top";
			break;
		}
		case 39:{
			directionSnake = "right";
			break;
		}
		case 40:{
			directionSnake = "bottom";
			break;
		}
		default:
			break;
	}
	console.log(directionSnake);
}

// //移动端中的轻扫手势
// touch.on(document,"touchstart",function (e){
// 	var event1 = window.event || e;
// 	event1.preventDefault();
// })
// // 右轻扫
// touch.on(document,"swiperight",function (){
// 	if (directionSnake == "left") {
// 		return;
// 	}
// 	directionSnake = "right";
// })
// 
// touch.on(document,"swipeleft",function (){
// 	if (directionSnake == "right") {
// 		return;
// 	}
// 	directionSnake = "left";
// })
// 
// touch.on(document,"swipeup",function (){
// 	if (directionSnake == "bottom") {
// 		return;
// 	}
// 	directionSnake = "top";
// })
// 
// touch.on(document,"swipedown",function (){
// 	if (directionSnake == "top") {
// 		return;
// 	}
// 	directionSnake = "bottom";
// })


//存储蛇头所在的位置坐标  -- 默认第一行,第三列单元格
var x = 2;
var y = 0;
var foodX = 0;
var foodY = 0;//记录随机食物所在的位置
//处理蛇的移动
var scoreNum = 0;//存储得分
var timerMove = setInterval(function (){
	//判断蛇移动的方向，从而设置移动的位置
	switch (directionSnake){
		case "left":{//向左移动
			x--;
			break;
		}
		case "right":{//向右移动
			x++;
			break;
		}
		case "top":{//向上移动
			y--;
			break;
		}
		case "bottom":{//向下移动
			y++;
			break;
		}
		default:
			break;
	}
	//为了合理性，判断蛇碰到墙壁就gameover
	if (x < 0 || y < 0 || x >= colNumber || y >= rowNumber) {
		//清除蛇移动的定时器
		clearInterval(timerMove);
		alert("蛇碰壁，gameover");
		return;//终止
	}
	//如果蛇即将移动的位置div，是蛇之前的身体所在的div，则游戏结束 --- 吃到身体
	for (var i = 0;i < snakeBodys.length;i++) {
		//此时蛇身div和移动蛇头div对比，如果是同一个，则吃到身体
		if (snakeBodys[i] == divsSnake[y][x]) {
			//清除蛇移动的定时器
			clearInterval(timerMove);
			alert("蛇吃到身体，gameover");
			return;//终止
		}
	}
	//设置蛇身长度移动的过程  div
	//如果蛇吃到食物，则蛇头和食物位置一致
	if (foodX == x && foodY == y) {//吃到食物
		  //蛇头所在的div颜色
		  divsSnake[y][x].className = "moveSnake col";
		  // 蛇头所在的div添加到蛇身数组中
		  snakeBodys.push(divsSnake[y][x]);
		  //继续随机食物
		  randomFoods();
		  scoreNum++;
		  score.innerHTML = scoreNum;
	} else{//没有吃到食物
		snakeBodys[0].className = "col";//设置蛇尾的颜色
		// 删除蛇尾div
		snakeBodys.shift();//删除头部第一个div
		//蛇头所在的div颜色
		divsSnake[y][x].className =  "moveSnake col";
		// 蛇头所在的div添加到蛇身数组中
		snakeBodys.push(divsSnake[y][x]);
	}
	
},200)



function random(m,n){
	return Math.floor(Math.random() * (n - m + 1) + m);
}
//随机食物
function randomFoods(){
	//随机行所在的下标
	foodY = random(0,rowNumber - 1);
	//列下标
	foodX = random(0,colNumber - 1);
	//随机的食物位置此时是蛇身所在的div，则重新随机食物，直到随机出不在蛇身位置为止；
	if (divsSnake[foodY][foodX].className == "moveSnake col") {
		randomFoods();//重新随机食物位置
	} else{
		//设置食物所在的位置div颜色 --- 食物方格
		divsSnake[foodY][foodX].className = "food col";
	}
}

randomFoods();