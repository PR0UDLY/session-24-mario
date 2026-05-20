/**
 * CORE LOGIC - MARIO GAME
 * Session 24 Focus: Control Structures (if, else, switch)
 *
 * Your task: Implement the logic for the game using control structures.
 *
 * Do NOT use arrays, loops, or complex DOM manipulation here.
 * The game engine will rely on your functions to decide what happens!
 */

/**
 * Task 1: Advanced Collision Detection
 * A collision happens when the player and an entity overlap.
 * In a real game, direction matters!
 *
 * @param {number} playerX
 * @param {number} playerY
 * @param {number} entityX
 * @param {number} entityY
 * @returns {string} - 'none', 'top' (jumped on), or 'side' (hit from side)
 */
function detectCollisionType(playerX, playerY, entityX, entityY) {
  // Horizontal distance
  let distX = Math.abs(playerX - entityX);
  // Vertical distance
  let distY = Math.abs(playerY - entityY);

  // TODO: Use IF/ELSE
  // 1. If distance X is >= 40 OR distance Y is >= 40, return 'none' (too far)
  // 2. Otherwise, they ARE colliding.
  // 3. Now check WHERE they hit:
  //    If playerY is significantly higher than entityY (e.g., playerY - entityY > 20), return 'top'
  // 4. Otherwise, it must be a side hit, so return 'side'

  if (distX >= 40 || distY >= 40) {
    return "none";
  }

  if (playerY - entityY > 20) {
    return "top";
  } else {
    return "side";
  }
}

/**
 * Task 2: PowerUp Score
 * Mario can collect items. Give them points using a switch statement.
 *
 * @param {string} itemType - 'coin', 'mushroom', 'star', 'fireflower'
 * @returns {number} The score value
 */
function calculateItemScore(itemType) {
  // TODO: Use a SWITCH statement!
  // 'coin' -> 100
  // 'mushroom' -> 1000
  // 'fireflower' -> 2000
  // 'star' -> 5000
  // default -> 0
  switch (itemType) {
    case "coin":
      return 100;
    case "mashroom":
      return 1000;
    case "fireflower":
      return 2000;
    case "star":
      return 5000;
    default:
      return 0;
  }
}

/**
 * Task 3: Enemy Interaction Result
 * What happens when Mario touches an enemy?
 *
 * @param {string} collisionType - 'top', 'side', or 'none'
 * @param {boolean} isInvincible - True if Mario has a Star
 * @returns {string} - 'defeat_enemy', 'mario_takes_damage', or 'nothing'
 */
function handleEnemyInteraction(collisionType, isInvincible) {
  // TODO: Use IF/ELSE
  // 1. If collisionType is 'none', Mario touched nothing, so return 'nothing'
  // 2. If isInvincible is true, Mario is powerful! Return 'defeat_enemy'
  // 3. If collisionType is 'top', Mario jumped on it! Return 'defeat_enemy'
  // 4. Otherwise (it must be 'side'), Mario gets hurt! Return 'mario_takes_damage'
  if (collisionType === "none") {
    return "nothing";
  }
  if (isInvincible) {
    return "defeat_enemy";
  }
  if (collisionType === "top") {
    return "defeat_enemy";
  }

  return "mario_takes_damage";
}

/**
 * Task 4: Platform Landing Logic
 * Determine if Mario should land on a platform.
 *
 * @param {number} playerY
 * @param {number} playerVY - vertical velocity (negative means falling)
 * @param {number} platformY
 * @returns {boolean} - true if Mario lands, false if he passes through
 */
function shouldLandOnPlatform(playerY, playerVY, platformY) {
  // TODO: Use Nested IF statements
  // Mario lands ONLY IF:
  // 1. He is falling (playerVY < 0)
  // 2. AND his feet (playerY) are above or at the platform surface (playerY >= platformY)
  // 3. AND he is close enough to the top that he should snap to it (playerY - platformY < 30)
  if (playerVY < 0 && playerY >= platformY && playerY - platformY < 30) {
    return true;
  }
  return false;
}

