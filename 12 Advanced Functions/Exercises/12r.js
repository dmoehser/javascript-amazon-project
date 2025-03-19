let score = JSON.parse(localStorage.getItem(`score`)) || {
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

/*
if (!score) {
  score = {
    wins: 0,
    losses: 0,
    ties: 0,
  };
}
*/

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

let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1200);
    isAutoPlaying = true;
    document.querySelector('.auto-play-button').textContent = 'Stop Playing';
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    document.querySelector('.auto-play-button').textContent = 'Auto Play';
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
  localStorage.setItem(`score`, JSON.stringify(score));

  document.querySelector('.js-move').innerHTML = 
    `You
    <img src="${playerMove}-emoji.png" class="move-icon">
    <img src="${computerMove}-emoji.png" class="move-icon">
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
  localStorage.setItem('score', JSON.stringify(score)); 
  updateScore(); 
  document.querySelector('.js-result').innerHTML = '';
  document.querySelector('.js-move').innerHTML = '';
  resetCurrentGame();
}

// Attach EventListener to all move buttons to handle player's move selection.
// This ensures that the correct move is passed to the playGame function when the button is clicked.
const moveButtons = document.querySelectorAll('.js-move-button');
moveButtons.forEach(button => {
  button.addEventListener('click', () => {
    const move = button.getAttribute('data-move');
    playGame(move);
  });
});

document.body.addEventListener('keydown', (event) => {
 if (event.key === 'r') {
  playGame('rock');
  console.log('rock');
 } else if (event.key === 'p') {
    playGame('paper');
    console.log('paper');
 } else if (event.key === 's') {
    playGame('scissors');
    console.log('scissors');
 } 
}); 

// Add event listener to the auto-play button (click) and trigger autoPlay() when "a" is pressed

document.querySelector('.auto-play-button').addEventListener('click', () => {
  autoPlay();
});


  document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
      autoPlay();
    }
  });

// Function to display the custom confirmation popup
function showCustomConfirmationPopup() {
  const popup = document.getElementById('customConfirmationPopup');
  popup.style.display = 'flex'; // Show the popup

  // Event listener for the 'Yes' button
  document.getElementById('confirmYes').addEventListener('click', () => {
    resetScore(); // Reset score if 'Yes' is clicked
    console.log('Score reset');
    popup.style.display = 'none'; // Close the popup
  });

  // Event listener for the 'No' button
  document.getElementById('confirmNo').addEventListener('click', () => {
    console.log('Reset score denied');
    popup.style.display = 'none'; // Close the popup
  });
}

// Show the custom confirmation popup when needed (e.g., button click)
document.querySelector('.reset-score-button').addEventListener('click', showCustomConfirmationPopup);

// Event listener for pressing 'q' to reset the score
document.addEventListener('keydown', (event) => {
  if (event.key === 'q') {
    event.preventDefault();  
    showCustomConfirmationPopup(); // Show the custom popup on 'q' press
  }
});

  /*

  // Function to prompt the user for confirmation before resetting the score
  function confirmResetScore() {
    const userConfirmed = confirm('Are you sure you want to reset the score?');

   // If the user confirms, reset the score, otherwise do nothing
    if (userConfirmed) {
      resetScore();
      console.log('score reettet');
    } else {
      console.log('reset score denied');
    }
  }

  // Event listener for the reset button click, triggers the confirmation dialog
  document.querySelector('.reset-score-button').addEventListener('click', () => {
    confirmResetScore(); // Prompt user for confirmation before resetting score
  });

  // Event listener for the 'q' key press, triggers the confirmation dialog
  document.addEventListener('keydown', (event) => {
    if (event.key === 'q') {
      event.preventDefault();  
      confirmResetScore(); // Prompt user for confirmation before resetting score
    }
  });

*/
