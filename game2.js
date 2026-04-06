const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("game-over-screen");
const pauseScreen = document.getElementById("pause-screen");

const nameInput = document.getElementById("player-name");
const startButton = document.getElementById("start-btn");
const retryButton = document.getElementById("retry-btn");
const menuButton = document.getElementById("menu-btn");

const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");

const timerLabel = document.getElementById("timer");
const scoreLabel = document.getElementById("coins");
const healthLabel = document.getElementById("health-bar");
const fuelLabel = document.getElementById("fuel2");
const pauseText = document.getElementById("pause-text");

const rankCell = document.getElementById("rank-end");
const endNameCell = document.getElementById("name-end");
const endTimeCell = document.getElementById("time-end");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const keys = {
    left: false,
    right: false,
    fire: false
};

const difficulties = {
    easy: { enemySpeed: 150, spawn: 1.1, fuelDrain: 2.5, damage: 16 },
    medium: { enemySpeed: 210, spawn: 0.85, fuelDrain: 3.7, damage: 20 },
    hard: { enemySpeed: 270, spawn: 0.65, fuelDrain: 5.2, damage: 24 }
};

const state = {
    playerName: "",
    difficulty: "medium",
    started: false,
    paused: false,
    gameOver: false,
    countdown: 3,
    countdownTimer: 0,
    time: 0,
    score: 0,
    hp: 100,
    fuel: 100,
    fireCooldown: 0,
    spawnTimer: 0,
    pickupTimer: 0,
    stars: [],
    bullets: [],
    enemies: [],
    pickups: [],
    player: null,
    lastFrameTime: 0
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateHud() {
    timerLabel.textContent = `Time: ${formatTime(state.time)}`;
    scoreLabel.textContent = `Score: ${state.score}`;
    healthLabel.textContent = `Health: ${Math.max(0, Math.ceil(state.hp))}%`;
    fuelLabel.textContent = `Fuel: ${Math.max(0, Math.ceil(state.fuel))}%`;
}

function initStars() {
    state.stars = [];
    for (let i = 0; i < 160; i += 1) {
        state.stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 25 + Math.random() * 80,
            size: 1 + Math.random() * 2
        });
    }
}

function getDifficulty() {
    if (easy.checked) return "easy";
    if (hard.checked) return "hard";
    return "medium";
}

function resetGameData() {
    state.started = false;
    state.paused = false;
    state.gameOver = false;
    state.countdown = 3;
    state.countdownTimer = 0;
    state.time = 0;
    state.score = 0;
    state.hp = 100;
    state.fuel = 100;
    state.fireCooldown = 0;
    state.spawnTimer = 0;
    state.pickupTimer = 0;
    state.bullets = [];
    state.enemies = [];
    state.pickups = [];
    state.lastFrameTime = 0;
    state.player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 120,
        w: 40,
        h: 60,
        speed: 420
    };
    initStars();
    updateHud();
}

function intersects(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function spawnEnemy() {
    const size = 28 + Math.random() * 26;
    state.enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size - 20,
        w: size,
        h: size,
        speed: difficulties[state.difficulty].enemySpeed + Math.random() * 70,
        drift: (Math.random() - 0.5) * 60
    });
}

function spawnPickup() {
    const typeRoll = Math.random();
    let type = "coin";
    if (typeRoll > 0.75) type = "fuel";
    if (typeRoll > 0.9) type = "health";

    const size = type === "coin" ? 20 : 26;
    state.pickups.push({
        type,
        x: Math.random() * (canvas.width - size),
        y: -size - 12,
        w: size,
        h: size,
        speed: 130 + Math.random() * 40
    });
}

function fireBullet() {
    state.bullets.push({
        x: state.player.x + state.player.w / 2 - 3,
        y: state.player.y - 14,
        w: 6,
        h: 18,
        speed: 620
    });
    state.fireCooldown = 0.18;
}