/**
 * Task 5: Walking Speed Logic
 * Mario moves faster when dashing (holding Shift).
 *
 * @param {boolean} isDashing - True if holding Shift
 * @returns {number} - The speed value
 */
function getWalkingSpeed(isDashing) {
  // TODO: Use IF/ELSE
  // 1. If dashing is true, return 12 (high speed)
  // 2. Otherwise, return 7 (normal speed)
  if (isDashing) {
    return 12;
  } else {
    return 7;
  }
}

/**
 * Task 6: Jump Power Logic
 * Mario jumps higher if he has a Mushroom powerup!
 *
 * @param {boolean} hasMushroom - True if Mario is big
 * @returns {number} - The jump velocity (power)
 */
function getJumpPower(hasMushroom) {
  // TODO: Use IF/ELSE
  // 1. If hasMushroom is true, return 25 (Super Jump)
  // 2. Otherwise, return 18 (Normal Jump)
  if (hasMushroom) {
    return 25;
  } else {
    return 18;
  }
}

/**
 * Task 7: Status Bar Message
 * Display a unique message in the UI based on Mario's state.
 *
 * @param {number} lives - Current lives left
 * @param {boolean} hasStarPower - True if invincible
 * @returns {string} - The message to display
 */
function getStatusMessage(lives, hasStarPower) {
  // TODO: Use IF / ELSE IF / ELSE or SWITCH
  // 1. If hasStarPower is true, return "🌟 INVINCIBLE! 🌟"
  // 2. Else if lives is 1, return "⚠️ LAST CHANCE! ⚠️"
  // 3. Else if lives is 0, return "💀 GAME OVER 💀"
  // 4. Otherwise, return "🍄 MARIO IS READY! 🍄"
  if (hasStarPower) {
    return "🌟 INVINCIBLE! 🌟";
  } else if (lives === 1) {
    return "⚠️ LAST CHANCE! ⚠️";
  } else if (lives === 0) {
    return "💀 GAME OVER 💀";
  } else {
    return "🍄 MARIO IS READY! 🍄";
  }
  return "RUNNING";
}

/**
 * Task 8: Gravity Multiplier (Advanced Physics)
 * Gravity changes based on what Mario is doing.
 * Heavy gravity makes him fall faster!
 *
 * @param {boolean} isJumping
 * @param {boolean} isDashing
 * @returns {number} - The gravity force (e.g., 1.2, 2.0, etc.)
 */
function getGravityMultiplier(isJumping, isDashing) {
  // TODO: Use IF/ELSE with multiple conditions (&&)
  // 1. If Mario is NOT jumping and NOT dashing, return 1.2 (Normal)
  // 2. If he is Jumping AND Dashing, return 0.8 (Floaty Jump)
  // 3. If he is Dashing but NOT jumping, return 2.5 (Fast Ground Physics)
  // 4. Otherwise, return 1.2
  if (!isJumping || !isDashing) {
    return 1.2;
  }
  if (isJumping && isDashing) {
    return 0.8;
  }
  if (isDashing && !isJumping) {
    return 0.8;
  } else {
    return 1.2;
  }
}

/**
 * Task 9: Final Score Calculator (Math + Conditionals)
 * Calculate total points for an item with bonuses.
 *
 * @param {number} basePoints - Points from core item logic
 * @param {number} comboMultiplier - Current x2 or x3 combo
 * @param {boolean} isStarActive - Bonus active
 * @returns {number} - The final points to add
 */
function getFinalScore(basePoints, comboMultiplier, isStarActive) {
  // TODO: Use Math and Nested IFs
  // 1. Create a variable for results: let total = basePoints * comboMultiplier;
  // 2. If isStarActive is true:
  //      - Add 500 bonus points to the total.
  //      - If the basePoints was already high (> 500), add ANOTHER 1000 points!
  // 3. Return the total.
  let total = basePoints * comboMultiplier;

  if (isStarActive) {
    total += 500;

    if (basePoints > 500) {
      total += 1000;
    }
  }

  return total;
}
