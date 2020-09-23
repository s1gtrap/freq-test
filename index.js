let diff = 100, freq1 = 1000, freq2, oscillator, guesses = [];

const playSound = (time) => {
  if (oscillator) {
    oscillator.stop();
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  oscillator = audioCtx.createOscillator();

  oscillator.connect(audioCtx.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(freq1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(freq2, audioCtx.currentTime + time);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 2*time);
};

const shuffleFreqs = () => {
  if (Math.random() < 0.5) {
    const temp = freq1;
    freq1 = freq2;
    freq2 = temp;
  }
};

const reset = () => {
  diff = 100;
  freq2 = freq1 + diff;
  guesses = [];

  shuffleFreqs();
};

reset();

const guessesElem = document.getElementById('guesses');

const showGuesses = () => {
  while (guessesElem.firstChild) {
    guessesElem.removeChild(guessesElem.firstChild);
  }

  for (const [correct] of guesses) {
    const elem = document.createElement('div');

    elem.style.background = correct ? 'green' : 'red';

    guessesElem.appendChild(elem);
  }
};

const guess = () => {
  shuffleFreqs();

  if (guesses.length >= 10) {
    document.getElementById('result').textContent = `Score: ${Math.round(guesses[9][1] * 10) / 10} Hz`;

    reset();
  }

  showGuesses();
};

const correctGuess = () => {
  guesses.push([true, diff]);

  diff /= 2;
  freq1 = 1000;
  freq2 = freq1 + diff;

  guess();
};

const wrongGuess = () => {
  guesses.push([false, diff]);

  guess();
};

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      playSound(1);

      break;

    case "ArrowLeft":
      if (freq1 > freq2) {
        correctGuess();
      } else {
        wrongGuess();
      }

      playSound(1);

      break;

    case "ArrowRight":
      if (freq1 < freq2) {
        correctGuess();
      } else {
        wrongGuess();
      }

      playSound(1);

      break;
  }
});
