let sw = 20,            // 一个方块的宽度
  sh = 20,            // 一个方块的高度
  tr = 30,            // 行数
  td = 30;            // 列数

let snake = null,       // 蛇的实例
  food = null,        // 食物的实例 
  game = null;        // 游戏的实例


// 方块的类
class Square {
  constructor(x, y, classname) {
    // 0, 0
    // 20, 0
    // 40, 0

    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;

    // 定义方块对应的DOM元素
    this.viewContent = document.createElement('div')
    this.viewContent.className = this.class;

    // 获取方块的父级
    this.parent = document.getElementsByClassName('snakeWrap')[0];
  }

  // 创建方块的DOM并添加到页面中的类
  create() {
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.height = this.sh + 'px';
    this.viewContent.style.width = this.sw + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';

    this.parent.appendChild(this.viewContent);
  }

  // 移除DOM元素的方法
  removeDom() {
    this.parent.removeChild(this.viewContent);
  }

}




// 蛇的类
class Snake {
  constructor() {
    // 初始化蛇头的信息
    this.head = null;

    // 初始化蛇尾的信息
    this.tail = null;

    // 初始化蛇身上的每个方块的位置(二维数组)
    this.pos = [];

    // 初始化蛇走的方向
    this.directionNum = {
      left: {
        x: -1,
        y: 0,
        rotate: 135,
      },

      right: {
        x: 1,
        y: 0,
        rotate: -45,
      },

      up: {
        x: 0,
        y: -1,
        rotate: -135,
      },

      down: {
        x: 0,
        y: 1,
        rotate: 45,
      },
    }
  }


  init() {

    // 创建蛇头
    let snakeHead = new Square(2, 0, 'snakeHead');
    snakeHead.create();

    // 保存蛇头的信息
    this.head = snakeHead;

    // 保存蛇头的位置
    this.pos.push([2, 0]);


    // 创建第一节蛇身体
    let snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();

    // 保存蛇身1的位置
    this.pos.push([1, 0]);


    // 创建第二节蛇身体
    let snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();

    // 保存蛇尾得信息
    this.tail = snakeBody2;

    // 保存蛇身2的位置
    this.pos.push([0, 0]);



    // 形成链表关系
    snakeHead.front = null;
    snakeHead.after = snakeBody1;

    snakeBody1.front = snakeHead;
    snakeBody1.after = snakeBody2;

    snakeBody2.front = snakeBody1;
    snakeBody2.after = null;


    // 给蛇一个默认走的方向
    this.direction = this.directionNum.right;
  }



  // 获取蛇头下一个坐标，根据这个坐标检测各种情况的碰撞
  getNextPos() {
    let nextPos = [
      this.head.x / sw + this.direction.x,
      this.head.y / sh + this.direction.y
    ];


    // 根据蛇头的下一个点的坐标是否与蛇自身的坐标相同来判断是否碰撞
    // 默认标记没有任何碰撞
    let isCollied = false;
    this.pos.forEach( function (value)  {
      if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
          isCollied = true;

          snake.die.call(snake);

          return;
        
      }
    })


    // 检测是否碰墙
    if (nextPos[0] < 0 ||               // 左墙
        nextPos[0] > td - 1 ||          // 右墙
        nextPos[1] < 0 ||               // 上墙
        nextPos[1] > tr - 1) {          // 下墙

      this.die.call(this);
      isCollied = true;
      return;
    }


    // 检测是否碰撞食物
    if (food && nextPos[0] == food.pos[0] && nextPos[1] == food.pos[1]) {
      this.eat.call(this);
    }


    // 无任何碰撞
    if (!isCollied) {
      this.move.call(this);
    }
  }



  // 处理各种碰撞后要做的事
  // 正常运动
  move(format) {

    // 在旧蛇头的位置创建一个新的一节蛇身
    let newBody = new Square(this.head.x / sw, this.head.y / sh, 'snakeBody');

    // 更新新蛇身的链表
    newBody.after = this.head.after;
    newBody.after.front = newBody
    newBody.front = null;

    // 移除旧蛇头
    this.head.removeDom();

    // 将新蛇身插入到页面中
    newBody.create();



    // 在蛇头要走的下一个位置创建一个新蛇头
    let newHead = new Square(this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, 'snakeHead')

    // 更新新蛇头的链表
    newHead.front = null;
    newHead.after = newBody;
    newBody.front = newHead;

    // 调整蛇头的css样式
    newHead.viewContent.style.transform = 'rotate(' + this.direction.rotate + 'deg)';


    // 更新蛇身上的位置坐标
    this.pos.unshift([this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]);

    // 将蛇头插入到页面中
    newHead.create();

    // 更新蛇头信息
    this.head = newHead;



    // 除吃之外都要删除蛇尾
    if (!format) {

      // 删除页面的蛇尾元素
      this.tail.removeDom();

      // 更新蛇尾链表
      this.tail = this.tail.front;

      // 删除蛇尾坐标
      this.pos.pop();
    }
  }

  // 碰撞食物
  eat() {
    this.move.call(this, true);

    creatFood();

    score++;

    oScore.innerHTML = '分数：' + score;
  }


  // 碰撞自身或墙壁
  die() {
    game.over();
  }
}



