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
        let image = new Image();
        image.src = "invader.png";
        this.cube = {
            x_max: this.x + 40,
            y_max: this.y + 40
        }
        image.onload = () => {
            this.width = image.width;
            this.height = image.height;
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

//    check_position(player_box) {
//        let oneDel = false
//
////        this.invadors.forEach(invador => {
////            this.index = this.invadors.indexOf(invador);
////            if ((invador.x < player_box.x_max && player_box.x < invador.x )|| (invador.cube.x_max > player_box.x
////                && invador.cube.x_max < player_box.x_max) ||
////                (invador.x > player_box.x && invador.cube.x_max < player_box.x)) {
////
////                if (invador.cube.y_max > player_box.y && invador.y < player_box.y) {
////                    oneDel = true;
////
////                }
////            }
////        })
//         for (let i = 0; i < this.invadors.length; i++) {
//            if ((this.invadors[i].x < player_box.x_max && player_box.x < this.invadors[i].x )|| (this.invadors[i].cube.x_max > player_box.x
//                && this.invadors[i].cube.x_max < player_box.x_max) ||
//                (this.invadors[i].x > player_box.x && this.invadors[i].cube.x_max < player_box.x)) {
//                if (this.invadors[i].cube.y_max > player_box.y && this.invadors[i].y < player_box.y) {
//                    this.invadors.splice(i, 1)
//                    oneDel = true;
//
//        }}}
//
//       if (oneDel) {
//           this.damage = 1;
//      } else {
//            oneDel = false;
//            this.damage = 0;
//    }
//    }
check_position(player_box) {
    let oneDel = false;
    this.damage = 0;
    for (let i = this.invadors.length - 1; i >= 0; i--) {
        let invador = this.invadors[i];
        if (player_box.x < invador.cube.x_max &&
            player_box.x_max > invador.x &&
            player_box.y < invador.cube.y_max &&
            player_box.y_max > invador.y) {
            this.invadors.splice(i, 1);
            oneDel = true;
        }
    }

    if (oneDel) {
        this.damage = 1;
    }
}
    clear() {
        this.invadors = [];
    }
}

class Fire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vel = {
            x: 0,
            y: -5
        }
        this.cube = {
            x_max: this.x + 20,
            y_max: this.y + 20,
            x: this.x,
            y: this.y,
        }

    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 10, 10)
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
const fire = [];
invadors[invadors.length - 1].create(48);

function draw() {
    if (start_game){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update();

        for (let i = 0; i < fire.length; i++) {
            fire[i].update();
            if (fire[i].y < 0){
                fire.splice(i, 1)
            } 
        }
        for (let i = 0; i < invadors.length; i++) {
            
            for (let j = 0; j < fire.length; j++){
                invadors[i].check_position(fire[j].cube)
                
            }
            invadors[i].check_position(player.cube);
            hp_val -= invadors[i].damage
            invadors[i].update()
        }

        
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
        if (keys.space) {
            fire.push(new Fire(player.fire_pos, player.y));
        }
        if (ticks >= 60 * 8) {
            helpbox.splice(0, 1);
            helpbox.push(new HelpKit());
            fuelbox.splice(0, 1);
            fuelbox.push(new FuelKit());
            ticks = 0;
           
            invadors.push(new InvadorGroup());
            invadors[invadors.length - 1].create(48);
        }
        
        if (ticks % 60*4 === 0) {
            fuel_val -= 1
            money_val += 1
        }
        if (hp_val < 0 || fuel_val < 0){
            hp_val = 0
            start_game = false
            end_game = true
        }
        money.textContent = `${money_val} Монет`
        fuel.textContent = `${fuel_val}%`
        hp.textContent = `${hp_val}%`;
        ticks++;
        window.requestAnimationFrame(draw);
    }else {
        if (end_game){
            endScreen.style.display = "flex";
            gameScreen.style.display = "none";
        }
    }
}

window.requestAnimationFrame(draw);