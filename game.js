const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const speed = document.getElementById("speed");
const fuel = document.getElementById("fuel");
const hp = document.getElementById("hp");
const money = document.getElementById("money");

const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const gameScreen = document.getElementById("gameScreen");


let speed_text = ' Cм/Год';
let speed_val = 1;
let fuel_val = 100;
let hp_val = 100;
let money_val = 0;

let start_game = true
let end_game = false

let keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'space': false,
    'p': false,

};
let ticks = 0

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height * 0.89;
        this.vel = {
            x: 0,
            y: 0
        }
        this.start = false
        let image = new Image();
        image.src = "spaceship.png";
        image.onload = () => {
            this.width = image.width * 0.3;
            this.height = image.height * 0.3;
            this.image = image;
            this.start = true
            this.fire_pos = this.x + this.width / 2;
            this.cube = {
                x_max: this.x + this.width,
                y_max: this.y + this.height,
                x: this.x,
                y: this.y,
            }
        }

    }

    update() {
        if (this.start){
            this.x += this.vel.x * 10;
            this.y += this.vel.y * 10;

            this.cube.x = this.x;
            this.cube.y = this.y;
            this.fire_pos = this.x + this.width / 2;
            this.cube.x_max = this.x + this.width;
            this.cube.y_max = this.y + this.height;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Invador {
    constructor(x) {
        this.x = x;
        this.y = 100 * Math.random();
        this.vel = {
            x: 0,
            y: 2
        }
        this.start = false
        this.fire = true 
        let image = new Image();
        image.src = "invader.png";
       
        this.cube = {
            x_max: this.x + 60,
            y_max: this.y + 60
        }
        image.onload = () => {
            this.width = image.width * 1.5;
            this.height = image.height * 1.5;
             this.fire_pos = this.x + this.width / 2
            this.image = image;
            this.cube = {
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.start = true
        }

    }

    update() {
        if (this.start){
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube.x_max = this.x + this.width;
            this.cube.y_max = this.y + this.height;

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            this.cube.x_max = this.x + 40;
            this.cube.y_max = this.y + 40;
        }

    }
}

class InvadorGroup {
    constructor() {
        this.invadors = [];
        this.delete = false
        this.len = this.invadors.length;
        this.damage = 0;
    }

    create(length) {
        for (let i = 0; i < length; i++) {

            this.invadors.push(new Invador(Math.floor(Math.random() * 1921)));
        }

        this.len = this.invadors.length;
    }

    update() {
        this.invadors.forEach(invador => {
            invador.update()
            if (invador.y > canvas.height - invador.height) {
                this.delete = true;

            }
        })
        if (this.delete) {
            let len = this.invadors.length;

            this.invadors = []
            this.create(this.len)
            this.delete = false
        }
    }


check_position(player_box) {
    let oneDel = false;
    this.damage = 0;
    this.pos = -1
    for (let i = this.invadors.length - 1; i >= 0; i--) {
        let invador = this.invadors[i];
        if (player_box.x < invador.cube.x_max &&
            player_box.x_max > invador.x &&
            player_box.y < invador.cube.y_max &&
            player_box.y_max > invador.y) {
            this.damage = 1;
            this.invadors.splice(i, 1);
        }
    }
}
    clear(id) {
        this.invadors.splice(id, 1);
    }
}

class Asteroid{
    constructor(x) {
        this.x = x;
        this.y = 100 * Math.random();
        this.vel = {
            x: 0,
            y: 2
        }
        this.start = false
        let image = new Image();
        image.src = "asteroid.png";
        this.cube = {
            x_max: this.x + 80,
            y_max: this.y + 0
        }
        image.onload = () => {
            this.width = image.width * 0.1;
            this.height = image.height * 0.1;
            this.image = image;
            this.cube = {
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.start = true
        }

    }

    update() {
        if (this.start){
            this.x += this.vel.x;
                this.y += this.vel.y;
            this.cube.x_max = this.x + this.width;
            this.cube.y_max = this.y + this.height;

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            this.cube.x_max = this.x + 40;
            this.cube.y_max = this.y + 40;
        }

    }
}

class AsteroidGroup {
    constructor() {
        this.asteroids = [];
        this.delete = false
        this.len = this.asteroids.length;
        this.damage = 0;
    }

    create(length) {
        for (let i = 0; i < length; i++) {

            this.asteroids.push(new Asteroid(Math.floor(Math.random() * 1921)));
        }

        this.len = this.asteroids.length;
    }

    update() {
        this.asteroids.forEach(asteroid => {
            asteroid.update()
            if (asteroid.y > canvas.height - asteroid.height) {
                this.delete = true;

            }
        })
        if (this.delete) {
            let len = this.asteroids.length;

            this.asteroids = []
            this.create(this.len)
            this.delete = false
        }
    }


    check_position(player_box) {
        let oneDel = false;
        this.damage = 0;
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            let asteroid = this.asteroids[i];
            if (player_box.x < asteroid.cube.x_max &&
                player_box.x_max > asteroid.x &&
                player_box.y < asteroid.cube.y_max &&
                player_box.y_max > asteroid.y) {
                this.asteroids.splice(i, 1);
                this.damage = 1;
            }
        }
    }
    clear() {
        this.asteroids = [];
    }
}

class Fire {
    constructor(x, y, vel, color='red') {
        this.x = x;
        this.y = y;
        this.vel = {
            x: 0,
            y: vel
        }
        this.damage = 0;
        this.color = color;
        this.cube = {
            x_max: this.x + 20,
            y_max: this.y + 20,
            x: this.x,
            y: this.y,
        }

    }

    update() {
        this.damage = 0
        this.x += this.vel.x;
        this.y += this.vel.y;
        ctx.fillStyle =  this.color;
        ctx.fillRect(this.x, this.y, 10, 10)
    }
    check_position(player_box) {
    this.damage = 0;
    if (player_box.x < this.cube.x_max &&
        player_box.x_max > this.x &&
        player_box.y < this.cube.y_max &&
        player_box.y_max > this.y) {
        this.damage = 1;
    }
}
}

class HelpKit{
    constructor() {
        this.x = Math.floor(Math.random() * 1701);
        this.y = 100 * Math.random();
        this.vel = {
            x: 0,
            y: 2
        }
        this.start = false
        let image = new Image();
        image.src = "help.png";
        this.cube = {
            x_max: this.x + 40,
            y_max: this.y + 40
        }
        image.onload = () => {
            this.width = image.width * 0.1;
            this.height = image.height * 0.1;
            this.image = image;
            this.cube = {
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.start = true
        }
        this.help = 0

    }
    update() {
        if (this.start){
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube.x_max = this.x + this.width;
            this.cube.y_max = this.y + this.height;

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            this.cube.x_max = this.x + 40;
            this.cube.y_max = this.y + 40;
        }

    }
    check_position(player_box) {
        this.oneDel = false
        if ((this.x < player_box.x_max && player_box.x < this.x )|| (this.cube.x_max > player_box.x
                && this.cube.x_max < player_box.x_max) ||
            (this.x > player_box.x && this.cube.x_max < player_box.x)) {

            if (this.cube.y_max > player_box.y && this.y < player_box.y) {
                this.oneDel = true;
                this.help = 20


            }
        }


    }

}

class FuelKit{
    constructor() {
        this.x = Math.floor(Math.random() * 1701);
        this.y = 100 * Math.random();
        this.vel = {
            x: 0,
            y: 2
        }
        this.start = false
        let image = new Image();
        image.src = "fuel.png";
        this.cube = {
            x_max: this.x + 40,
            y_max: this.y + 40
        }
        image.onload = () => {
            this.width = image.width * 0.1;
            this.height = image.height * 0.1;
            this.image = image;
            this.cube = {
                x_max: this.x + this.width,
                y_max: this.y + this.height
            }
            this.start = true
        }
        this.fuel = 0

    }
    update() {
        if (this.start){
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.cube.x_max = this.x + this.width;
            this.cube.y_max = this.y + this.height;

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            this.cube.x_max = this.x + 40;
            this.cube.y_max = this.y + 40;
        }

    }
    check_position(player_box) {
        this.oneDel = false
        if ((this.x < player_box.x_max && player_box.x < this.x )|| (this.cube.x_max > player_box.x
                && this.cube.x_max < player_box.x_max) ||
            (this.x > player_box.x && this.cube.x_max < player_box.x)) {
            if (this.cube.y_max > player_box.y && this.y < player_box.y) {
                this.oneDel = true;
                this.fuel = 20
            }
        }


    }

}

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = true;
            break
        case 'KeyW':
            keys.w = true;
            break
        case 'KeyS':
            keys.s = true;
            break
        case 'KeyD':
            keys.d = true;
            break
        case 'Space':
            keys.space = true;
            break
        case 'KeyP':
            keys.p = !keys.p;
            
    }
})


document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a = false;
            break
        case 'KeyW':
            keys.w = false;
            break
        case 'KeyS':
            keys.s = false;
            break
        case 'KeyD':
            keys.d = false;
            break
        case 'Space':
            keys.space = false;
            break


    }
})