// 创建食物的方法
creatFood = function () {

  // 食物的坐标
  let x = null;
  let y = null;

  // while循环跳出的条件（食物在蛇的身上，继续循环）
  let include = true;
  while (include) {

    // 随机食物坐标
    x = Math.round(Math.random() * (td - 1));
    y = Math.round(Math.random() * (tr - 1));


    // 如果随机的坐标在蛇身上，跳出find循环得到坐标值
    include = snake.pos.find(function (value) {

      return x == value[0] && y == value[1];

    })
  }


  food = new Square(x, y, 'food');

  // 保存当前食物的坐标
  food.pos = [x, y];

  let foodDom = document.getElementsByClassName('food')[0];
  if (foodDom) {
    foodDom.style.left = x * sw + 'px';
    foodDom.style.top = y * sh + 'px';
  } else {
    food.create();
  }
}



// 游戏逻辑的类
class Game {
  constructor() {
    this.timer = null;
  }

  // 设置游戏难度相关
  diff() {
    let oDifDiv = oDiff.getElementsByTagName('button');
    [...oDifDiv].forEach(function (dom) {
      dom.onclick = function (e) {
        let str = dom.innerHTML;
  
        switch (str) {
          case '新手':
            time = 300;
            break;
  
          case '简单':
            time = 200;
            break;
  
          case '困难':
            time = 150;
            break;
  
          case '地狱':
            time = 100;
            break;
  
        }
        startBtnB.parentNode.style.display = 'block';
        e.target.parentNode.innerHTML = str;
  
      }
  
    })

  }


  // 初始化游戏
  init() {
    snake.init();

    creatFood();

    // 绑定键盘事件
    document.onkeydown =  (event) => {

      // 给键盘事件节流
      let newTime = new Date().getTime();

      if (newTime - lastTime > 280) {
        // 左键
        if (event.which == 37 && snake.direction != snake.directionNum.right) {

          snake.direction = snake.directionNum.left;

          // 右键
        } else if (event.which == 39 && snake.direction != snake.directionNum.left) {

          snake.direction = snake.directionNum.right;

          // 上键
        } else if (event.which == 38 && snake.direction != snake.directionNum.down) {

          snake.direction = snake.directionNum.up;

          // 下键
        } else if (event.which == 40 && snake.direction != snake.directionNum.up) {

          snake.direction = snake.directionNum.down;

        }
        
        lastTime = newTime;
      } 
    }

    this.start();
  }


  // 开始游戏
  start() {
    this.timer = setInterval(function () {
      
      snake.getNextPos();

    }, time)
  }


  // 游戏结束
  over() {
    clearInterval(this.timer);
    alert('游戏结束，分数为' + score);

    // 撞墙后游戏回到最初始状态
    snakeWrap.innerHTML = '';

    snake = new Snake();
    game = new Game();
    let startBtn = document.querySelector('.startBtn');
    startBtn.style.display = 'block';

    oDiff.innerHTML = `
      <button>新手</button>
      <button>简单</button>
      <button>困难</button>
      <button>地狱</button>`;

    this.diff();
    startBtnB.parentNode.style.display = 'none';

    // 取消暂停按钮的点击事件
    snakeWrap.onclick = null;

    score = 0;
    oScore.innerHTML = '分数：' + score;
  }
}

// 开启游戏
snake = new Snake();
game = new Game();

let startBtnB = document.getElementsByClassName('startBtn')[0].getElementsByTagName('button')[0];
let stopBtnB = document.getElementsByClassName('stopBtn')[0].getElementsByTagName('button')[0];
let snakeWrap = document.getElementsByClassName('snakeWrap')[0];
let oScore = document.getElementsByClassName('score')[0];
let oDiff = document.getElementsByClassName('diff')[0];

// 定义设置游戏难度方法
let time = null;

// 在页面显示游戏初始得分
let score = 0;

// 防止控制方向按钮按得太快
let lastTime = 0;

startBtnB.parentNode.style.display = 'none';
startBtnB.onclick = function () {

  // 拿掉遮罩层
  startBtnB.parentNode.style.display = 'none';
  game.init();

  // 绑定暂停按钮的点击事件
  snakeWrap.onclick = function () {
    clearInterval(game.timer);
    stopBtnB.parentNode.style.display = 'block';
  }
  stopBtnB.onclick = function () {

    game.start();
    stopBtnB.parentNode.style.display = 'none';
  }
}

// 初始化游戏前先调用选择游戏难度方法
game.diff();


