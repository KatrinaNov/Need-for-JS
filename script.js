const score = document.querySelector('.score'),
    bestScore = document.querySelector('.best_score'),
    start = document.querySelector('.start'),
    level = document.querySelector('.level'),
    levelBtn = document.querySelectorAll('.level_btn'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    //music = document.createElement('audio')
    music = document.createElement('embed');

// добавление музыки
music.setAttribute('src', './music/audio.mp3');
music.setAttribute('type', 'audio/mp3');
music.classList.add('music');

car.classList.add('car');

// очистить предыдущие результаты
//localStorage.clear();

start.addEventListener('click', () => {
    if (!gameArea.classList.contains('hide')) {
        gameArea.classList.add('hide');
    }
    if (!score.classList.contains('hide')) {
        score.classList.add('hide');
    }    
    if (!bestScore.classList.contains('hide')) {
        bestScore.classList.add('hide');
    }    
    level.classList.remove('hide');
    start.classList.add('hide');
});

// ловим события нажатия на кнопки уровней и в зависимости от уровня меняем скорость и траффик
for (let i = 0; i<levelBtn.length; i++) {
    levelBtn[i].addEventListener('click', function(){
        setting.speed = 6;
        setting.traffic = 4;
        setting.speed = setting.speed + i*2;
        setting.traffic = setting.traffic - i;
        startGame();
    })
};

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowRight : false,
    ArrowLeft : false
};

const setting = {
    start: false,
    score: 0,
    bestScore: 0,
    speed: 6,
    traffic: 4
};
// сколько элементов можно поместить на страницу
function getQuantityElements(heightElement) {
    //высота нашей страницы document.documentElement.clientHeight
    return gameArea.offsetHeight / heightElement;
}

function startGame(){
    start.innerHTML='';
    // показываем счет и рекорд
    score.classList.remove('hide');
    bestScore.classList.remove('hide');
    // возвращаем начальные стили (как это сделать проще?)   
    score.classList.remove('score_result');    
    score.style.top = '';
    score.style.background = '';
    score.style.color = '';
    // показываем дорогу
    gameArea.classList.remove('hide');
    gameArea.innerHTML = '';    
    
// создаем линии на дороге
    for (let i = 0; i < getQuantityElements(100)+1; i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i*100) + 'px';
        line.y = i*100;
        gameArea.appendChild(line);
    }
    //машины соперников
    for (let i = 0; i< getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random()*4)+1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i+1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./img/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;    
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth;
    car.style.top = 'auto';
    car.style.bottom = '10px';

    gameArea.appendChild(music);
    // music.setAttribute('autoplay', true);
    // music.setAttribute('src', './music/audio.mp3');

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    //плавная анимация
    requestAnimationFrame(playGame);
}

function playGame(){    
    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML ='SCORE:<br>' + setting.score;
        bestScore.innerHTML ='BEST:<br>' + localStorage.getItem('score');
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x >0){
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y >0){
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
        else {
            music.remove();
        }
}

function startRun(event){
    event.preventDefault();
    //исключет другие клавиши, кроме стрелок
    if (keys.hasOwnProperty(event.key)){
        keys[event.key] = true;
    }    
}

function stopRun(event){
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)){
    keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
 // двигаем линии по дороге       
        line.y += setting.speed;
        line.style.top = line.y +'px';
// когда линии уехали далеко, возвращаем их в начало
        if (line.y >= gameArea.offsetHeight){
            line.y = -100;
        }
    });  
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        // получить параметры (размеры и координаты) объекта в виде объекта
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        //дтп
        if (carRect.top <= enemyRect.bottom &&   carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
            setting.start = false; //останавливаем игру
            start.classList.remove('hide'); // возвращаем полосу старта
            start.innerHTML='Упс, дтп!<br> Жми, чтобы начать заново!';
            start.style.background = 'crimson';
            score.style.top = start.offsetHeight;
            score.classList.add('score_result'); 
            // сохраняем результат, если он лучше предыдущих и выводим надпись - побили рекорд     
            if (setting.score > localStorage.getItem('score')){
                localStorage.setItem('score', setting.score);
                score.innerHTML ='Поздравляем!!! <br> Вы побили рекорд!<br>' + setting.score;        score.style.background = 'transparent url(./img/salut.gif) center / cover no-repeat';  
                score.style.color = 'yellow';                      
            }  
            setting.bestScore = localStorage.getItem('score');            
        }
        item.y +=setting.speed /2;
        item.style.top = item.y + 'px';
        // если машинки уехали далеко, возвращаем их на поле
        if (item.y >= gameArea.offsetHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
