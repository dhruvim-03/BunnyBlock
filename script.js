let score = 0;
let cross = true;
let gameStarted = false;
let gameOverFlag = false;
let audio = new Audio('tune.mp3');
let audiogo = new Audio('dead.mp3');
audio.loop = true;
audio.volume = 0.6;

const tur = document.querySelector('.tur');
const obstacle = document.querySelector('.obstacle');
const scoreCount = document.getElementById('scoreCount');
const gameOver = document.querySelector('.gameOver');
const welcomeScreen = document.querySelector('.welcome');
const pressText = document.querySelector('.press');
const reloadMsg = document.querySelector('.reloadMsg');

scoreCount.style.display = "none";
gameOver.style.display = "none";
if (reloadMsg) reloadMsg.style.display = "none";

document.onkeydown = function (e) {
  if (e.keyCode === 13 && !gameStarted) {
    startGame();
    return;
  }
  if (!gameStarted || gameOverFlag) return;

  if (e.keyCode == 38) {
    tur.classList.add('animateTur');
    setTimeout(() => tur.classList.remove('animateTur'), 700);
  }
  if (e.keyCode == 39) {
    let dx = parseInt(window.getComputedStyle(tur, null).getPropertyValue('left'));
    tur.style.left = (dx + 112) + "px";
  }
  if (e.keyCode == 37) {
    let dx = parseInt(window.getComputedStyle(tur, null).getPropertyValue('left'));
    tur.style.left = (dx - 112) + "px";
  }
};

function startGame() {
  gameStarted = true;
  if (pressText) pressText.classList.add('hide');

  setTimeout(() => {
    if (welcomeScreen) welcomeScreen.style.display = "none";
    scoreCount.style.display = "block";
    scoreCount.innerHTML = "Your Score: " + score;
    audio.play().catch(err => console.log(err));
    startCollisionCheck();
  }, 500);
}

function startCollisionCheck() {
  const collisionCheck = setInterval(() => {
    if (gameOverFlag) {
      clearInterval(collisionCheck);
      return;
    }

    let dx = parseInt(window.getComputedStyle(tur, null).getPropertyValue('left'));
    let dy = parseInt(window.getComputedStyle(tur, null).getPropertyValue('top'));
    let ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    let oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    let offsetX = Math.abs(dx - ox);
    let offsetY = Math.abs(dy - oy);

    if (offsetX < 73 && offsetY < 52) {
      gameOverFlag = true;
      audio.pause();
      audiogo.currentTime = 0;
      audiogo.play();
      obstacle.classList.remove('obs');

      gameOver.style.display = "block";
      gameOver.innerHTML = "Game Over";

      scoreCount.style.display = "block";
      scoreCount.innerHTML = "Final Score: " + score;

      if (reloadMsg) {
        reloadMsg.style.display = "block";  // show blinking reload message
      }

    } else if (offsetX < 145 && cross) {
      score += 1;
      updateScore(score);
      cross = false;

      setTimeout(() => cross = true, 1000);

      setTimeout(() => {
        let aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
        let newDur = aniDur - 0.1;
        if (newDur >= 2) obstacle.style.animationDuration = newDur + 's';
      }, 500);
    }
  }, 10);
}

function updateScore(score) {
  scoreCount.innerHTML = "Your Score: " + score;
}