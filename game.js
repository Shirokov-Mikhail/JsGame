
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("game-over-screen");
const pauseScreen = document.getElementById("pause-screen");

const name_input  = document.getElementById("player-name");
const startButton = document.getElementById("start-btn");
const  retry = document.getElementById("retry-btn");
const menu = document.getElementById("menu-btn");

const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");

const money = document.getElementById("coins");
const timer = document.getElementById("timer");
const fuel = document.getElementById("fuel2");
const hp = document.getElementById("health-bar");

const rank = document.getElementById("rank-end");
const end_name = document.getElementById("name-end");
const time_end = document.getElementById("time-end");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let name = name_input.value
let pause = false;
let star_game = false;
let end_game = false;

let level = 1.5
let money_val = 0
let hp_val = 100
let power = 100

let keys = {
    'a': false,
    'd': false,
    'space': false,
    'p': false
};

class Player{
    constructor() {
        this.vel = {
            x:0, //направление движения по x
            y:0 //направление движения по y
        }
        this.x = canvas.width /2;
        this.y = canvas.height *0.9;
        this.start = false; // проверка на загрузку изображения
        this.shield = false;
        let image = new Image();
        image.src = "spaceship.png";
        image.onload = () => {
            this.image = image;
            this.height = image.height * 0.3;
            this.width = image.width * 0.3;
            this.start = true;
            this.fire_pos = true.x + this.width / 2;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }
        }
    }
    draw() {
        if (this.start){
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }
            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (this.shield) {// отображение щита
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 5;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }

        }
    }
}

