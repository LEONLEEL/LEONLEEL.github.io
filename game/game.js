var audioSnowing =new Audio('snowing.mp3');
var audioBackground = new Audio('background.mp3');
var buttons = document.querySelectorAll('button');
var audioButton = new Audio('button.mp3')
    buttons.forEach(function(button) {
     button.addEventListener('click', function() {
       audioButton.play();
     });
    });

document.getElementById("playBtn").onclick = function() {
    throwCookie() 
    snowing();
    startCountdown();
    document.getElementById("startPopup").style.display = "none";
};

document.getElementById("ruleBtn").onclick = function() {
    document.getElementById("rulePopup").style.display = "block";
};

document.getElementById("ruleCloseBtn").onclick = function() {
    document.getElementById("rulePopup").style.display = "none";
};

var gameArea = document.getElementById('gameArea');
var score = document.getElementById('score');
var playButton = document.getElementById('playBtn');
    playButton.addEventListener("click",function(){
       generateGhosts()
       audioBackground.play();
       audioBackground.loop=true;
    })

var rankBtn = document.getElementById('rankBtn');
    rankBtn.addEventListener("click",function(){
     document.body.appendChild(rankList);
     rankList.style.zIndex = 1;
       updateRankList();
       rankList.style.display = 'block';
    })

var stopCreatePoluo = null
// 生成魄罗
function generateGhosts() {
   var initialGhosts = 10; // 初始魄罗数量
   var minDuration = 2000; // 最少出现时间（毫秒）
   var maxDuration = 10000; // 最多出现时间（毫秒）

   var gameAreaRect = gameArea.getBoundingClientRect();
   const ghosts = []
   const removeTimes = []
   for (var i = 0; i < initialGhosts; i++) {
       var ghost = document.createElement('div');
       ghost.className = 'ghost';
       ghost.style.left = Math.random() * 2500 + 'px'; // 随机生成魄罗的横坐标
       ghost.style.top = Math.random() * 1300 + 'px'; // 随机生成魄罗的纵坐标
       gameArea.appendChild(ghost);
       ghosts.push(ghost)
       moveGhost(ghost)
       var appearanceTime = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
       removeTimes.push(appearanceTime)
    }

   let counter = 0
   for(let i = 0; i < ghosts.length; i++){
       let g = ghosts[i]
       setTimeout(function(){
           if(g.parentNode !== null){
               gameArea.removeChild(g)
           }    
       }, removeTimes[i])
    }

   stopCreatePoluo =  setInterval(function(){
       var createTime = Math.random()
       if(createTime < 0.8){
           var ghost = document.createElement('div');
           ghost.className = 'ghost';
           ghost.style.left = Math.random() * 2500 + 'px'; // 随机生成魄罗的横坐标
           ghost.style.top = Math.random() * 1300 + 'px'; // 随机生成魄罗的纵坐标
           gameArea.appendChild(ghost);
           ghosts.push(ghost)
           moveGhost(ghost)
           var appearanceTime = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
           removeTimes.push(appearanceTime)
           setTimeout(function(){
               if(ghost.parentNode !== null){
                   gameArea.removeChild(g)
               }

           }, appearanceTime)
        }
    }, 150)
   
   throwCookie();
}

var speed = 2.5
// 定义魄罗移动
function moveGhost(g) {
   var ghosts = document.getElementsByClassName('ghost');
   var gameAreaRect = gameArea.getBoundingClientRect();
   var ghost = g;
   var currentX = parseFloat(ghost.style.left) || gameAreaRect.width / 2;
   var currentY = parseFloat(ghost.style.top) || gameAreaRect.height / 2;
   var angle = Math.random() * 2 * Math.PI;
   function animate() {
       var deltaX = Math.cos(angle) * speed;
       var deltaY = Math.sin(angle) * speed;
       currentX += deltaX;
       currentY += deltaY;
       ghost.style.left = currentX + 'px';
       ghost.style.top = currentY + 'px';
       if (currentX < gameAreaRect.left-5|| currentX > gameAreaRect.right-200|| currentY < gameAreaRect.top+10|| currentY > gameAreaRect.bottom-200) {
           ghost.remove(); // 如果魄罗接触到边框，将其从游戏区域中移除
           return;
       }
       requestAnimationFrame(animate);
   }
   animate();
}

