function toggleButton(button) {
  // Disable 'isToggled' from all buttons
  if (!button.classList.contains('isToggled')) {
    const buttons = document.querySelectorAll('.js-button');
    buttons.forEach(b => b.classList.remove('isToggled'));

    // Add 'isToggled' to one button
    button.classList.add('isToggled');
  } else {
    button.classList.remove('isToggled');
  }
}

const buttons = document.querySelectorAll('.js-button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      toggleButton(button);
    });
  });


// Exercise 10D - 10G
/*
function toggleButton(button) {
  if (button.classList.contains('isToggled')) {
    button.classList.remove('isToggled');
  } else {
    button.classList.add('isToggled');
  }
}

const buttons = document.querySelectorAll('.js-button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    toggleButton(button);
  });
});


buttons.forEach(button => {
  button.addEventListener('click', () => {
  if (button.classList.contains('isToggled')) {
    button.classList.remove('isToggled');
  } else {
    button.classList.add('isToggled');
    }
  });
});



const button = document.querySelector('.js-gaming-button');

button.addEventListener('click', () => {
  button.classList.toggle('isToggled');
});
*/