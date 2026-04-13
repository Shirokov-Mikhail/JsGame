// 'media/sprites/bathyscaphe.svg'
// screen
const start_screen = document.getElementById("start-screen");
const countdown_screen = document.getElementById("countdown-screen");
const pause_screen = document.getElementById("pause-screen");
const result_screen = document.getElementById("result-screen");
const game_screen = document.getElementById("game-screen");
// start screen items
const player_name = document.getElementById("player-name");
const difficulty = document.getElementById("difficulty");
const start_btn = document.getElementById("start-btn");
start_btn.disabled = true;
// countdown-text
const countdown_text = document.getElementById("countdown-text");
// game screen items
const timer = document.getElementById("hud-timer");
const cristals = document.getElementById("hud-crystals");
cristals.textContent = "0";
const oxygen = document.getElementById("hud-oxygen-text");
oxygen.textContent = "100%";
const ox_bar = document.getElementById("hud-oxygen");
const hp = document.getElementById("hud-hull");
hp.value = "100%";
const sonar = document.getElementById("hud-sonar");
const canvas = document.getElementById("canvas");
//result screen
const result_name = document.getElementById("result-name");
const result_time = document.getElementById("result-time");
const result_crystals = document.getElementById("result-crystals");
const save_btn = document.getElementById("save-result-btn");
const retry_btn = document.getElementById("retry-btn");
const back_btn = document.getElementById("back-btn");

const ctx = canvas.getContext("2d");

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
let hp_val = 100
let oxygen_val = 100
let cristal_val = 0;
let sonar_val = 0;
let name = ''