// 投掷饼干
var duration = 1000;
var probability = 0.4;
function throwCookie() {
   var lastThrowTime = 0; // 记录上次投掷饼干的时间

   gameArea.onclick = function(event) {
       var currentTime = Date.now();
       if (currentTime - lastThrowTime < 1000) {
           return; // 如果距离上次投掷的时间不足1秒，不进行投掷
       }
       lastThrowTime = currentTime;
       remainingCookies -= 1
       updateScoreAndCount(score)
       var cookie = document.createElement('div');
       cookie.className = 'cookie';
       cookie.style.left = gameArea.offsetWidth / 2; // 设置饼干的初始位置为游戏画面的中心
       cookie.style.top = gameArea.offsetHeight; // 设置饼干的初始位置为游戏画面的底部
       gameArea.appendChild(cookie);

       var comStyle = getComputedStyle(gameArea)
       var targetX = event.clientX - gameArea.offsetLeft; // 获取鼠标点击位置的横坐标
       var targetY = event.clientY - gameArea.offsetTop; // 获取鼠标点击位置的纵坐标

       // 设置饼干的动画时长为1秒
       var startTime = Date.now(); // 记录动画开始的时间
       
       function animate() {
           var currentTime = Date.now(); // 获取当前时间
           var elapsedTime = currentTime - startTime; // 计算已经过去的时间

           // 在终点处判定是否和魄罗相接触
           if (elapsedTime >= duration) {
               const ghosts = document.querySelectorAll('.ghost')
               for(let i = 0; i < ghosts.length; i++){
                   const ghost = ghosts[i]
                   if (checkCollision(cookie, ghost)) {
                           var audio =new Audio('hit.mp3');
                           audio.play();                    
                       const success = Math.random()
                       if(success < probability){
                           var audio =new Audio('success.mp3');
                           audio.play();    
                           // 魄罗消失
                           gameArea.removeChild(ghost);
                           gameArea.removeChild(cookie);
                           // 魄罗重新生成
                           generateNewDemon(cookie, ghost);
                           // 增加积分
                           updateScoreAndCount(score+=5)
                        }
                    }
                }
               // 动画结束，移除饼干
               gameArea.removeChild(cookie);
               return;
            }

           var progress = elapsedTime / duration; // 计算动画进度（0到1之间的值）
           var currentX = (targetX - 1250) * progress + 1250; // 计算当前横坐标
           var currentY = (targetY - 1180) * progress + 1180; // 计算当前纵坐标，使其符合抛物线运动规律

           cookie.style.left = currentX + 'px'; // 更新饼干的横坐标
           cookie.style.top = currentY + 'px'; // 更新饼干的纵坐标
           
           requestAnimationFrame(animate); // 递归调用自身，实现动画效果
        }
       animate(); // 开始执行动画
    };
}

function checkCollision(element1, element2) {
   const rect1 = element1.getBoundingClientRect();
   const rect2 = element2.getBoundingClientRect();

   return !(
   rect1.top > rect2.bottom ||
   rect1.bottom < rect2.top ||
   rect1.left > rect2.right ||
   rect1.right < rect2.left
   );
}

function generateNewDemon(cookie, ghost) {
   const demon = document.createElement('div');
   demon.className = 'cookiepoluo';
   gameArea.appendChild(demon);

   let currentX = parseInt(cookie.style.left, 10)
   let currentY = parseInt(cookie.style.top, 10)
   let x = currentX;
   let y = currentY;

   var targetX = 2500;
   var targetY = 1300;

   let dx = (targetX-currentX)/200; // X轴方向的速度
   let dy = (targetY-currentY)/200; // Y轴方向的速度

   function moveDemon() {
       x += dx;
       y += dy;

       demon.style.left = x + 'px';
       demon.style.top = y + 'px';

       const gameAreaWidth = gameArea.offsetWidth;
       const gameAreaHeight = gameArea.offsetHeight;

       if (x + demon.offsetWidth > gameAreaWidth || y + demon.offsetHeight > gameAreaHeight) {
       // 魄罗接触到游戏区域边缘，消失
          gameArea.removeChild(demon);
        } else {
          requestAnimationFrame(moveDemon);
        }
    }
    moveDemon();
}

// 添加计时器元素
var timer = document.createElement('div');
timer.id = 'timer';
gameArea.appendChild(timer);

// 添加计分版元素
var scoreBoard = document.createElement('div');
scoreBoard.id = 'scoreBoard';
gameArea.appendChild(scoreBoard);

// 添加计数板元素
var cookieCount = document.createElement('div');
cookieCount.id = 'cookieCount';
gameArea.appendChild(cookieCount);

// 设置初始游戏时长、积分和饼干数量
var gameDuration = 150; 
var score = 0;
var remainingCookies = 50;

// 点击“PLAY”按钮后开始倒计时
function startCountdown() {
   var remainingTime = gameDuration;
   var countdownInterval = setInterval(function() {
       remainingTime--;
       timer.textContent = '剩余时间：' + remainingTime + '秒';

       if (remainingTime <= 0 || remainingCookies <= 0) {
           clearInterval(countdownInterval);
           endGame();
        }
    }, 1000);
}

