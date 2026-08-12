/* =========================================
   JOGO DO FELIPE
   100 FASES
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const menu = document.getElementById("menu");
const credits = document.getElementById("credits");
const gameScreen = document.getElementById("gameScreen");
const victory = document.getElementById("victory");
const gameOver = document.getElementById("gameOver");

const playButton = document.getElementById("playButton");
const creditsButton = document.getElementById("creditsButton");
const backButton = document.getElementById("backButton");

const nextLevelButton = document.getElementById("nextLevelButton");
const menuButton = document.getElementById("menuButton");

const retryButton = document.getElementById("retryButton");
const gameOverMenuButton = document.getElementById("gameOverMenuButton");

const player = document.getElementById("player");
const game = document.getElementById("game");

const livesText = document.getElementById("lives");
const starsText = document.getElementById("stars");
const coinsText = document.getElementById("coins");
const timerText = document.getElementById("timer");
const levelNumberText = document.getElementById("levelNumber");

const coinElements = [
    document.getElementById("coin1"),
    document.getElementById("coin2"),
    document.getElementById("coin3")
];

const exit = document.getElementById("exit");


/* =========================================
   ESTADO DO JOGO
========================================= */

let currentLevel = 1;

let lives = 3;

let coins = 0;

let collectedCoins = 0;

let timer = 30;

let timerInterval = null;

let gameRunning = false;

let keys = {
    left: false,
    right: false,
    jump: false
};


/* =========================================
   FÍSICA
========================================= */

let playerX = 40;

let playerY = 0;

let velocityX = 0;

let velocityY = 0;

let onGround = false;

const gravity = 0.7;

const moveSpeed = 4.5;

const jumpPower = 12;


/* =========================================
   MENU
========================================= */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(element => {
        element.classList.remove("active");
    });

    screen.classList.add("active");

}


/* =========================================
   INICIAR JOGO
========================================= */

function startGame() {

    currentLevel = 1;

    lives = 3;

    coins = 0;

    updateHUD();

    loadLevel();

    showScreen(gameScreen);

}


/* =========================================
   CARREGAR FASE
========================================= */

function loadLevel() {

    clearInterval(timerInterval);

    gameRunning = true;

    collectedCoins = 0;

    timer = getLevelTime();

    playerX = 40;

    playerY = 0;

    velocityX = 0;

    velocityY = 0;

    player.style.left = playerX + "px";
player.style.bottom = (70 + playerY) + "px";


/* =========================================
   ANIMAÇÃO DO PERSONAGEM
========================================= */

player.classList.remove(
    "player-running",
    "player-jumping"
);

if (!onGround) {

    player.classList.add("player-jumping");

}

else if (Math.abs(velocityX) > 0.5) {

    player.classList.add("player-running");

}

    coinElements.forEach(coin => {
        coin.style.display = "flex";
    });

    exit.style.display = "block";

    levelNumberText.textContent = currentLevel;

    updateHUD();

    startTimer();

}


/* =========================================
   DIFICULDADE
========================================= */

function getLevelTime() {

    /*
       A cada 10 fases o tempo diminui.
       Isso vai fazer a dificuldade aumentar
       conforme avançarmos.
    */

    if (currentLevel <= 10) {
        return 30;
    }

    if (currentLevel <= 20) {
        return 28;
    }

    if (currentLevel <= 30) {
        return 26;
    }

    if (currentLevel <= 40) {
        return 24;
    }

    if (currentLevel <= 50) {
        return 22;
    }

    if (currentLevel <= 60) {
        return 20;
    }

    if (currentLevel <= 70) {
        return 18;
    }

    if (currentLevel <= 80) {
        return 16;
    }

    if (currentLevel <= 90) {
        return 14;
    }

    return 12;

}


/* =========================================
   CRONÔMETRO
========================================= */

function startTimer() {

    timerText.textContent = timer;

    timerInterval = setInterval(() => {

        if (!gameRunning) return;

        timer--;

        timerText.textContent = timer;

        if (timer <= 0) {

            clearInterval(timerInterval);

            loseLife();

        }

    }, 1000);

}


/* =========================================
   MOVIMENTO
========================================= */

