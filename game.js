//screens
const start_screen = document.getElementById("start-screen");
const game_screen = document.getElementById("game-screen");
const result_screen = document.getElementById("result-screen");
const countdown_screen = document.getElementById("countdown-screen");
const pause_screen = document.getElementById("pause-screen");

// start screen elements
const difficulty = document.getElementById("difficulty");
const player_name = document.getElementById("player-name");
const start_btn = document.getElementById("start-btn");
// countdown screen
const countdown_text = document.getElementById("countdown-text");
// result screen
const result_name = document.getElementById("result-name");
const result_time = document.getElementById("result-time");
const result_crystals = document.getElementById("result-crystals");
// game screen
const timer = document.getElementById("hud-timer");
const crystals_text = document.getElementById("hud-crystals");
const hp_bar = document.getElementById("hud-hull");
hp_bar.style.width = "100%";
const ox_text = document.getElementById("hud-oxygen-text");
const ox_bar = document.getElementById("hud-oxygen");
ox_bar.style.width = "100%";
const sonar = document.getElementById("hud-sonar");
// game screen element
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let sonar_val = 0
let crystals_val = 0
let hp_val = 100
let ox_val = 100
let speed = 1.4;
let start_game = false;
let end_game = false;
let keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'e': false,
    'p': false,
}
let start_pos = false;
class Game_Element{
    constructor(src){
        this.vel = {
            y: 0,
            x: 0,
        }
        let image = new Image();
        image.src = src
        this.start = false;
        this.damage = 0;
        this.ox = 0
        image.onload = () => {
            this.image = image;
            this.width = image.width * 0.5;
            this.height = image.height * 0.5;
            this.initPosition();
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            };
            this.start = true;
        }
    }
    initPosition() {
        this.x = 0;
        this.y = -40;

    }
    draw(){
        if (this.start){
            this.x += this.vel.x * speed
            this.y += this.vel.y * speed
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            };
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
}
class Player extends Game_Element{
    constructor() {
        super('media/sprites/bathyscaphe.svg');
    }
    initPosition() {
        this.x = canvas.width/2 - this.width/2;
        this.y = canvas.height;

    }
}


class Crystal extends Game_Element{
    constructor() {
        super('media/sprites/crystal.svg');
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.vel.y = 4
        this.y = -40;
    }
}

class Mine_small extends Game_Element{
    constructor() {
        super('media/sprites/mine-small.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.damage = 10;
        this.y = -40;
        this.vel.y = 4;
    }

}
class Mine_medium extends Game_Element{
    constructor() {
        super('media/sprites/mine-medium.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.damage = 20;
        this.vel.y = 4;

        this.y = -40;
    }
}
class Mine_large extends Game_Element{
    constructor() {
        super('media/sprites/mine-large.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.damage = 30;
        this.vel.y = 4;
        this.y = -40;
    }
}
class Shark extends Game_Element{
    constructor() {
        super('media/sprites/bathyscaphe.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.damage = 50;
        this.vel.x = 8;
        this.y = -40;
    }
}
class Oxygen extends Game_Element{
    constructor() {
        super('media/sprites/ox.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.ox = 20
        this.vel.y = 4;

        this.y = -40;
    }
}
class Repair_module extends Game_Element{
    constructor() {
        super('media/sprites/repair-module.svg');

    }
    initPosition() {
        this.x = Math.floor(Math.random() * (canvas.width - this.width))
        this.damage = -20
        this.vel.y = 4;
        this.y = -40;
        this.width = 100;
        this.height = 100;
    }
}

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = true;
            break
        case 'KeyD':
            keys.d = true;
            break
        case 'KeyW':
            keys.w = true;
            break
        case 'KeyS':
            keys.s = true;
            break
        case 'KeyP':
            keys.p = !keys.p;
            break
        case 'KeyE':
            keys.e = true;
    }

});

document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = false;
            break
        case 'KeyD':
            keys.d = false;
            break
        case 'KeyW':
            keys.w = false;
            break
        case 'KeyS':
            keys.s = false;
            break
        case 'KeyE':
            keys.e = false;
    }

});
function check_pos(case_1, case_2){
    if (case_1 !== undefined && case_2 !== undefined) {
        if (case_1.x < case_2.x_max &&
            case_1.x_max > case_2.x &&
            case_1.y < case_2.y_max &&
            case_1.y_max > case_2.y){
            return true;
        }
    }
    return false;


}

