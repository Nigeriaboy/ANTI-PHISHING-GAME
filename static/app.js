let correctAnswers = 0;
let incorrectAnswers = 0;
let scenariosPlayed = []; // Store scenario info for the report

function shuffleScenarios(scenarios) {
  return [...scenarios].sort(() => Math.random() - 0.5);
}

const randomizedScenarios = shuffleScenarios(emailScenarios);
let currentScenarioIndex = 0;

function updateScore() {
  document.getElementById("correct").textContent = `Correct: ${correctAnswers}`;
  document.getElementById("incorrect").textContent = `Incorrect: ${incorrectAnswers}`;
}

function loadScenario() {
  if (currentScenarioIndex >= randomizedScenarios.length) {
    displayGameOverReport();
    return;
  }

  // Show the buttons for the next scenario
  document.getElementById("phishBtn").style.display = "inline-block";
  document.getElementById("legitBtn").style.display = "inline-block";

  const scenario = randomizedScenarios[currentScenarioIndex];
  document.getElementById("image").innerHTML = `<img src="/static/${scenario.image}" alt="Scenario Image" class='img' width="800">`;
  document.getElementById("feedback").textContent = "";
  document.getElementById("stat-of-email").textContent = "";
  document.getElementById("explanation").textContent = "";
}

function handleSelection(userChoice) {
  document.getElementById("phishBtn").style.display = "none";
  document.getElementById("legitBtn").style.display = "none";

  const scenario = randomizedScenarios[currentScenarioIndex];
  const feedback = document.getElementById("feedback");
  const explanation = document.getElementById("explanation");
  let isCorrect = false;

  if (scenario.isCorrect === userChoice) {
    feedback.innerHTML = `<div>Correct!</div> <div class="correctdiv"><img src="/static/Img/correct.png" alt="correct" class="correct"></div>`;
    feedback.style.color = "green";
    correctAnswers++;
    isCorrect = true;
  } else {
    feedback.innerHTML = `<div>Incorrect!</div> <div class="wrongdiv"><img src="/static/Img/wrong.png" alt="wrong" class="wrong"></div>`;
    feedback.style.color = "red";
    incorrectAnswers++;
  }

  document.getElementById("stat-of-email").textContent =
    scenario.isCorrect === "legit" ? "THE EMAIL SCENARIO IS LEGIT" : "THE EMAIL SCENARIO IS A PHISH ATTEMPT";
  explanation.textContent = scenario.explanation;

  scenariosPlayed.push({
    scenario: scenario.image,
    userChoice: userChoice,
    correctChoice: scenario.isCorrect,
    isCorrect: isCorrect,
    explanation: scenario.explanation,
  });

  currentScenarioIndex++;
  updateScore();

  // Move to the next scenario after a delay
  const nextButton = document.querySelector(".next-button");
  nextButton.onclick = () => loadScenario();
}

function displayGameOverReport() {
  const scenarioDiv = document.getElementById("scenario");
  const imageDiv = document.getElementById("image");
  const buttonsDiv = document.getElementsByClassName("buttons")[0]; // Use [0] to get the first matching element
  const feedbackDiv = document.getElementById("feedback");
  const explanationDiv = document.getElementById("explanation");

  // Hide game elements
  scenarioDiv.textContent = "Game Over!";
  imageDiv.innerHTML = "";
  buttonsDiv.style.display = "none";
  feedbackDiv.textContent = "";
  explanationDiv.textContent = "";

  // Generate Report Content
  let report = `
    <div class="report-container">
      <h2>Game Report</h2>
      <p>Final Score: Correct: ${correctAnswers}, Incorrect: ${incorrectAnswers}</p>
  `;

  // Check if user won or lost
  if (correctAnswers > incorrectAnswers) {
    report += '<h3 class="win-tag">You Won! 🎉</h3>';
  } else {
    report += '<h3 class="lost-tag">You Lost! 😔</h3>';
  }

  report += `
      <h3>Scenario-by-Scenario Breakdown:</h3>
      <div class="report-list">
  `;

  scenariosPlayed.forEach((item, index) => {
    report += `
      <div class="report-item">
        <h4>Scenario ${index + 1}</h4>
        <div class="scenario-image">
          <img src="/static/${item.scenario}" alt="Scenario ${index + 1}" />
        </div>
        <p><strong>Your Choice:</strong> ${item.userChoice}</p>
        <p><strong>Correct Choice:</strong> ${item.correctChoice}</p>
        <p><strong>Result:</strong> ${item.isCorrect ? "Correct" : "Incorrect"}</p>
        <p><strong>Explanation:</strong> ${item.explanation}</p>
      </div>
    `;
  });

  report += "</div></div>";

  // Display the report
  document.getElementById("scoring-container").innerHTML = report;
}



// Event Listeners
document.getElementById("phishBtn").addEventListener("click", () => handleSelection("phish"));
document.getElementById("legitBtn").addEventListener("click", () => handleSelection("legit"));

// Initialize Game
loadScenario();