// 创建积分排行榜
var rankList = document.createElement('div');
    rankList.id = 'rankList';
    rankList.style.display = 'none';
    document.body.appendChild(rankList);


function endGame() {
   clearInterval(stopCreatePoluo)
   clearInterval(createSnowFlake)
   audioSnowing.pause();
   const ghosts = document.querySelectorAll('.ghost')
   for(let i = 0; i < ghosts.length; i++){
       gameArea.removeChild(ghosts[i]); 
   }
   const reds = document.querySelectorAll('.red')
   for(let i = 0; i < reds.length; i++){
       gameArea.removeChild(reds[i]); 
   }
   const yellows = document.querySelectorAll('.yellow')
   for(let i = 0; i < yellows.length; i++){
       gameArea.removeChild(yellows[i]); 
   }
   const greens = document.querySelectorAll('.green')
   for(let i = 0; i < greens.length; i++){
       gameArea.removeChild(greens[i]); 
   }
   const blues = document.querySelectorAll('.blue')
   for(let i = 0; i < blues.length; i++){
       gameArea.removeChild(blues[i]); 
   }
   
   gameArea.onclick = null

   // 游戏结束的逻辑
   var popup = document.createElement('div');
   popup.className="popup"

   var gameOver = document.createElement('h1');
   gameOver.innerHTML = "GAMEOVER"
   popup.appendChild(gameOver)

   // 显示游戏积分
   var scoreText = document.createElement('h1');
   scoreText.innerHTML = '获得的游戏积分：' + score;
   popup.appendChild(scoreText);

   // 创建重新开始游戏按钮
   var againButton = document.createElement('button');
   againButton.className="btn"
   againButton.innerHTML = 'AGAIN';

   var ruleAgainBtn = document.createElement('button');
   ruleAgainBtn.className='btn';
   ruleAgainBtn.innerHTML = 'RULE';
   ruleAgainBtn.addEventListener('click', function() {
       document.getElementById("rulePopup").style.display = "block";
       audioButton.play();
   });


   // 存储每一次的游戏积分
   var scores = JSON.parse(localStorage.getItem('scores')) || [];
   // 如果分数数组长度小于10 或者 新分数比最小的分数大，就存储新的分数
   if (scores.length < 10 || score > Math.min(...scores)) {
   if (scores.length === 10) {
       scores.splice(scores.indexOf(Math.min(...scores)), 1); // 移除最小的分数
   }
   scores.push(score);
   scores.sort(function(a, b) { return b - a; }); // 降序排列
   localStorage.setItem('scores', JSON.stringify(scores));
   }

   againButton.addEventListener('click', function() {
     // 重新开始游戏的逻辑
     // 这里可以写重新开始游戏的代码      
       startCountdown();
       generateGhosts();
       snowing();
       remainingCookies = 50;
       score = 0;
       updateScoreAndCount(score);
       document.body.removeChild(popup);
       document.body.removeChild(rankList);
    });
   
   // 创建打开游戏积分排行榜按钮
   var rankButton = document.createElement('button');
       rankButton.className= "btn";
       rankButton.innerHTML = 'RANK';
       rankButton.addEventListener('click', function() {
         // 打开游戏积分排行榜的逻辑
         // 这里可以写打开游戏积分排行榜的代码
         document.body.appendChild(rankList);
         updateRankList();
         audioButton.play();
         rankList.style.display = 'block';
        });

        popup.appendChild(againButton);
        popup.appendChild(rankButton);
        popup.appendChild(ruleAgainBtn);

        // 将弹出窗口添加到游戏区域中
        document.body.appendChild(popup);
}

// 更新积分排行榜
function updateRankList() {
   var scores = JSON.parse(localStorage.getItem('scores')) || [];
   scores.sort(function(a, b) { return b - a; }); // 降序排列
   rankList.innerHTML = '';
   for (var i = 0; i < scores.length; i++) {
       var scoreText = document.createElement('p');
       scoreText.className = 'ranktext';
       scoreText.innerHTML = '第' + (i + 1) + '名：' + scores[i];
       rankList.appendChild(scoreText);
    }
       var closeButton = document.createElement('button');
       closeButton.innerHTML = "返回";
       rankList.appendChild(closeButton)

       closeButton.addEventListener('click',function(){
           rankList.style.display = 'none';
           audioButton.play();
       })
}

// 更新计分版和计数板
function updateScoreAndCount(score) {
   scoreBoard.textContent = '游戏积分：' + score;
   cookieCount.textContent = '剩余饼干数量：' + remainingCookies;
}
  updateScoreAndCount(0)