let player = new Player();
let crystals = [];
let crystals_tick = 0;

let sonar_start = 7;

let bombs = [];
let bombs_tick = 0;

let shark = [];
let sharks_tick = 0;
let shark_kill_tick = 0;

let oxygen = [];
let oxygen_tick = 0;
let oxygen_ras = 5;

let repair = [];
let repair_tick = 0;
let repair_start = true

let base_tiks = 0;

function game(){

    if (start_game && !end_game){

        if (!keys.p){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pause_screen.style.display = "none";
            countdown_screen.style.display = "none";
            result_screen.style.display = "none";
            start_screen.style.display = "none";
            game_screen.style.display = "block";
            player.draw()
            if (!start_pos){
                if (player.y <= canvas.height * 0.9){
                    start_pos = true;
                }
                player.vel.y = -1
            }else {
                for (let i = 0; i < bombs.length; i++) {
                    if (bombs[i].start && check_pos(bombs[i].cube, player.cube)){
                        hp_val -= bombs[i].damage

                        console.log(bombs[i])
                        console.log(bombs[i].damage)

                        bombs.splice(i, 1);
                    }
                    else{
                        // for (let j = 0; j < shark.length; j++){
                        //     if (check_pos(bombs[i].cube, shark[j].cube))
                        //         bombs.splice(j, 1);
                        //         shark_kill_tick = 60 * 3;
                        //         break;
                        // }
                        if (bombs[i]){
                            if(bombs[i].y > canvas.height){
                                bombs.splice(i, 1);
                                }
                            else{
                                bombs[i].draw()
                            }
                        }
                    }
                }
                for (let i = 0; i < crystals.length; i++) {
                    if (check_pos(crystals[i].cube, player.cube)){
                        crystals.splice(i, 1);
                    }
                    else {
                        // for (let j = 0; j < shark.length; j++){
                        //     if (check_pos(crystals[i].cube, shark[j].cube))
                        //         crystals.splice(j, 1);
                        //         break
                        // }
                        if (crystals[i]){
                            crystals[i].draw()
                        }
                    }
                }
                for (let i = 0; i < shark.length; i++) {
                    if (check_pos(player.cube, shark[i].cube)){
                        hp_val += shark[i].damage;
                        shark.splice(i, 1);
                    }
                    else {
                        shark[i].draw()
                    }
                }
                for (let i = 0; i < oxygen.length; i++){
                    if (check_pos(oxygen[i].cube, player.cube)){
                        ox_val += oxygen[i].ox
                        oxygen.splice(i, 1);
                    }
                    else {
                        // for (let j = 0; j < shark.length; j++){
                        //     if (check_pos(oxygen[i].cube, shark[j].cube))
                        //         oxygen.splice(j, 1);
                        //     break
                        // }
                        if (oxygen[i]){
                            oxygen[i].draw()
                        }
                    }
                }
                for (let i = 0; i < repair.length; i++){
                    if (check_pos(repair[i].cube, player.cube)){
                        hp_val -= repair[i].damage
                        repair.splice(i, 1);
                    }
                    else {
                        // for (let j = 0; j < shark.length; j++){
                        //     if (check_pos(oxygen[i].cube, shark[j].cube))
                        //         oxygen.splice(j, 1);
                        //     break
                        // }
                        if(repair[i].y > canvas.height){
                            repair.splice(i, 1);
                        }
                        else{
                            repair[i].draw()
                        }

                    }
                }
                if(keys.a && player.x > 0){
                    player.vel.x = -8;
                    player.vel.y = 0;
                }else if(keys.d && player.cube.x_max < canvas.width){
                    player.vel.x = 8;

                    player.vel.y = 0;
                }
                else if(keys.w && player.y > 0){
                    player.vel.y = -8

                    player.vel.x = 0;
                }else if(keys.s && player.cube.y_max < canvas.height){
                    player.vel.y = 8;

                    player.vel.x = 0;
                }
                else {
                    player.vel.x = 0;
                    player.vel.y = 0;
                }
                if (hp_val > 100){
                    hp_val = 100
                }
                if (ox_val > 100){
                    ox_val = 100
                }
                if (repair_tick === 60 * 10){
                    repair_tick = 0;
                    repair.push(new Repair_module());
                }
                if (crystals_tick === 60 * 5){
                    crystals.push(new Crystal())
                    repair_tick = 0;
                }
                if (bombs_tick === 60 * 2){
                    bombs_tick = 0
                    if (speed === 1){
                        random = Math.random()
                        if (random < 0.35){
                            bombs.push(new Mine_small())
                        }

                        else if (random < 0.67){
                            bombs.push(new Mine_medium())
                    }
                        else if (random > 0.66){
                            bombs.push(new Mine_large())
                        }
                    }else if(speed === 1.4){
                        random = Math.random()
                        if (random <= 0.5){
                            bombs.push(new Mine_medium())
                        }
                        else if (random > 5){
                            bombs.push(new Mine_large())
                        }}

                    else{
                    bombs.push(new Mine_large())
                }}
                if (oxygen_tick === 60 * 4){
                    oxygen.push(new Oxygen())
                    oxygen_tick = 0;
                }

                ox_bar.style.width = `${ox_val}`
                hp_bar.style.width = `${hp_val}%`

                repair_tick++;
                crystals_tick++;
                bombs_tick++;
                oxygen_tick++;
                bombs_tick++;
            }

        }
        else {
            pause_screen.style.display = "block";
        }

    }else if(end_game) {
        result_screen.style.display = "block";
        game_screen.style.display = "none";
    }
    requestAnimationFrame(game)
}