function drawBackground(delta) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#02030d");
    gradient.addColorStop(1, "#110d2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (const star of state.stars) {
        star.y += star.speed * delta;
        if (star.y > canvas.height) {
            star.y = -2;
            star.x = Math.random() * canvas.width;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

function drawPlayer() {
    const p = state.player;
    const cx = p.x + p.w / 2;
    const by = p.y + p.h;

    ctx.fillStyle = "#e6f4ff";
    ctx.beginPath();
    ctx.moveTo(cx, p.y);
    ctx.lineTo(p.x + p.w, by - 12);
    ctx.lineTo(p.x + p.w * 0.75, by);
    ctx.lineTo(p.x + p.w * 0.25, by);
    ctx.lineTo(p.x, by - 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#52d6ff";
    ctx.beginPath();
    ctx.arc(cx, p.y + 20, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff6f4d";
    ctx.fillRect(p.x + 6, by - 5, 8, 12);
    ctx.fillRect(p.x + p.w - 14, by - 5, 8, 12);
}

function drawEnemy(enemy) {
    ctx.fillStyle = "#6f7885";
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.w / 2, enemy.y);
    ctx.lineTo(enemy.x + enemy.w, enemy.y + enemy.h * 0.45);
    ctx.lineTo(enemy.x + enemy.w * 0.8, enemy.y + enemy.h);
    ctx.lineTo(enemy.x + enemy.w * 0.2, enemy.y + enemy.h);
    ctx.lineTo(enemy.x, enemy.y + enemy.h * 0.45);
    ctx.closePath();
    ctx.fill();
}

function drawPickup(item) {
    if (item.type === "coin") {
        ctx.fillStyle = "#f4c542";
        ctx.beginPath();
        ctx.arc(item.x + item.w / 2, item.y + item.h / 2, item.w / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
    }

    if (item.type === "fuel") {
        ctx.fillStyle = "#44ff9f";
        ctx.fillRect(item.x + 3, item.y + 3, item.w - 6, item.h - 6);
        return;
    }

    ctx.fillStyle = "#ff5c6b";
    ctx.fillRect(item.x + item.w / 2 - 3, item.y + 4, 6, item.h - 8);
    ctx.fillRect(item.x + 4, item.y + item.h / 2 - 3, item.w - 8, 6);
}

function drawBullets() {
    ctx.fillStyle = "#ff607a";
    for (const bullet of state.bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }
}

function drawScene(delta) {
    drawBackground(delta);
    for (const enemy of state.enemies) drawEnemy(enemy);
    for (const pickup of state.pickups) drawPickup(pickup);
    drawBullets();
    drawPlayer();
}

function applyGameLogic(delta) {
    const cfg = difficulties[state.difficulty];
    state.time += delta;
    state.fuel = Math.max(0, state.fuel - cfg.fuelDrain * delta);
    state.fireCooldown = Math.max(0, state.fireCooldown - delta);

    if (keys.left) state.player.x -= state.player.speed * delta;
    if (keys.right) state.player.x += state.player.speed * delta;
    state.player.x = Math.max(10, Math.min(canvas.width - state.player.w - 10, state.player.x));

    if (keys.fire && state.fireCooldown === 0) fireBullet();

    state.spawnTimer += delta;
    if (state.spawnTimer >= cfg.spawn) {
        state.spawnTimer = 0;
        spawnEnemy();
    }

    state.pickupTimer += delta;
    if (state.pickupTimer >= 6) {
        state.pickupTimer = 0;
        spawnPickup();
    }

    for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
        const bullet = state.bullets[i];
        bullet.y -= bullet.speed * delta;
        if (bullet.y + bullet.h < 0) {
            state.bullets.splice(i, 1);
        }
    }

    for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
        const enemy = state.enemies[i];
        enemy.y += enemy.speed * delta;
        enemy.x += enemy.drift * delta;
        if (enemy.x < 0 || enemy.x + enemy.w > canvas.width) enemy.drift *= -1;

        let hit = false;
        for (let b = state.bullets.length - 1; b >= 0; b -= 1) {
            if (intersects(enemy, state.bullets[b])) {
                state.enemies.splice(i, 1);
                state.bullets.splice(b, 1);
                state.score += 50;
                hit = true;
                break;
            }
        }
        if (hit) continue;

        if (intersects(enemy, state.player)) {
            state.enemies.splice(i, 1);
            state.hp -= cfg.damage;
            continue;
        }

        if (enemy.y > canvas.height + 40) {
            state.enemies.splice(i, 1);
            state.hp -= 8;
        }
    }

    for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
        const item = state.pickups[i];
        item.y += item.speed * delta;

        if (intersects(item, state.player)) {
            if (item.type === "coin") state.score += 25;
            if (item.type === "fuel") state.fuel = Math.min(100, state.fuel + 22);
            if (item.type === "health") state.hp = Math.min(100, state.hp + 18);
            state.pickups.splice(i, 1);
            continue;
        }

        if (item.y > canvas.height + 30) {
            state.pickups.splice(i, 1);
        }
    }

    updateHud();
}

function getRank(score) {
    if (score >= 700) return "S";
    if (score >= 500) return "A";
    if (score >= 300) return "B";
    if (score >= 120) return "C";
    return "D";
}

function finishGame() {
    state.gameOver = true;
    state.started = false;
    gameScreen.style.display = "none";
    pauseScreen.style.display = "none";
    endScreen.style.display = "flex";

    rankCell.textContent = getRank(state.score);
    endNameCell.textContent = state.playerName;
    endTimeCell.textContent = formatTime(state.time);
}

function gameLoop(timestamp) {
    if (state.gameOver) return;

    if (!state.lastFrameTime) state.lastFrameTime = timestamp;
    const delta = Math.min(0.034, (timestamp - state.lastFrameTime) / 1000);
    state.lastFrameTime = timestamp;

    if (!state.started) {
        drawScene(delta);
        pauseScreen.style.display = "flex";
        pauseText.textContent = String(Math.max(0, state.countdown));
        state.countdownTimer += delta;
        if (state.countdownTimer >= 1) {
            state.countdownTimer = 0;
            state.countdown -= 1;
            if (state.countdown < 0) {
                state.started = true;
                pauseScreen.style.display = "none";
            }
        }
        requestAnimationFrame(gameLoop);
        return;
    }

    if (state.paused) {
        drawScene(delta);
        pauseScreen.style.display = "flex";
        pauseText.textContent = "PAUSE";
        requestAnimationFrame(gameLoop);
        return;
    }

    pauseScreen.style.display = "none";
    applyGameLogic(delta);
    drawScene(delta);

    if (state.hp <= 0 || state.fuel <= 0) {
        finishGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function startGame() {
    const value = nameInput.value.trim();
    if (!value) {
        nameInput.focus();
        return;
    }

    state.playerName = value;
    state.difficulty = getDifficulty();
    resizeCanvas();
    resetGameData();

    startScreen.style.display = "none";
    endScreen.style.display = "none";
    gameScreen.style.display = "block";
    pauseScreen.style.display = "flex";
    pauseText.textContent = "3";

    requestAnimationFrame(gameLoop);
}

function goMenu() {
    state.gameOver = true;
    state.started = false;
    state.paused = false;
    startScreen.style.display = "flex";
    gameScreen.style.display = "none";
    pauseScreen.style.display = "none";
    endScreen.style.display = "none";
}

document.addEventListener("keydown", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") keys.left = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") keys.right = true;
    if (event.code === "Space") {
        keys.fire = true;
        event.preventDefault();
    }
    if (event.code === "KeyP" && !state.gameOver && state.countdown < 0) {
        state.paused = !state.paused;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") keys.left = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") keys.right = false;
    if (event.code === "Space") keys.fire = false;
});

window.addEventListener("resize", () => {
    resizeCanvas();
    if (state.player) {
        state.player.y = canvas.height - 120;
        state.player.x = Math.max(10, Math.min(canvas.width - state.player.w - 10, state.player.x));
    }
});

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
menuButton.addEventListener("click", goMenu);

resizeCanvas();
resetGameData();
drawBackground(0);
