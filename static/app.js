let correctAnswers = 0;
let incorrectAnswers = 0;
let scenariosPlayed = []; // Store scenario info for the report


function shuffleScenarios(scenarios) {
  return [...scenarios].sort(() => Math.random() - 0.5);
}

const randomizedScenarios = shuffleScenarios(emailScenarios);
console.log("Shuffled Scenarios:", randomizedScenarios);
let currentScenarioIndex = 0;

function updateScore() {
    const correctSpan = document.getElementById("correct");
    correctSpan.textContent = `Correct: ${correctAnswers}`;
    const incorrectSpan = document.getElementById("incorrect");
    incorrectSpan.textContent = `Incorrect: ${incorrectAnswers}`;
  }

function loadScenario() {
  if (currentScenarioIndex >= randomizedScenarios.length) {
    // Game Over Logic (modified to include report generation)
    displayGameOverReport();
    return;
  }

  /** Make the "phish" and "legit" button visible for another scenario */
  document.getElementById("phishBtn").style.display = "inline-block";
  document.getElementById("legitBtn").style.display = "inline-block";

  const scenario = randomizedScenarios[currentScenarioIndex];
  console.log("Loading Scenario:", scenario);
  document.getElementById("image").innerHTML = `<img src="/static/${scenario.image}" alt="Scenario Image" class='img' width="800">`;

  document.getElementById("feedback").textContent = "";
  document.getElementById("stat-of-email").textContent = "";
  document.getElementById("explanation").textContent = "";
}

function handleSelection(userChoice) {
    /** Make the "phish" and the "legit" button dissappear after chosing answer */
    document.getElementById("phishBtn").style.display = "none";
    document.getElementById("legitBtn").style.display = "none";
    const scenario = randomizedScenarios[currentScenarioIndex];
    console.log("User Choice:", userChoice, "Correct Answer:", scenario.isCorrect);
    const feedback = document.getElementById("feedback");
    const explanation = document.getElementById("explanation");
    let isCorrect = false; // Variable to store whether user is correct
    if (scenario.isCorrect === userChoice) {
        feedback.innerHTML = `<div>Correct!</div> <div class="correctdiv"><img src="/static/Img/correct.png" alt= "correct" class="correct"></div>`;
        feedback.style.color = "green";
        correctAnswers++;
        isCorrect = true;
    } else {
        feedback.innerHTML = `<div>Incorrect!</div> <div class="wrongdiv"><img src="/static/Img/wrong.png" alt= "wrong" class="wrong"></div>`;
        feedback.style.color = "red";
        incorrectAnswers++;
        isCorrect = false
    }
    //Tell the user the correct answer based on the STAT of the email scenario
    if (scenario.isCorrect === "legit") {
      document.getElementById("stat-of-email").textContent = "THE EMAIL SCENARIO IS LEGIT";
    } else {
      document.getElementById("stat-of-email").textContent = "THE EMAIL SCENARIO IS A PHISH ATTEMPT";
    }
    explanation.textContent = scenario.explanation;
    // Store user's answer and correct answer in scenariosPlayed
    scenariosPlayed.push({
      scenario: scenario.image,
      userChoice: userChoice,
      correctChoice: scenario.isCorrect,
      isCorrect : isCorrect
    });
  
  currentScenarioIndex++;
  updateScore();
  /** Go to next email scenario in 2s after the next button has been clicked*/
  document
    .querySelector(".next-button")
    .addEventListener("click", () => setTimeout(loadScenario));
}

function displayGameOverReport() {
  const scenarioDiv = document.getElementById("scenario");
  const imageDiv = document.getElementById("image");
  const buttonsDiv = document.getElementById("buttons");
  const feedbackDiv = document.getElementById("feedback");
  const explanationDiv = document.getElementById("explanation");

  // Hide game elements
  scenarioDiv.textContent = "Game Over!";
  imageDiv.innerHTML = "";
  buttonsDiv.style.display = "none";
  feedbackDiv.textContent = "";
  explanationDiv.textContent = "";


  // Generate Report Content
  let report = "<h2>Game Report</h2>";
  report += `<p>Final Score: Correct: ${correctAnswers}, Incorrect: ${incorrectAnswers}</p>`;
  report += "<br><br><b> Scenario-by-Scenario Breakdown: </b><br><br>";
  scenariosPlayed.forEach((item, index) => {
    report += `
        <b>Scenario ${index + 1}:</b><br>
        <b>Email:</b>  ${item.scenario} <br>
        <b>Your Choice:</b> ${item.userChoice}<br>
        <b>Correct Choice:</b> ${item.correctChoice} <br>
        <b>Result:</b> ${item.isCorrect? "Correct" : "Incorrect"}<br><br>
    `;
    });


  // Display the report
  document.getElementById("scoring-container").innerHTML = report; // Overwrite game area with the report
}


document
  .getElementById("phishBtn")
  .addEventListener("click", () => handleSelection("phish"));
document
  .getElementById("legitBtn")
  .addEventListener("click", () => handleSelection("legit"));
loadScenario();