let tiks = 0
function start_game_fun() { // Исправили название (stat -> start)
    // Используем === для сравнения
    start_screen.style.display = "none";
    countdown_screen.style.display = "flex";
    if (difficulty.value === 'easy') {
        speed = 1;
        oxygen_ras = 4;
        sonar_start = 7;
        repair_start = true;
    } else if (difficulty.value === 'hard') {
        speed = 1.8;
        oxygen_ras = 0; // Добавили ;
        sonar_start = -1;
        repair_start = false;
    } else {
        speed = 1.4;
        oxygen_ras = 5;
        sonar_start = 5;
        repair_start = true;
    }
    console.log(tiks)
    // Логика таймера
    if (tiks === 60 * 4) {
        tiks = 0;
        start_game = true
        game();
    } else {
        if (tiks === 0) {
            countdown_text.innerText = '3';
        } else if (tiks === 60) {
            countdown_text.innerText = '2';
        } else if (tiks === 60 * 2) {
            countdown_text.innerText = '1';
        } else if (tiks === 60 * 3) {
            countdown_text.innerText = 'Поплыли!';
        }

        tiks++;
        requestAnimationFrame(start_game_fun);
    }
}
start_btn.disabled = true;
start_btn.addEventListener('click', () => {
        start_game_fun();
})

player_name.addEventListener('input', () => {
    if (player_name.value.length >= 3 ){
        start_btn.disabled = false;
    }
})

async function sendResult(){
    resp = await fetch('http://46.21.245.117:6060/players', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    })
    result = await resp.json();
    rs = result.sort((a, b) => {
        return b.crystals - a.crystals
    })
    console.log(rs);

}
