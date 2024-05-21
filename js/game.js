const player = document.getElementById('player');
let direction = 'right';
const speed = 10; // Збільшуємо швидкість руху

document.addEventListener('keydown', function(event) {
  if (event.code === 'ArrowLeft') {
    movePlayer('left');
  } else if (event.code === 'ArrowRight') {
    movePlayer('right');
  }
});

function movePlayer(newDirection) {
  const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));

  if (newDirection !== direction) {
    // Зміна напрямку
    direction = newDirection;
    // Зміна відображення в залежності від напрямку
    player.style.transform = (direction === 'right') ? 'scaleX(-1)' : 'scaleX(1)';
  }

  if (direction === 'right') {
    if (playerLeft < window.innerWidth - player.width) {
      player.style.left = playerLeft + speed + 'px';
    }
  } else if (direction === 'left') {
    if (playerLeft > 0) {
      player.style.left = playerLeft - speed + 'px';
    }
  }
}


function checkCollision(cake, player) {
    const cakeRect = cake.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    return !(cakeRect.right < playerRect.left || 
             cakeRect.left > playerRect.right || 
             cakeRect.bottom < playerRect.top || 
             cakeRect.top > playerRect.bottom);
}



const cake = document.getElementById('cake');
const speedCake = 5;

function moveCake() {
    const cake = document.getElementById('cake');
    const player = document.getElementById('player');

    const cakeTop = parseInt(window.getComputedStyle(cake).getPropertyValue('top'));

    cake.style.top = cakeTop + speed + 'px';

    if (cakeTop >= window.innerHeight + player.height) {
        cake.remove();
    } else if (checkCollision(cake, player)) {
        // Зіткнення тортика з гравцем
        console.log('Зіткнення тортика з гравцем!');
        // Тут ви можете викликати функцію для додавання очків гравцю або будь-яку іншу логіку
        cake.remove();
    }
}

setInterval(moveCake, 50);