let score = JSON.parse(localStorage.getItem(`score-uat`)) || {
  wins: 0,
  losses: 0,
  ties: 0,
};

let isBestOfThree = false;
let currentGame = {
  playerWins: 0,
  computerWins: 0,
  rounds: 0
};

const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');
const tieSound = document.getElementById('tieSound');

updateScore();

function toggleGameMode() {
  isBestOfThree = !isBestOfThree;
  const modeButton = document.querySelector('.mode-button');
  modeButton.textContent = `Best of 3: ${isBestOfThree ? 'ON' : 'OFF'}`;
  
  if (isBestOfThree) {
    resetCurrentGame();
  }
}

function resetCurrentGame() {
  currentGame = {
    playerWins: 0,
    computerWins: 0,
    rounds: 0
  };
  updateGameStatus();
}

function updateGameStatus() {
  const statusElement = document.querySelector('.js-game-status');
  if (isBestOfThree) {
    statusElement.textContent = `Best of 3: ${currentGame.playerWins} - ${currentGame.computerWins}`;
  } else {
    statusElement.textContent = '';
  }
}

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = ``;

  if (playerMove === `scissors`) {
    if (computerMove === `scissors`) {
      result = `Tie.`;
    } else if (computerMove === `paper`) {
      result = `You win.`;
    } else if (computerMove === `rock`) {
      result = `You lose.`;
    }
  } else if (playerMove === `rock`) {
    if (computerMove === `rock`) {
      result = `Tie.`;
    } else if (computerMove === `paper`) {
      result = `You lose.`;
    } else if (computerMove === `scissors`) {
      result = `You win.`;
    }
  } else if (playerMove === `paper`) {
    if (computerMove === `paper`) {
      result = `Tie.`;
    } else if (computerMove === `rock`) {
      result = `You win.`;
    } else if (computerMove === `scissors`) {
      result = `You lose.`;
    }
  }

  // Update score and play sounds
  if (result === `You win.`) {
    score.wins += 1;
    currentGame.playerWins += 1;
    winSound.play();
    document.querySelector('.js-result').innerHTML = `
      <span style="color: green;" class="pulse">${result}</span>
    `;
  } else if (result === `You lose.`) {
    score.losses += 1;
    currentGame.computerWins += 1;
    loseSound.play();
    document.querySelector('.js-result').innerHTML = `
      <span style="color: red;" class="shake">${result}</span>
    `;
  } else if (result === `Tie.`) {
    score.ties += 1;
    tieSound.play();
    document.querySelector('.js-result').innerHTML = `
      <span style="color: yellow;">${result}</span>
    `;
  }

  currentGame.rounds += 1;
  localStorage.setItem(`score-uat`, JSON.stringify(score));

  document.querySelector('.js-move').innerHTML = 
    `You
    <img src="images/${playerMove}-emoji.png" class="move-icon">
    <img src="images/${computerMove}-emoji.png" class="move-icon">
    Computer`;

  updateScore();
  updateGameStatus();

  // Check for Best of 3 winner
  if (isBestOfThree && (currentGame.playerWins === 2 || currentGame.computerWins === 2)) {
    const winner = currentGame.playerWins > currentGame.computerWins ? 'You' : 'Computer';
    setTimeout(() => {
      alert(`${winner} won the Best of 3!`);
      resetCurrentGame();
    }, 500);
  }
}

function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = ``;

  if (randomNumber >= 0 && randomNumber < 1/3) {
    computerMove = `rock`;
  } else if (randomNumber >= 1/3 && randomNumber < 2/3) {
    computerMove = `paper`;
  } else if (randomNumber >= 2/3 && randomNumber < 1) {
    computerMove = `scissors`;
  }

  return computerMove;
} 

function updateScore() {
  document.querySelector(`.js-score`).innerHTML = `
    Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.setItem('score-uat', JSON.stringify(score)); 
  updateScore(); 
  document.querySelector('.js-result').innerHTML = '';
  document.querySelector('.js-move').innerHTML = '';
  resetCurrentGame();
} 