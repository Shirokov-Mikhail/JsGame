
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("game-over-screen");
const pauseScreen = document.getElementById("pause-screen");

const name  = document.getElementById("player-name");
const startButton = document.getElementById("start-btn");
const  retry = document.getElementById("retry-btn");
const menu = document.getElementById("menu-btn");



const money = document.getElementById("coins");
const timer = document.getElementById("timer");
const fuel = document.getElementById("fuel2");
const hp = document.getElementById("health-bar");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let pause = false;
let star_game = false;
let end_game = false;

let money_val = 0

let keys = {
    'a': false,
    'd': false,
    'space': false,
    'p': false
};

class Player{
    constructor() {
        this.vel = {
            x:0,
            y:0
        }
        this.x = canvas.width /2;
        this.y = canvas.height *0.9;
        this.start = false;
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
        }
    }
}

class Asteroid{
    constructor() {
        this.vel = {
            x:0,
            y:2
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
        this.x = Math.floor(Math.random() * canvas.width);;
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
document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = true;
            console.log(keys.a);
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
function check_pos(cube_1, cube_2)
{
    if (cube_1.x < cube_2.x_max &&
        cube_1.x_max > cube_2.x &&
        cube_1.y < cube_2.y_max &&
        cube_1.y_max > cube_2.y) {
        return true;
    }
    return false;
}
let asteroids = [new Asteroid()]
let moneybox = [new Money()];
let player = new Player();

let ticks = 0
let min = 0
let sec = 0

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (star_game && !end_game) {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        if (!keys.p){
            pauseScreen.style.display = "none";
            player.draw();
            for (let i = 0; i < asteroids.length; i++) {
                asteroids[i].draw();
                if (check_pos(player.cube, asteroids[i].cube)) {
                    asteroids.splice(i, 1);
                }
                else if (asteroids[i].y > canvas.height) {
                    asteroids.splice(i, 1);
                }
            }
            for (let i = 0; i < moneybox.length; i++) {
                moneybox[i].draw();
                if (check_pos(player.cube, moneybox[i].cube)) {
                    moneybox.splice(i, 1);
                    money_val++;
                }
                else if (moneybox[i].y > canvas.height) {
                    moneybox.splice(i, 1);
                }
            }
            if (keys.a && player.x > 0){
                player.vel.x = -4;
            }
            else if (keys.d && player.cube.x_max < canvas.width) {
                console.log( player.cube.x_max, canvas.width)
                player.vel.x = 4;
            }
            else {
                player.vel.x = 0;
            }

            if (ticks == 60 * 2){
                ticks = 0
                asteroids.push(new Asteroid());
                moneybox.push(new Money());
                sec++
            }
            if (ticks == 60){
                sec++
            }
            if (sec == 60){
                min++
                sec = 0
            }
            timer.innerText = `${min}:${sec}`;
            ticks++
            console.log(money_val)

            money.textContent = `Монеты: ${money_val}`

        }else {
            pauseScreen.style.display = "block";
        }

    }else if(end_game) {
        gameScreen.style.display = "none";
        endScreen.style.display = "flex";
    }else if(!star_game){
        console.log('start')
    }
    window.requestAnimationFrame(draw)
}
startButton.addEventListener('click', () => {
    star_game = true;
    window.requestAnimationFrame(draw)
})