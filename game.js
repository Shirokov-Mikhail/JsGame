const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const speed = document.getElementById("speed");
const fuel = document.getElementById("fuel");
const hp = document.getElementById("hp");

let startScreen = document.getElementById("startScreen");
let endScreen = document.getElementById("endScreen");
let gameScreen = document.getElementById("gameScreen");


let speed_text = ' Cм/Год';
let speed_val = 1;
let fuel_val = 100;
let hp_val = 100;


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

            this.invadors.push(new Invador(i * 40));
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
        let oneDel = false

        this.invadors.forEach(invador => {
            this.index = this.invadors.indexOf(invador);
            if ((invador.x < player_box.x_max && player_box.x < invador.x )|| (invador.cube.x_max > player_box.x
                && invador.cube.x_max < player_box.x_max) ||
                (invador.x > player_box.x && invador.cube.x_max < player_box.x)) {

                if (invador.cube.y_max > player_box.y && invador.y < player_box.y) {
                    oneDel = true;

                }
            }
        })

        if (oneDel) {
            this.invadors.splice(this.index, 1);
            this.damage = 1;
        }
        else {
            oneDel = false;
            this.damage = 0;
        }

    }

    clear() {
        this.invadors = [];
    }
}
// Стрельбу доделать
class Fire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vel = {
            x: 0,
            y: -1
        }
        this.cube = {
            x_max: this.x + 60,
            y_max: this.y + 60,
            x: this.x,
            y: this.y,
        }

    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 60, 60)
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
                this.help = 10


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

        }
        for (let i = 0; i < invadors.length; i++) {
            invadors[i].update()
            invadors[i].check_position(player.cube);
            hp_val -= invadors[i].damage

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
            fire.push(new Fire());
        }
        if (ticks >= 60 * 8) {
            helpbox.splice(0, 1);
            helpbox.push(new HelpKit(player));
            ticks = 0;
            invadors.push(new InvadorGroup());
            invadors[invadors.length - 1].create(48);
        }

        if (ticks % 60*4 === 0) {
            fuel_val -= 1
        }
        if (hp_val < 0 || fuel_val < 0){
            hp_val = 0
            start_game = false
            end_game = true
        }
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