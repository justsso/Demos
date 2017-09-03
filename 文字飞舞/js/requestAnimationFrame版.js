var goDown = document.getElementById("godown");
var goUp = document.getElementById("goup");
var up = document.getElementById("up");
var down = document.getElementById("down");

var text = "飘洒着更为朦胧的灯光这是谁的人间这是谁的忧伤他在春风化雨的路上独自却又舍不得轻轻的轻轻的流浪桃花笑了十里十里又是十里的红妆";
var str = "";
for(var i = 0; i < text.length; i++) {
	str += '<span>' + text[i] + '</span>'
}

up.innerHTML = str;
var span = document.getElementsByTagName('span');
var width = parseFloat(up.clientWidth); //不包括border,包括内容+padding

var sfontSize = parseFloat(getComputedStyle(span[0], null)['fontSize']);

var count = Math.floor(width / sfontSize);

for(var i = 0; i < text.length; i++) {
	span[i].style.top = Math.floor(i / count) * sfontSize + 'px';
	span[i].style.left = i % count * sfontSize + 'px';
}

//算出上下两个块的  x y 差, 每一个span的left 和top 分别加上x差  y 差

var upL = getLeft(up);
var upT = getTop(up);
var downL = getLeft(down);
var downT = getTop(down);
var chaL = downL - upL; //x轴上的差值
var chaT = downT - upT; //y轴上的差值
var num = 0;
var timer = null;
goDown.onclick = function() {
	if (num%2==0) {  //0 2 4 6 8 10 12 14 16
		var timer = null;
		num++;
	
		requestAnimationFrame(function(){
			cancelAnimationFrame(timer);
			
		});

		for(var i = 0; i < span.length; i++) {
			setTimeout((function(num) {
				return function() {
					doMove('down',span[num]);
					
				};
			})(i), 60*i);
		
		}
		
	}else {
		alert('不能连续点击两次向下按钮哦~');
		return ;
	}
}
goUp.onclick = function(){
	if (num%2==1) {
		num++;
		var timer = null;
		for(var i = 0; i < span.length; i++) {
			setTimeout((function(num) {
				return function() {
					doMove('up',span[num]);
				};

			})(i), 60*i);		
		}	
	}else {
		alert('不能连续两次点击向上按钮哦~');
		return ;
	}
}

//requestAnnimationFrame的兼容性写法
//动画循环，兼容各大浏览器
window.requestAnimationFrame = (
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    }
); 

//window.requestAnimationFrame = (
//	window.webkitRequestAnimationFrame ||
//	window.mozRequestAnimationFrame ||
//	window.msRequestAnimationFrame||
//	window.oRequestAnimationFrame ||
//	function(callback){
//		return window.setTimeout(callback,1000 / 60);
//	}
//);
//window.cancelAnimationFrame = (
//	window.webkitCancelAnimationFrame||
//	window.mozCancelAnimationFrame ||
//	window.msCancelRequestAnimationFrame ||
//	window.oCancelRequestAnimationFrame ||
//	function(id) {   
//  	clearTimeout(id); 
// }
//);


function doMove(dir, obj) {
	var oldLeft = parseFloat(getComputedStyle(obj, null)['left']);
	var oldTop = parseFloat(getComputedStyle(obj, null)['top']);
	if(dir == 'down') {
		var tarL = oldLeft + chaL;
		var tarT = oldTop + chaT;
	} else {
		var tarL = oldLeft - chaL;
		var tarT = oldTop - chaT;
	}
	move(obj, {
		'left': tarL,
		'top': tarT
	}, 300);
}
//获取顶点距离屏幕左上角的 x轴 距离
function getLeft(e) {
	var offsetL = e.offsetLeft;
	var parent = e.offsetParent; //找到它有定位的父元素
	while(parent != null) {
		offsetL += parent.offsetLeft; //offsetLeft返回该元素相对于最近的有定位的父元素的距离
		parent = parent.offsetParent;
	}
	return offsetL;
}

//获取顶点距离屏幕左上角的 y轴 距离
function getTop(e) {
	var offsetT = e.offsetTop;
	var parent = e.offsetParent;
	while(parent != null) {
		offsetT += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return offsetT;
}

function move(obj, j, duration, fn, ease) {
	var ease = ease || "linear"
	var oldTime = new Date().getTime();
	var d = duration;
	var s = {};
	for(var attr in j) {
		s[attr] = {};
		s[attr].b = parseFloat(getComputedStyle(obj)[attr]);
		s[attr].c = j[attr] - s[attr].b;
	}
	//	console.log(s);
	obj.timer = setInterval(function() {
		var t = new Date().getTime() - oldTime;
		if(t >= d) {
			t = d
		}
		for(var attr in s) {
			var c = s[attr].c;
			var b = s[attr].b;
			var v = Tween[ease](t, b, c, d); //计算当前值
			if(attr == "opacity") {
				obj.style[attr] = v;
			} else {
				obj.style[attr] = v + "px";
			}
		}
		if(t == d) {

			clearInterval(obj.timer);
			fn && fn();
		}
	}, 16)
	//大多数屏幕的刷新频率是60次/秒,1000/60 = 16ms, 如果时间大于这个16ms就会出现卡顿 
//优化方法时用requestAnimationFrame



}