class Palyer {
    constructor() {
        this.vel = {
            x: 0,
            y: 0
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/bathyscaphe.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.x = canvas.width * 0.5;
            this.y = canvas.height * 0.9
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Bomb_small {
    constructor() {
        this.vel = {
            x: 0,
            y: 4 * lvl_speed
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/mine-small.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.damage = 10
            this.x = Math.ceil(Math.random() * 1920);
            this.y = 30
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Bomb_medium {
    constructor() {
        this.vel = {
            x: 0,
            y: 4 * lvl_speed
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/mine-medium.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.damage = 10
            this.x = Math.ceil(Math.random() * 1920);
            this.y = -20
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Bomb_large {
    constructor() {
        this.vel = {
            x: 0,
            y: 4 * lvl_speed
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/mine-large.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.damage = 10
            this.x = Math.ceil(Math.random() * 1920);
            this.y = -20
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Oxygen {
    constructor() {
        this.vel = {
            x: 0,
            y: 4
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/ox.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.oxygen = 20
            this.x = Math.ceil(Math.random() * 1920);
            this.y = -20
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Repair {
    constructor() {
        this.vel = {
            x: 0,
            y: 4
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/repair-module.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.damage = -20
            this.x = Math.ceil(Math.random() * 1920);
            this.y = -20
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.x += this.vel.x;
            this.y += this.vel.y;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Cristal {
    constructor() {
        this.vel = {
            x: 0,
            y: 4
        }
        let image = new Image();
        this.start = false
        image.src = "media/sprites/crystal.svg";
        image.onload = () => {
            this.width = image.width * 0.4
            this.height = image.height * 0.4
            this.x = Math.ceil(Math.random() * 1920);
            this.y = 0
            this.image = image
            this.start = true
            this.cube = {
                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
        }
    }

    draw() {
        if (this.start) {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube = {

                x: this.x,
                y: this.y,
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

function check_pos(cube_1, cube_2) {
    if (cube_1 !== undefined, cube_2 !== undefined) {
        if (cube_1.x < cube_2.x_max &&
            cube_1.x_max > cube_2.x &&
            cube_1.y < cube_2.y_max &&
            cube_1.y_max > cube_2.y) {
            return true;
        }
    }
    return false;
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


let lvl_speed = 1.4
let player = new Palyer(check_pos);
let cristal = [];
let bombs = [];
let bombs_ticks = 0;
let oxygens_box = [];
let ticks_oxygen = 0;
let cristal_tiks = 0

let repai_box = []
let repai_ticks = 0

let sec = 0
let min = 0

let soner_ticks = 0
let oxygen_tiks_ras = 5
let sonar_ras = 7

let old_lvl = lvl_speed

function game() {
    if (start_game && !end_game) {
        if (!keys.p) {

            pause_screen.style.display = 'none'
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.draw()
            for (let i = 0; i < bombs.length; i++) {
                bombs[i].draw()
                if (check_pos(player.cube, bombs[i].cube)) {
                    hp_val -= bombs[i].damage
                    bombs.splice(i, 1);
                } else if (bombs[i].y > canvas.height) {
                    bombs.splice(i, 1);
                }
            }
            for (let i = 0; i < oxygens_box.length; i++) {
                oxygens_box[i].draw()
                if (check_pos(player.cube, oxygens_box[i].cube)) {
                    oxygen_val += oxygens_box[i].oxygen
                    oxygens_box.splice(i, 1);
                }
            }
            for (let i = 0; i < repai_box.length; i++) {
                repai_box[i].draw()
                if (check_pos(player.cube, repai_box[i].cube)) {
                    hp_val -= repai_box[i].damage
                    repai_box.splice(i, 1);
                }
            }

            for (let i = 0; i < cristal.length; i++) {
                cristal[i].draw()
                if (check_pos(player.cube, cristal[i].cube)) {
                    cristal_val += 1
                    cristal.splice(i, 1);
                }
            }
            console.log(cristal_val, sonar_ras, sonar_val)
            if (cristal_val >= sonar_ras && sonar_val === 0 && sonar_ras !== -1) {
                sonar_val = 1
                cristal_val -= sonar_ras
            }
            if (keys.e && sonar_val === 1 && soner_ticks === 0) {
                sonar_val -= 1
                lvl_speed *= 0.6
                soner_ticks = 60 * 4
            }
            if (keys.a && player.x > 0) {
                player.vel.x = -5
                player.vel.y = 0
            } else if (keys.s && player.cube.y_max < canvas.height) {
                player.vel.y = 5
                player.vel.x = 0
            } else if (keys.w && player.y > 0) {
                player.vel.y = -5
                player.vel.x = 0
            } else if (keys.d && player.cube.x_max < canvas.width) {
                player.vel.x = 5
                player.vel.y = 0
            } else {
                player.vel.y = 0
                player.vel.x = 0
            }

            if (bombs_ticks === 60 * 2) {
                bombs_ticks = 0
                console.log(bombs)
                if (difficulty.value === 'easy') {
                    mat = Math.random()
                    if (mat < 0.35) {
                        bombs.push(new Bomb_small())
                    } else if (mat > 0.35 && mat < 0.70) {
                        bombs.push(new Bomb_medium())
                    } else {
                        bombs.push(new Bomb_large())
                    }
                } else if (difficulty.value === 'medium') {
                    mat = Math.random()
                    if (mat < 0.5) {
                        bombs.push(new Bomb_medium())
                    } else {
                        bombs.push(new Bomb_large())
                    }

                } else if (difficulty.value === 'hard') {
                    bombs.push(new Bomb_large())
                }

                cristal.push(new Cristal())
                while (check_pos(bombs[bombs.length - 1].cube, cristal[cristal.length - 1].cube)) {
                    cristal.splice(cristal.length - 1, 1)
                    cristal.push(new Cristal())
                }
            }

            if (ticks_oxygen === 60 * 3) {
                oxygens_box.push(new Oxygen())
                console.log(oxygens_box[oxygens_box.length-1])
                if (bombs_ticks === 0) {
                    ticks_oxygen = 58 * 3
                    oxygens_box.splice(oxygens_box.length - 1, 1)
                }
                else{
                    ticks_oxygen = 0

                }
            }
            if (repai_ticks === 60 * 10) {
                repai_box.push(new Repair())

                if (repai_ticks === 0) {
                    repai_ticks = 58 * 10
                    repai_box.splice(repai_box.length - 1, 1)
                }
                else{
                    repai_ticks = 0

                }
            }
            if (cristal_tiks === 60){
                cristal_tiks = 0
                oxygen_val -= oxygen_tiks_ras
                sec++
            }
            if (sec === 60){
                sec = 0
                min++
            }
            timer.innerText = `${min}:${sec}`
            cristals.innerText = `${cristal_val}`
            sonar.innerText = `${sonar_val}`
            oxygen.textContent = `${oxygen_val}%`
            ox_bar.style.width = `${oxygen_val}%`
            hp.style.width = `${hp_val}%`
            if (hp_val <= 0 || oxygen_val <= 0){
                end_game = true
            }
            if (soner_ticks !== 0) {
                soner_ticks--
            } else {
                lvl_speed = old_lvl
            }

            bombs_ticks++
            ticks_oxygen++
            repai_ticks++
            cristal_tiks++
        }else {
            pause_screen.style.display = 'flex'
        }
    }
    else {

        game_screen.style.display = 'none'
        result_screen.style.display = 'flex'
        result_name.innerText = `${name}`
        result_time.innerText = `${min}:${sec}`
        result_crystals.innerText = `${cristal_val}`
    }
    if (result_screen.style.display !== 'flex' ){
        requestAnimationFrame(game)
    }
}

let ticks = 0

function start_eng() {

    if (difficulty.value === 'easy') {
        lvl_speed = 1
        sonar_ras = 5
        oxygen_tiks_ras = 4
    } else if (difficulty.value === 'hard') {
        lvl_speed = 1.8
        sonar_ras = -1
        oxygen_tiks_ras = 6
    }
    old_lvl = lvl_speed
    start_screen.style.display = 'none'
    countdown_screen.style.display = 'flex'
    if (ticks === 60) {
        countdown_text.innerText = '2'
    } else if (ticks === 60 * 2) {
        countdown_text.innerText = '1'
    } else if (ticks === 60 * 3) {
        countdown_text.innerText = 'Поехали'
        start_game = true
        countdown_screen.style.display = 'none'
        game_screen.style.display = 'flex'
        requestAnimationFrame(game)
    }
    if (countdown_text.innerText !== 'Поехали') {
        requestAnimationFrame(start_eng);
    }
    ticks++
}

player_name.addEventListener("input", () => {
    console.log("player name: " + player_name.value)
    if (player_name.value !== '') {
        start_btn.disabled = false;
    }
})
start_btn.addEventListener("click", function () {
    name = player_name.value
    requestAnimationFrame(start_eng)
})
async function sendResult() {
    const data_ico = new Date().toISOString()
    let data = {
        client: "Misha",
        name: name,
        time: sec / 60 + min
    }
    try {
        let res = await fetch(` http://ссылка:8082/api/expedition`, {
            'method': 'POST',
            "headers": {
                'Content-Type': 'application/json'
            },
            "body": {
                "client": 'Misha',
                "name": `${name}`,
                "time": `${sec / 60 + min}`,
                "crystals": `${cristal_val}`,
                "timestamp": `${data_ico.getTime()}`,
            }
        })
        if (res.ok){
            console.log('Результат сохранен')
        }else {

            console.log('не удалось отправить')
        }
    }
    catch(error){
        alert(error)
    }
    }

retry_btn.addEventListener("click", () => {
    console.log("retry_btn")
    end_game = false;
    countdown_text.innerText = '3';
    result_screen.style.display = 'none';
    ticks = 0;
    hp_val = 100;
    oxygen_val = 100;
    sonar_val = 0;
    sec = 0
    min = 0
    player = new Palyer(check_pos);
    cristal = [];
    repai_box = []
    repai_ticks = 0
    oxygens_box = [];
    bombs = [];
    cristal_tiks = 0
    ticks_oxygen = 0;
    bombs_ticks = 0;

    cristal_val = 0
    game_screen.style.display = 'flex';
    countdown_screen.style.display = 'flex';
    requestAnimationFrame(start_eng)
})
back_btn.addEventListener("click", () => {
    console.log("back_btn")
    start_game = false;
    end_game = false;
    game_screen.style.display = 'none'
    ticks = 0
    hp_val = 100
    oxygen_val = 100
    sonar_val = 0
    sec = 0
    min = 0
    player = new Palyer(check_pos);
    cristal = [];
    repai_box = []
    repai_ticks = 0
    oxygens_box = [];
    bombs = [];
    cristal_tiks = 0
    ticks_oxygen = 0;
    bombs_ticks = 0;
    cristal_val = 0
    result_screen.style.display = 'none'
    start_screen.style.display = 'flex'
    countdown_text.innerText = '3'
})
