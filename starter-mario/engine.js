/**
 * ENGINE LOGIC - v2.0
 * Procedural Platforms, Advanced Collision, and Death Mechanics
 */

const engine = {
  score: 0,
  entities: [],
  platforms: [],
  playerX: 100,
  playerY: 60,
  playerVY: 0,
  isJumping: false,
  hasStarPower: false,
  isRunning: false,
  gameLoop: null,
  keys: { right: false, left: false, up: false, shift: false },
  lives: 3,
  hasMushroom: false
};

const dom = {
  player: document.getElementById('player'),
  viewport: document.getElementById('viewport'),
  score: document.getElementById('score'),
  status: document.getElementById('status'),
  startBtn: document.getElementById('start-btn'),
  errorLog: document.getElementById('error-log')
};

function resetGame() {
  engine.score = 0;
  engine.playerX = 100;
  engine.playerY = 60;
  engine.playerVY = 0;
  engine.entities.forEach(e => e.element.remove());
  engine.platforms.forEach(p => p.element.remove());
  engine.entities = [];
  engine.platforms = [];
  dom.score.innerText = "000000";
  dom.player.style.left = engine.playerX + 'px';
  dom.player.style.bottom = engine.playerY + 'px';
}

function update() {
  if (!engine.isRunning) return;

  // 1. Movement Logic
  let speed = 7; // Default
  if (typeof getWalkingSpeed === 'function') {
    // Student logic for dashing
    speed = getWalkingSpeed(engine.keys.shift); 
  }

  if (engine.keys.right) {
    engine.playerX += speed;
    dom.player.style.transform = "scaleX(1)";
  }
  if (engine.keys.left) {
    engine.playerX -= speed;
    dom.player.style.transform = "scaleX(-1)";
  }
  engine.playerX = Math.max(0, Math.min(window.innerWidth - 60, engine.playerX));

  // 2. Gravity & Jumping
  if (engine.keys.up && !engine.isJumping) {
    engine.isJumping = true;
    let power = 20; // Default
    if (typeof getJumpPower === 'function') {
      power = getJumpPower(engine.hasMushroom); 
    }
    engine.playerVY = power;
  }

  engine.playerY += engine.playerVY;

  // Task 8: Gravity Multiplier
  let gravity = 1.2;
  if (typeof getGravityMultiplier === 'function') {
    gravity = getGravityMultiplier(engine.isJumping, engine.keys.shift);
  }
  engine.playerVY -= gravity; 

  // 3. Ground Collision
  if (engine.playerY <= 60) {
    engine.playerY = 60;
    engine.playerVY = 0;
    engine.isJumping = false;
  }

  // 4. Platform Logic & Student Function: shouldLandOnPlatform
  engine.platforms.forEach(plat => {
    plat.x -= 5;
    plat.element.style.left = plat.x + 'px';

    // Check if player is above the platform horizontally
    if (engine.playerX + 30 > plat.x && engine.playerX < plat.x + plat.width) {
      if (typeof shouldLandOnPlatform === 'function') {
        if (shouldLandOnPlatform(engine.playerY, engine.playerVY, plat.y)) {
          engine.playerY = plat.y;
          engine.playerVY = 0;
          engine.isJumping = false;
        }
      }
    }
  });

  // 5. Entity Logic (Coins, Enemies)
  engine.entities.forEach(entity => {
    entity.x -= 5;
    entity.element.style.left = entity.x + 'px';

    try {
      // Student Task 1: detectCollisionType
      const colType = detectCollisionType(engine.playerX, engine.playerY, entity.x, entity.y);
      
      if (colType !== 'none' && !entity.resolved) {
        if (entity.type === 'enemy') {
          // Student Task 3: handleEnemyInteraction
          const result = handleEnemyInteraction(colType, engine.hasStarPower);
          if (result === 'defeat_enemy') {
            engine.score += 200;
            entity.resolved = true;
            entity.element.classList.add('dead');
            setTimeout(() => entity.element.remove(), 400);
            // Little bounce if jumped on
            if (colType === 'top') engine.playerVY = 10;
          } else if (result === 'mario_takes_damage') {
             triggerDeath();
          }
        } else {
          // It's a powerup
          const points = calculateItemScore(entity.type);
          
          // Task 9: Final Score Logic (Complex Math + Multipliers)
          let finalPoints = points;
          if (typeof getFinalScore === 'function') {
            finalPoints = getFinalScore(points, 2, engine.hasStarPower); // Passing a x2 multiplier for fun
          }
          
          engine.score += finalPoints;
          entity.resolved = true;
          entity.element.classList.add('dead');
          setTimeout(() => entity.element.remove(), 200);
          
          if (entity.type === 'star') activateStarPower();
        }
        dom.score.innerText = engine.score.toString().padStart(6, '0');
      }
    } catch (e) {
      dom.errorLog.innerText = "Error in logic: " + e.message;
    }
  });

  // Refresh status UI
  if (typeof getStatusMessage === 'function') {
    dom.status.innerText = getStatusMessage(engine.lives, engine.hasStarPower);
  } else {
    dom.status.innerText = "RUNNING";
  }

  dom.player.style.left = engine.playerX + 'px';
  dom.player.style.bottom = engine.playerY + 'px';

  cleanupOffscreen();
  spawnManager();
}