const fuelbox = [new FuelKit()]
const helpbox = [new HelpKit()]

const player = new Player();

const invadors = [new InvadorGroup()];
const asteroids = [new AsteroidGroup()];

const fire = [];
const InvadorFire = []

let oldSpaceKeyValue = false
asteroids[0].create(5)
invadors[invadors.length - 1].create(5);

function draw() {
    if (start_game){
        if (keys.p === false){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();
            // Стрельба
            for (let i = 0; i < fire.length; i++) {
                fire[i].update();
                if (fire[i].y < 0){
                    fire.splice(i, 1)
                }
            }
            //Враги
            for (let i = 0; i < invadors.length; i++) {
                invadors[i].invadors.forEach((invador) => {
                    if (invador.fire & ticks >= 60 * 12 & InvadorFire.length === 0){
                    InvadorFire.push(new Fire(invador.fire_pos, invador.y, 1, 'blue'))
                }
                })
                for (let j = 0; j < fire.length; j++){
                    invadors[i].check_position(fire[j].cube)
                    if (invadors[i].damage !== 0){
                        fire.splice(j, 1) 
                    }
                }
                invadors[i].check_position(player.cube);
                hp_val -= invadors[i].damage
                
                invadors[i].update()
                
            }
            // Стрельба Врагов
            for (let i = 0; i < InvadorFire.length; i++) {
                InvadorFire[i].update();
                InvadorFire[i].check_position(player.cube)
                hp_val -= InvadorFire[i].damage
                if (InvadorFire[i].y > canvas.height || InvadorFire.damage !== 0){
                    InvadorFire.splice(i, 1)
                }
                
                
                
            }
            //Астероиды
            for (let i = 0; i < asteroids.length; i++) {
                for (let j = 0; j < fire.length; j++){
                    asteroids[i].check_position(fire[j].cube)
                    if (asteroids[i].damage !== 0){
                        fire.splice(j, 1)
                        asteroids[i].update()
                    }
                }
                asteroids[i].check_position(player.cube);
                hp_val -= asteroids[i].damage
                asteroids[i].update()
            }
            //Аптечка
            for (let i = 0; i < helpbox.length; i++) {
                helpbox[i].update()
                helpbox[i].check_position(player.cube);
                if (helpbox[i].help != 0 & hp_val + helpbox[i].help <= 100){
                    hp_val += helpbox[i].help
                }
                if (helpbox[i].oneDel){
                    helpbox.splice(0, 1);
                }
            }
            //Топливо
            for (let i = 0; i < fuelbox.length; i++) {
                fuelbox[i].update()
                fuelbox[i].check_position(player.cube);
                if (fuelbox[i].fuel != 0 & fuel_val + fuelbox[i].fuel <= 100){
                    fuel_val += fuelbox[i].fuel
                }
                if (fuelbox[i].oneDel){
                    fuelbox.splice(0, 1);
                }
            }
            //клавиши
            if (keys.a & player.x > 0) {
                player.vel.x = -1;
                player.vel.y = 0;
            } else if (keys.w & player.y > 0) {
                player.vel.x = 0;
                player.vel.y = -1;
            } else if (keys.s & player.y + player.height < canvas.height) {
                player.vel.x = 0;
                player.vel.y = 1;
            } else if (keys.d & player.x + player.width < canvas.width) {
                player.vel.x = 1;
                player.vel.y = 0;
            } else {
                player.vel.x = 0;
                player.vel.y = 0;
            }
            if (keys.space && !oldSpaceKeyValue) {
                oldSpaceKeyValue = keys.space
                fire.push(new Fire(player.fire_pos, player.y, -5));
            }
            else if (!keys.space == oldSpaceKeyValue){
                oldSpaceKeyValue = keys.space
            }

            //время
            if (ticks >= 60 * 24) {
                ticks = 0;
                invadors.push(new InvadorGroup());
                invadors[invadors.length - 1].create(5);
            }
            if (ticks % 60*4 === 0) {
                fuel_val -= 1
                money_val += 1
                console.log(hp_val)
            }
            if (ticks === 60*8) {
                helpbox.splice(0, 1);
                helpbox.push(new HelpKit());
                fuelbox.splice(0, 1);
                fuelbox.push(new FuelKit());
            }
            //Здоровье и топливо
            if (hp_val < 0 || fuel_val < 0){
                hp_val = 0
                start_game = false
                end_game = true
            }
            money.textContent = `${money_val} Монет`
            fuel.textContent = `${fuel_val}%`
            hp.textContent = `${hp_val}%`;
            ticks++;

        }
        window.requestAnimationFrame(draw);
    }else {
        if (end_game){
            endScreen.style.display = "flex";
            gameScreen.style.display = "none";
        }
    }
}

window.requestAnimationFrame(draw);