// Globala variabler
let questions = [];
let results = [];

// blanda en array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Generera frågor
function generateQuestions(numQuestions) {
  const shuffled = shuffleArray([...students]);
  const selected = shuffled.slice(0, numQuestions);

  return selected.map((person) => {
    const incorrect = shuffleArray(
      students.filter((p) => p.id !== person.id)
    ).slice(0, 3);
    const options = shuffleArray([...incorrect, person]);
    return { person, options };
  });
}

// Visa frågor
function displayQuestions(questions) {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  questions.forEach((q, index) => {
    console.log("Bildsökväg:", q.person.image); // Logga för felsökning
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
      <img src="${q.person.image}" alt="Bild på klasskompisen">
      <div>
        ${q.options.map(option => `
          <button class="option" data-index="${index}" data-name="${option.name}">
            ${option.name}
          </button>
        `).join("")}
      </div>
    `;
    gameArea.appendChild(questionDiv);
  });

  document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", handleAnswer);
  });
}

// Hantera svar
function handleAnswer(event) {
  const button = event.target;
  const index = parseInt(button.dataset.index, 10);
  const name = button.dataset.name;

  const isCorrect = name === questions[index].person.name;

  results[index] = {
    isCorrect,
    correctAnswer: questions[index].person.name,
    guessedAnswer: name
  };

  button.style.backgroundColor = isCorrect ? "green" : "red";

  button.parentElement.querySelectorAll("button").forEach(btn => {
    btn.setAttribute("disabled", true);
  });

  // Kontrollera om alla frågor är besvarade
  if (results.length === questions.length && results.every(r => r !== undefined)) {
    showResults(); // Visa resultat automatiskt
  }
}

// Resultat
function showResults() {
  const resultsArea = document.getElementById("results");
  resultsArea.classList.remove("hidden");
  document.getElementById("game-area").classList.add("hidden");

  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalQuestions = results.length;

  let resultHTML = `<h2>Resultat: ${correctAnswers}/${totalQuestions} rätt!</h2>`;
  resultHTML += `<p>Du svarade rätt på ${correctAnswers} av ${totalQuestions} frågor.</p>`;

  // Lägg till detaljer för varje fråga
  results.forEach((result, index) => {
    resultHTML += `
      <div class="result">
        <p>Fråga ${index + 1}:</p>
        <p><strong>Rätt svar:</strong> ${result.correctAnswer}</p>
        <p><strong>Ditt svar:</strong> ${result.guessedAnswer}</p>
        ${result.isCorrect 
          ? "<p style='color: green;'>✔️ Korrekt!</p>" 
          : "<p style='color: red;'>❌ Fel!</p>"}
      </div>
    `;
  });

  resultsArea.innerHTML = resultHTML;
}

// Starta spelet
function startGame(numQuestions) {
  questions = generateQuestions(numQuestions);
  results = [];
  displayQuestions(questions);
  document.getElementById("game-area").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
}

// Eventlisteners
document.querySelectorAll(".question-count").forEach(button => {
  button.addEventListener("click", () => {
    const count = button.dataset.count === "all" ? students.length : parseInt(button.dataset.count, 10);
    startGame(count);
  });
});
document.getElementById("show-results").addEventListener("click", showResults);
