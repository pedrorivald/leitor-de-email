var voicesList = setInterval(getVoices, 100);
var wordsList = setInterval(getWords, 100);
var voices = [], words = [], newsletter = "", timeoutSpeech, count = 0, booleanPaused = false, speed = 1;
var regex = /(<([^>]+)>)/gi;
var utterance = new SpeechSynthesisUtterance();

var head = document.createElement("head");
head.innerHTML = `
<link 
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
  integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
  crossorigin="anonymous"
/>`

var dialog = document.createElement("div");
var control = document.createElement("div");
var creator = document.createElement("div");

var play = document.createElement("div");
play.innerHTML = `<i class="fas fa-play-circle"></i>`;
var forward = document.createElement("div");
forward.innerHTML = `<i class="fas fa-forward"></i>`;
var backward = document.createElement("div");
backward.innerHTML = `<i class="fas fa-backward"></i>`;

var githubSpan = document.createElement("span");
githubSpan.innerHTML = `
  <a href="https://github.com/pedrorivald" target="_black">
    <i class="fab fa-github"></i>
  </a>`;
var speedSpan = document.createElement("span");
speedSpan.innerHTML = `${speed}x`;

dialog.classList.add("dialog");
control.classList.add("control");
creator.classList.add("creator");

control.appendChild(backward);
control.appendChild(play);
control.appendChild(forward);

creator.appendChild(speedSpan);
creator.appendChild(githubSpan);

dialog.appendChild(control);
dialog.appendChild(creator);

document.body.appendChild(head);
document.body.appendChild(dialog);

play.onclick = () => {
  if (booleanPaused) {
    booleanPaused = !booleanPaused;
    window.speechSynthesis.resume();
    timeoutSpeech = setTimeout(timeSpeech, 10000);
  } else {
    booleanPaused = !booleanPaused;
    window.speechSynthesis.pause();
    clearTimeout(timeoutSpeech);
  }

  if(!window.speechSynthesis.speaking) {
    count = 0;
    paragraphs(count);
  }
};

backward.onclick = () => {
  window.speechSynthesis.cancel();
  paragraphs(--count);
};

forward.onclick = () => {
  window.speechSynthesis.cancel();
  paragraphs(++count);
};

speedSpan.onclick = () => {
  switch (speed) {
    case 1:
      speed = 1.25;
      changeSpeed();
      break;
    case 1.25:
      speed = 1.5;
      changeSpeed();
      break;
    case 1.5:
      speed = 1;
      changeSpeed();
      break;
    default:
      speed = 1;
      changeSpeed();
      break;
  }
};

function changeSpeed() {
  speedSpan.innerHTML = `${speed}x`;
  window.speechSynthesis.cancel();
  paragraphs(count);
}

function timeSpeech() {
  timeoutSpeech = setTimeout(timeSpeech, 10000);
  if (!booleanPaused) {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }
}

function getVoices() {
  voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesListStopFunction();
    getWords();
  }
}

function voicesListStopFunction() {
  clearInterval(voicesList);
}

function wordsListStopFunction() {
  clearInterval(wordsList);
}

function getWords() {
  words = document.querySelectorAll("table tr td p");
  if (words.length > 0) {
    wordsListStopFunction();
    paragraphs(count);
  }
}

function paragraphs(count) {
  if (count < words.length && count >= 0) {
    newsletter = words[count].innerHTML.replace(regex, "");
    speakNewsletter(newsletter);
  } else { count = 0; }
}

function speakNewsletter(word) {
  var localVoice = voices.find((voice) => /pt-BR/.test(voice.lang));
  var voice = localVoice || voices[0];
  speak(word, voice);
}

function speak(word, voice) {
  utterance.text = word;
  utterance.lang = "pt-BR";
  utterance.voice = voice;
  utterance.rate = speed;
  window.speechSynthesis.cancel();
  timeoutSpeech = setTimeout(timeSpeech, 10000);
  utterance.onend = () => {
    clearTimeout(timeoutSpeech);
    count++;
    paragraphs(count);
  };
  window.speechSynthesis.speak(utterance);
}