function triggerDeath() {
  dom.player.classList.add('damage-flash');
  engine.isRunning = false;
  dom.status.innerText = "GAME OVER";
  dom.status.style.color = "red";
  setTimeout(() => {
    dom.player.classList.remove('damage-flash');
    resetGame();
    engine.isRunning = true;
    dom.status.innerText = "RUNNING";
    dom.status.style.color = "#4CAF50";
  }, 1000);
}

function activateStarPower() {
  engine.hasStarPower = true;
  dom.player.style.filter = "hue-rotate(90deg) brightness(1.5)";
  setTimeout(() => {
    engine.hasStarPower = false;
    dom.player.style.filter = "none";
  }, 5000);
}

function spawnManager() {
  if (Math.random() < 0.01) spawnEntity('enemy');
  if (Math.random() < 0.02) spawnEntity('coin');
  if (Math.random() < 0.005) {
     // Procedural Platform
     spawnPlatform();
  }
}

function spawnPlatform() {
  const width = 100 + Math.random() * 100;
  const height = 150 + Math.random() * 100;
  const el = document.createElement('div');
  el.className = 'platform';
  el.style.width = width + 'px';
  el.style.bottom = height + 'px';
  el.style.left = '100vw';
  dom.viewport.appendChild(el);
  engine.platforms.push({ element: el, x: window.innerWidth, y: height + 20, width: width });
}

function spawnEntity(type) {
  const el = document.createElement('div');
  el.className = `entity ${type}`;
  let startX = window.innerWidth;
  let startY = 60;
  if (type === 'coin') startY = 100 + Math.random() * 200;
  
  el.style.left = startX + 'px';
  el.style.bottom = startY + 'px';
  dom.viewport.appendChild(el);
  engine.entities.push({ element: el, x: startX, y: startY, type: type, resolved: false });
}

function cleanupOffscreen() {
  engine.entities = engine.entities.filter(e => {
    if (e.x < -100) { e.element.remove(); return false; }
    return true;
  });
  engine.platforms = engine.platforms.filter(p => {
    if (p.x < -400) { p.element.remove(); return false; }
    return true;
  });
}

function startEngine() {
  if (engine.isRunning) return;
  resetGame();
  engine.isRunning = true;
  dom.status.innerText = "RUNNING";
  dom.startBtn.innerText = "STOP";
  engine.gameLoop = setInterval(update, 1000 / 60);
}

function stopEngine() {
  engine.isRunning = false;
  clearInterval(engine.gameLoop);
  dom.status.innerText = "IDLE";
  dom.startBtn.innerText = "START";
}

dom.startBtn.addEventListener('click', () => {
  if (engine.isRunning) stopEngine();
  else startEngine();
});

  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') engine.keys.right = true;
    if (e.code === 'ArrowLeft') engine.keys.left = true;
    if (e.code === 'ArrowUp' || e.code === 'Space') engine.keys.up = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') engine.keys.shift = true;
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') engine.keys.right = false;
    if (e.code === 'ArrowLeft') engine.keys.left = false;
    if (e.code === 'ArrowUp' || e.code === 'Space') engine.keys.up = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') engine.keys.shift = false;
  });
