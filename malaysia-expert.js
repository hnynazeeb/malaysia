const questions = [
  {
    id: "kuala-lumpur",
    region: "Kuala Lumpur",
    latLng: [3.139, 101.6869],
    question: "Which iconic attraction is most closely linked with Kuala Lumpur?",
    answers: ["Petronas Twin Towers", "Kinabalu Park", "Semenggoh Wildlife Centre", "Pantai Cenang"],
    correct: 0,
    success: "Correct. Kuala Lumpur is best known globally for the Petronas Twin Towers."
  },
  {
    id: "langkawi",
    region: "Langkawi",
    latLng: [6.35, 99.8],
    question: "What travel experience is Langkawi especially famous for?",
    answers: ["Tea plantations", "Island beaches and cable car views", "Mountain rail journeys", "River safaris"],
    correct: 1,
    success: "Correct. Langkawi is a strong sell for beaches, island leisure, and the SkyCab experience."
  },
  {
    id: "sabah",
    region: "Sabah",
    latLng: [5.9788, 116.0753],
    question: "Which major natural icon makes Sabah attractive to adventure-focused travelers?",
    answers: ["Mount Kinabalu", "Batu Caves", "Malacca River", "Cameron Highlands"],
    correct: 0,
    success: "Correct. Mount Kinabalu is one of Sabah's strongest destination hooks."
  },
  {
    id: "sarawak",
    region: "Sarawak",
    latLng: [1.5533, 110.3592],
    question: "Sarawak is a strong fit for which kind of traveler story?",
    answers: ["Luxury shopping only", "Heritage, rainforest, and culture-led exploration", "Snow tourism", "Desert expeditions"],
    correct: 1,
    success: "Correct. Sarawak stands out for nature, heritage, and cultural discovery."
  }
];

let currentIndex = 0;
let score = 0;

const questionStep = document.querySelector("#questionStep");
const popupQuestion = document.querySelector("#popupQuestion");
const answerGrid = document.querySelector("#answerGrid");
const popupFeedback = document.querySelector("#popupFeedback");
const nextButton = document.querySelector("#nextButton");
const scoreValue = document.querySelector("#scoreValue");
const regionItems = document.querySelectorAll("#regionList li");
const completionCard = document.querySelector("#completionCard");
const markers = new Map();

let map;

function createMap() {
  if (!window.L) {
    return;
  }

  map = L.map("expertMap", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([4.8, 109.8], 5);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  questions.forEach((question, index) => {
    const marker = L.marker(question.latLng, {
      icon: L.divIcon({
        className: "",
        html: `<div class="map-pin${index === 0 ? " is-current" : ""}" data-marker="${question.id}">${question.region}</div>`,
        iconSize: [132, 36],
        iconAnchor: [66, 18]
      })
    }).addTo(map);

    marker.on("click", () => {
      const targetIndex = questions.findIndex((item) => item.id === question.id);
      if (targetIndex <= currentIndex) {
        currentIndex = targetIndex;
        nextButton.hidden = false;
        renderQuestion();
      }
    });

    markers.set(question.id, marker);
  });
}

function setActiveRegion(questionId) {
  regionItems.forEach((item, index) => {
    item.classList.toggle("is-current", questions[index].id === questionId);
    item.classList.toggle("is-done", index < currentIndex);
  });

  markers.forEach((marker, id) => {
    const targetIndex = questions.findIndex((question) => question.id === id);
    const markerNode = marker.getElement()?.querySelector(".map-pin");
    if (!markerNode) {
      return;
    }

    markerNode.classList.toggle("is-current", id === questionId);
    markerNode.classList.toggle("is-done", targetIndex < currentIndex);
  });

  const current = questions[currentIndex];
  if (map && current) {
    map.flyTo(current.latLng, current.id === "langkawi" ? 7 : 6, {
      animate: true,
      duration: 0.8
    });
  }
}

function renderQuestion() {
  const current = questions[currentIndex];
  questionStep.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  popupQuestion.textContent = current.question;
  popupFeedback.textContent = "Answer the question linked to the highlighted city on the map.";
  nextButton.disabled = true;
  answerGrid.innerHTML = "";

  current.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => handleAnswer(button, index));
    answerGrid.appendChild(button);
  });

  setActiveRegion(current.id);
}

function handleAnswer(selectedButton, selectedIndex) {
  const current = questions[currentIndex];
  const buttons = answerGrid.querySelectorAll(".answer-button");
  const isCorrect = selectedIndex === current.correct;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === current.correct) {
      button.classList.add("is-correct");
    } else if (button === selectedButton && !isCorrect) {
      button.classList.add("is-wrong");
    }
  });

  if (isCorrect) {
    score += 1;
    popupFeedback.textContent = current.success;
  } else {
    popupFeedback.textContent = `Not quite. The correct answer is "${current.answers[current.correct]}".`;
  }

  scoreValue.textContent = `${score} / ${questions.length}`;
  nextButton.disabled = false;
}

function completeGame() {
  popupQuestion.textContent = "Tour complete.";
  questionStep.textContent = "Completed";
  answerGrid.innerHTML = "";
  popupFeedback.textContent = "Great work. This demo can now lead into rewards, certificates, or booking-linked incentives.";
  nextButton.hidden = true;
  completionCard.hidden = false;
  regionItems.forEach((item) => {
    item.classList.remove("is-current");
    item.classList.add("is-done");
  });
  markers.forEach((marker) => {
    const markerNode = marker.getElement()?.querySelector(".map-pin");
    if (markerNode) {
      markerNode.classList.remove("is-current");
      markerNode.classList.add("is-done");
    }
  });
}

nextButton.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    completeGame();
    return;
  }
  renderQuestion();
});

createMap();
renderQuestion();