function updateGame() {

    if (!gameRunning) return;


    /* Movimento horizontal */

    if (keys.left) {
        velocityX = -moveSpeed;
    }

    else if (keys.right) {
        velocityX = moveSpeed;
    }

    else {
        velocityX *= 0.75;
    }


    playerX += velocityX;


    /* Limites */

    const maxX = game.clientWidth - 45;

    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > maxX) {
        playerX = maxX;
    }


    /* Gravidade */

    velocityY -= gravity;

    playerY += velocityY;


    /* Chão */

    if (playerY <= 0) {

        playerY = 0;

        velocityY = 0;

        onGround = true;

    }


    /* Pulo */

    if (keys.jump && onGround) {

        velocityY = jumpPower;

        onGround = false;

    }


    /* Aplicar posição */

    player.style.left = playerX + "px";

    player.style.bottom = (70 + playerY) + "px";


    checkCoins();

    checkExit();


    requestAnimationFrame(updateGame);

}


/* =========================================
   COLETAR MOEDAS
========================================= */

function checkCoins() {

    coinElements.forEach((coin, index) => {

        if (coin.style.display === "none") return;

        if (isColliding(player, coin)) {

            coin.style.display = "none";

            collectedCoins++;

            coins++;

            updateHUD();

        }

    });

}


/* =========================================
   SAÍDA
========================================= */

function checkExit() {

    if (isColliding(player, exit)) {

        finishLevel();

    }

}


/* =========================================
   COLISÃO
========================================= */

function isColliding(element1, element2) {

    const a = element1.getBoundingClientRect();

    const b = element2.getBoundingClientRect();

    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );

}


/* =========================================
   TERMINAR FASE
========================================= */

function finishLevel() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(timerInterval);

    const stars = calculateStars();

    document.getElementById("resultStars").textContent =
        "⭐".repeat(stars);

    showScreen(victory);

}


/* =========================================
   ESTRELAS
========================================= */

function calculateStars() {

    if (timer >= 20 && collectedCoins === 3) {
        return 3;
    }

    if (timer >= 10 || collectedCoins >= 2) {
        return 2;
    }

    return 1;

}


/* =========================================
   PERDER VIDA
========================================= */

function loseLife() {

    gameRunning = false;

    clearInterval(timerInterval);

    lives--;

    updateHUD();

    if (lives <= 0) {

        showScreen(gameOver);

        return;

    }

    setTimeout(() => {

        loadLevel();

    }, 300);

}


/* =========================================
   HUD
========================================= */

function updateHUD() {

    livesText.textContent = lives;

    starsText.textContent = "0";

    coinsText.textContent = coins;

    timerText.textContent = timer;

    levelNumberText.textContent = currentLevel;

}


/* =========================================
   PRÓXIMA FASE
========================================= */

nextLevelButton.addEventListener("click", () => {

    if (currentLevel < 100) {

        currentLevel++;

        showScreen(gameScreen);

        loadLevel();

        requestAnimationFrame(updateGame);

    } else {

        alert(
            "🔥 VOCÊ ZEROU AS 100 FASES! 🔥\n\n" +
            "Parabéns!\n\n" +
            "Criado por Felipe."
        );

        showScreen(menu);
    }

});


/* =========================================
   BOTÕES
========================================= */

playButton.addEventListener("click", () => {

    startGame();

    requestAnimationFrame(updateGame);

});


creditsButton.addEventListener("click", () => {

    showScreen(credits);

});


backButton.addEventListener("click", () => {

    showScreen(menu);

});


menuButton.addEventListener("click", () => {

    showScreen(menu);

});


retryButton.addEventListener("click", () => {

    lives = 3;

    showScreen(gameScreen);

    loadLevel();

});


gameOverMenuButton.addEventListener("click", () => {

    showScreen(menu);

});


/* =========================================
   TECLADO
========================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        keys.left = true;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        keys.right = true;

    }


    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w" ||
        event.code === "Space"
    ) {

        keys.jump = true;

    }

});


document.addEventListener("keyup", event => {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        keys.left = false;

    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        keys.right = false;

    }


    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w" ||
        event.code === "Space"
    ) {

        keys.jump = false;

    }

});


/* =========================================
   CONTROLES TOUCH
========================================= */

const leftButton = document.getElementById("leftButton");

const rightButton = document.getElementById("rightButton");

const jumpButton = document.getElementById("jumpButton");


leftButton.addEventListener("touchstart", event => {

    event.preventDefault();

    keys.left = true;

});


leftButton.addEventListener("touchend", event => {

    event.preventDefault();

    keys.left = false;

});


rightButton.addEventListener("touchstart", event => {

    event.preventDefault();

    keys.right = true;

});


rightButton.addEventListener("touchend", event => {

    event.preventDefault();

    keys.right = false;

});


jumpButton.addEventListener("touchstart", event => {

    event.preventDefault();

    keys.jump = true;

});


jumpButton.addEventListener("touchend", event => {

    event.preventDefault();

    keys.jump = false;

});


/* =========================================
   INICIAR
========================================= */

showScreen(menu);