var isGenerating = false;
function snowing(){
  createSnowFlake = setInterval(function() {
    // 如果正在生成样式，则直接返回，不进行判定
    if(isGenerating) return;

    // 判定成功
    if(Math.random() < 0.5) {
      
       audioSnowing.play();  
       // 开始生成样式
       isGenerating = true;
      // 在游戏区域上方添加一个雪花元素
       if (Math.random() < 0.25) {
           // 开始生成样式               
           function addYellow() {
               var yellow = document.createElement('div');
               yellow.className = 'yellow';
               // 设置雪花的初始位置和其他样式
               yellow.style.top = '0px';
               yellow.style.left = Math.random() * gameArea.offsetWidth + 'px';
               // 将雪花添加到游戏区域
               gameArea.appendChild(yellow);
               // 雪花运动到底部后消失
               var fallInterval = setInterval(function() {
                   yellow.style.top = yellow.offsetTop + 15 + 'px';
                   if (yellow.offsetTop >= gameArea.offsetHeight) {
                   clearInterval(fallInterval);
                   gameArea.removeChild(yellow);
                   }
               }, 40);                                                     
           }

           var createYellow = setInterval(addYellow, 300);
           duration = 300;
           // 五秒结束后，停止生成雪花，并重新开始每隔十秒的判定
           setTimeout(function() {
           clearInterval(createYellow);
           isGenerating = false;
           duration = 1000
           }, 10000);

       }else if(Math.random() >=0.25 && Math.random() < 0.5){
           function addRed() {
               var red = document.createElement('div');
               red.className = 'red';
               // 设置雪花的初始位置和其他样式
               red.style.top = '0px';
               red.style.left = Math.random() * gameArea.offsetWidth + 'px';
               // 将雪花添加到游戏区域
               gameArea.appendChild(red);
               // 雪花运动到底部后消失
               var fallInterval = setInterval(function() {
                   red.style.top = red.offsetTop + 15 + 'px';
                   if (red.offsetTop >= gameArea.offsetHeight) {
                   clearInterval(fallInterval);
                   gameArea.removeChild(red);
                   }
               }, 40);                                                     
           }

           var createRed = setInterval(addRed, 300);
           probability = 0.9;
           // 五秒结束后，停止生成雪花，并重新开始每隔十秒的判定
           setTimeout(function() {
           clearInterval(createRed);
           isGenerating = false;
           probability = 0.4;
           }, 10000);

       }else if(Math.random() >=0.5 && Math.random() < 0.75){
           function addBlue() {
               var blue = document.createElement('div');
               blue.className = 'blue';
               // 设置雪花的初始位置和其他样式
               blue.style.top = '0px';
               blue.style.left = Math.random() * gameArea.offsetWidth + 'px';
               // 将雪花添加到游戏区域
               gameArea.appendChild(blue);
               // 雪花运动到底部后消失
               var fallInterval = setInterval(function() {
                   blue.style.top = blue.offsetTop + 15 + 'px';
                   if (blue.offsetTop >= gameArea.offsetHeight) {
                   clearInterval(fallInterval);
                   gameArea.removeChild(blue);
                   }
               }, 40);                                                     
           }

           
           var createBlue = setInterval(addBlue, 300);
           speed = 1
           // 五秒结束后，停止生成雪花，并重新开始每隔十秒的判定
           setTimeout(function() {
               clearInterval(createBlue);
               isGenerating = false;
               speed = 2.5
           }, 10000);
       }else{
           function addGreen() {
               var green = document.createElement('div');
               green.className = 'green';
               // 设置雪花的初始位置和其他样式
               green.style.top = '0px';
               green.style.left = Math.random() * gameArea.offsetWidth + 'px';
               // 将雪花添加到游戏区域
               gameArea.appendChild(green);
               // 雪花运动到底部后消失
               var fallInterval = setInterval(function() {
                   green.style.top = green.offsetTop + 15 + 'px';
                   if (green.offsetTop >= gameArea.offsetHeight) {
                   clearInterval(fallInterval);
                   gameArea.removeChild(green);
                   }
               }, 40);                                                     
           }

           var createGreen = setInterval(addGreen, 300);
           updateScoreAndCount(remainingCookies+=10)
           function updateScoreAndCount(score) {
            scoreBoard.textContent = '游戏积分：' + score;
            cookieCount.textContent = '剩余饼干数量：' + remainingCookies;
           }
           // 五秒结束后，停止生成雪花，并重新开始每隔十秒的判定
           setTimeout(function() {
           clearInterval(createGreen);
           isGenerating = false;
           }, 10000);
       }
   }
},10000);
}