class Asteroid{
    constructor() {
        this.vel = {
            x:0,
            y:2 * level
        }
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = 1;
        this.start = false;
        let image = new Image();
        image.src = "asteroid.png";
        image.onload = () => {
            this.image = image;
            this.height = image.width * 0.1;
            this.width = image.width * 0.1;
            this.start = true;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            if (this.cube.x_max > canvas.width) {
                this.cube.x = canvas.width - this.width;
                this.x = canvas.width - this.width;
                this.cube.x_max = canvas.width;
            }
        }
    }
    draw() {
        if (this.start){
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }
            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
class Money{
    constructor() {
        this.vel = {
            x:0,
            y:1
        }
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = 1;
        this.start = false;
        let image = new Image();
        image.src = "money.png";
        image.onload = () => {
            this.image = image;
            this.height = image.width * 0.1;
            this.width = image.width * 0.1;
            this.start = true;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            if (this.cube.x_max > canvas.width) {
                this.cube.x = canvas.width - this.width;
                this.x = canvas.width - this.width;
                this.cube.x_max = canvas.width;
            }
        }
    }
    draw() {
        if (this.start){

            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
class HelpKit{
    constructor() {
        this.vel = {
            x:0,
            y:1
        }
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = 1;
        this.start = false;
        let image = new Image();
        image.src = "help.png";
        image.onload = () => {
            this.image = image;
            this.height = image.width * 0.1;
            this.width = image.width * 0.1;
            this.start = true;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            if (this.cube.x_max > canvas.width) {
                this.cube.x = canvas.width - this.width;
                this.x = canvas.width - this.width;
                this.cube.x_max = canvas.width;
            }
        }
    }
    draw() {
        if (this.start){
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
class FuelKit{
    constructor() {
        this.vel = {
            x:0,
            y:1
        }
        this.x = Math.floor(Math.random() * canvas.width);;
        this.y = 1;
        this.start = false;
        let image = new Image();
        image.src = "fuel.png";
        image.onload = () => {
            this.image = image;
            this.height = image.width * 0.1;
            this.width = image.width * 0.1;
            this.start = true;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            if (this.cube.x_max > canvas.width) {
                this.cube.x = canvas.width - this.width;
                this.x = canvas.width - this.width;
                this.cube.x_max = canvas.width;
            }
        }
    }
    draw() {
        if (this.start){
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height,
            }

            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Fire{
    constructor(x, y) {
        this.vel = {
            x: 0,
            y: -1
        }
        this.x = x;
        this.y = y;
        this.cube = {
            x: this.x,
            y: this.y,
            x_max: this.x + 20,
            y_max: this.y + 20
        }
    }
    draw() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.cube = {
            x:this.x,
            y: this.y,
            x_max: this.x + 20,
            y_max: this.y + 20
        };
        ctx.fillStyle = 'red';
        console.log(this.cube)
        ctx.fillRect(this.x, this.y, 5, 20);
    }
}

// клавиши
document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = true;
            break
        case 'KeyD':
            keys.d = true;
            break
        case 'Space':
            keys.space = true;
            break
        case 'KeyP':
            keys.p = !keys.p;
            break
        case 'KeyE':
            keys.e = !keys.e;
    }
})


document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = false;
            break
        case 'KeyD':
            keys.d = false;
            break
        case 'Space':
            keys.space = false;
            break


    }
})
// проверка позиции игрока
function check_pos(cube_1, cube_2)
{
    if (cube_1 !== undefined, cube_2 !== undefined){
        if (cube_1.x < cube_2.x_max &&
            cube_1.x_max > cube_2.x &&
            cube_1.y < cube_2.y_max &&
            cube_1.y_max > cube_2.y) {
            return true;
        }
    }
    return false;
}
// Обьеекты
let asteroids = [new Asteroid()]
let moneybox = [new Money()];
let helpbox = [new HelpKit()];
let fuelbox = [new FuelKit()];
let fire = [];
let player = new Player();
//
let ticks = 0
let ticks2 = 0
let min = 0
let sec = 0
let shild_time = 0
let oldSpaceKeyValue = false

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (star_game && !end_game) {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        if (!keys.p){
            pauseScreen.style.display = "none";
            player.draw();

            //астероиды
            for (let i = 0; i < asteroids.length; i++) {
                asteroids[i].draw();
                //стрельба
                for (let x = 0; x < fire.length; x++) {
                    fire[x].draw();
                    if (asteroids[i] !== undefined && check_pos(fire[x].cube, asteroids[i].cube)){
                        asteroids.splice(i, 1);
                        fire.splice(x, 1);
                    }
                    else if(fire[x].y < 0){
                        fire.splice(x, 1);
                    }
                }
                if (asteroids[i] !== undefined) {
                    if (check_pos(player.cube, asteroids[i].cube) ) {// столкновение с игроком
                        asteroids.splice(i, 1);
                        if (!player.shield){// проверка на щит
                            hp_val -= 20;
                        }
                    }
                    else if (asteroids[i].y > canvas.height) {// проверка на высоту
                        // а else чтобы не проверять те элемнты которые мы уже исключили
                        asteroids.splice(i, 1);
                    }
                }
            }
            //монетка
            for (let i = 0; i < moneybox.length; i++) {
                moneybox[i].draw();
                if (check_pos(player.cube, moneybox[i].cube)) {//проверка столкновений с игроком
                    moneybox.splice(i, 1);
                    money_val++;
                }// проверка на высоту
                else if (moneybox[i].y > canvas.height) {
                    moneybox.splice(i, 1);
                }
            }
            //аптечка
            // все элкскнты эдентичный монетке
            for (let i = 0; i < helpbox.length; i++) {
                helpbox[i].draw();
                if (check_pos(player.cube, helpbox[i].cube)) {
                    helpbox.splice(i, 1);
                    hp_val += 10;
                }
                else if (helpbox[i].y > canvas.height) {
                    helpbox.splice(i, 1);
                }
            }
            //бензин
            for (let i = 0; i < fuelbox.length; i++) {
                fuelbox[i].draw();
                if (check_pos(player.cube, fuelbox[i].cube)) {
                    fuelbox.splice(i, 1);
                    power += 10;
                }
                else if (fuelbox[i].y > canvas.height) {
                    fuelbox.splice(i, 1);
                }
            }
            //Если топливо больше 100
            if (power > 100){
                power = 100
            }//Если здоровье больше 100
            if (hp_val > 100){
                hp_val = 100
            }//Активация Щита
            if (money_val >= 5 && shild_time === 0){
                money_val -= 5
                shild_time = 60*5
                player.shield = true
            }
            //клавиши
            if (keys.a && player.x > 0){
                player.vel.x = -4;
            }
            else if (keys.d && player.cube.x_max < canvas.width) {
                player.vel.x = 4;
            }
            else {
                player.vel.x = 0;
            }
            if (keys.space && !oldSpaceKeyValue) {
                oldSpaceKeyValue = keys.space
                fire.push(new Fire(player.x + (player.width / 2), player.y));
            }
            else if (!keys.space == oldSpaceKeyValue){
                oldSpaceKeyValue = keys.space
            }
            // Появление астероидов и монеток
            if (ticks === 60 * 2){
                ticks = 0
                asteroids.push(new Asteroid());
                moneybox.push(new Money());
                sec++
            }
            // появление аптечек и топлива
            // ticks2 потому что не придумал как сделать просто с ticks
            if (ticks2 === 60 * 6){
                ticks2 = 0
                helpbox.push(new HelpKit());
                fuelbox.push(new FuelKit());
            }
            // секунды
            if (ticks === 60){
                sec++
                power -= 1
            }
            // минуты
            if (sec === 60){
                min++
                sec = 0
            }
            // Работа и остановка работы щита
            if (shild_time !== 0){
                shild_time--;
            }else if (shild_time === 0){
                player.shield = false
            }
            // Обновление текста
            hp.innerText = `Здоровье: ${hp_val}%`
            fuel.innerText = `Топливо: ${power}%`
            timer.innerText = `${min}:${sec}`;
            money.textContent = `Монеты: ${money_val}`
            // Завершение игры
            if (hp_val <= 0 || power <= 0){
                end_game = true
            }
            // отщет времени
            ticks++
            ticks2++

        }else {
            // пауза
            pauseScreen.style.display = "flex";
        }

    }else if(end_game) {//конец игры
        gameScreen.style.display = "none";
        endScreen.style.display = "flex";
        rank.innerText = 'S';
        end_name.innerText = name;
        time_end.innerText = timer.innerText;
    }else if(!star_game){
        // начало игры
        console.log('start')
    }
    window.requestAnimationFrame(draw)
}

startButton.addEventListener('click', () => {
    if (name_input.value.length > 0){
        star_game = true;
        name = name_input.value;
        window.requestAnimationFrame(draw)
        if (easy.checked){
            level = 1;
        }
        else if (medium.checked){
            level = 1.5;
        }else if(hard.checked){
            level = 2;
        }
    }
})