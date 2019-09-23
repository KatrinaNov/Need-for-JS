const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gamearea'),
    car = document.createElement('div');

car.classList.add('car');


start.addEventListener('click', startGame);
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
    speed: 3
};

function startGame(){
    start.classList.add('hide');
    setting.start = true;
    gameArea.appendChild(car);
    //плавная анимация
    requestAnimationFrame(playGame);
};

function playGame(){
    console.log('Play game!');
    if (setting.start){
        requestAnimationFrame(playGame);
    }
};
function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
    console.log(event.key);
};
function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
    console.log(event.key);
};