// two target texts
const textMobile = `Programming is a valuable skill in today's digital world. Learning to code helps you think logically and solve problems efficiently, using creativity and technology together. It also opens career opportunities in web development, automation, and software engineering, empowering you to build apps and tools that make a positive impact. Even a basic understanding of coding can improve problem-solving skills and boost confidence in using technology.`;
const textDesktop = `Programming is an essential skill in today's rapidly evolving digital landscape. It empowers individuals to solve complex problems, automate repetitive tasks, and create powerful software solutions that transform industries. From web development with HTML, CSS, and JavaScript to artificial intelligence and data science, programming skills open endless opportunities. Learning to code improves logical thinking, attention to detail, and analytical skills, all of which are valuable across countless fields. With the ever-growing need for automation and digital transformation, coding knowledge equips you to build innovative applications, automate workflows, and even contribute to open-source communities. Practicing typing skills through applications like TypeSprint helps you develop speed and precision, essential for efficient programming. Whether you're just starting your journey or aiming to sharpen your skills, mastering programming is a smart investment in your future and a powerful tool for shaping the world around you.`;

// pick text based on screen size
const chosenText = window.innerWidth <= 768 ? textMobile : textDesktop;

const textDisplay = document.getElementById("textDisplay");
const inputArea = document.getElementById("inputArea");
const timeSpan = document.getElementById("time");
const wpmSpan = document.getElementById("wpm");
const accuracySpan = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");
const shareBtn = document.getElementById("share");
const themeToggle = document.getElementById("themeToggle");
const leaderboardList = document.getElementById("leaderboardList");

// render spans
textDisplay.innerHTML = chosenText.split("").map(c => `<span>${c}</span>`).join("");

let startTime;
let interval;
let timerRunning = false;

function startTimer() {
  startTime = new Date();
  timerRunning = true;
  interval = setInterval(() => {
    const currentTime = new Date();
    const secondsPassed = Math.floor((currentTime - startTime) / 1000);
    timeSpan.textContent = secondsPassed;

    if (secondsPassed >= 60) {
      endTest();
    }
  }, 1000);
}

function endTest() {
  clearInterval(interval);
  inputArea.disabled = true;
  calculateAccuracy();
  updateLeaderboard();
}

function calculateAccuracy() {
  const typed = inputArea.value;
  let correct = 0;
  for (let i=0; i<typed.length; i++) {
    if (typed[i] === chosenText[i]) {
      correct++;
    }
  }
  const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
  accuracySpan.textContent = accuracy;
}

inputArea.addEventListener("input", () => {
  const typed = inputArea.value;

  if (!timerRunning && typed.length > 0) {
    startTimer();
  }

  const typedWords = typed.trim().split(/\s+/).filter(Boolean).length;
  const elapsed = Math.floor((new Date() - startTime) / 1000) || 1;
  const wpm = Math.round((typedWords / elapsed) * 60);
  wpmSpan.textContent = wpm;

  const spans = textDisplay.querySelectorAll("span");
  spans.forEach((span, i) => {
    if (typed[i] == null) {
      span.classList.remove("correct", "incorrect");
    } else if (typed[i] === chosenText[i]) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  if (typed === chosenText) {
    endTest();
  }
});

restartBtn.addEventListener("click", () => {
  clearInterval(interval);
  inputArea.value = "";
  inputArea.disabled = false;
  timeSpan.textContent = "0";
  wpmSpan.textContent = "0";
  accuracySpan.textContent = "0";
  const spans = textDisplay.querySelectorAll("span");
  spans.forEach(span => span.classList.remove("correct","incorrect"));
  timerRunning = false;
});

shareBtn.addEventListener("click", () => {
  const wpm = wpmSpan.textContent;
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`I just typed ${wpm} WPM on TypeSprint! 🚀 Try it here:`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
});

// theme toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
} else {
  themeToggle.textContent = "🌙 Dark Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
});

// leaderboard
function updateLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({
    wpm: Number(wpmSpan.textContent),
    date: new Date().toLocaleString()
  });
  leaderboard.sort((a,b) => b.wpm - a.wpm);
  leaderboard = leaderboard.slice(0,5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.wpm} WPM on ${entry.date}`;
    leaderboardList.appendChild(li);
  });
}

showLeaderboard();
