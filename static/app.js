let correctAnswers = 0;
let incorrectAnswers = 0;

function shuffleScenarios(scenarios) 
{
  return [...scenarios].sort(() => Math.random() - 0.5);
}

const randomizedScenarios = shuffleScenarios(emailScenarios);
console.log("Shuffled Scenarios:", randomizedScenarios);
let currentScenarioIndex = 0;

function updateScore() 
{
  const scoreDiv = document.getElementById("score");
  scoreDiv.textContent = `Correct: ${correctAnswers} Incorrect: ${incorrectAnswers}`;
}

function loadScenario() 
{
  if (currentScenarioIndex >= randomizedScenarios.length) {
    document.getElementById("scenario").textContent = "Game Over!";
    document.getElementById("image").innerHTML = "";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("feedback").textContent = `Final Score: Correct: ${correctAnswers}, Incorrect: ${incorrectAnswers}`;
    document.getElementById("explanation").textContent = "";
    return; 
  }
  
  const scenario = randomizedScenarios[currentScenarioIndex];
  console.log("Loading Scenario:", scenario);
  document.getElementById("image").innerHTML = `<img src="/static/${scenario.image}" alt="Scenario Image" class='img' width="800">`;
  
  document.getElementById("feedback").textContent = "";
  document.getElementById("explanation").textContent = "";
}

function handleSelection(userChoice) 
{
  const scenario = randomizedScenarios[currentScenarioIndex];
  console.log("User Choice:", userChoice, "Correct Answer:", scenario.isCorrect); 
  
  const feedback = document.getElementById("feedback");
  const explanation = document.getElementById("explanation");
  if (scenario.isCorrect === userChoice)
  {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
    correctAnswers++; 
  } else
  {
    feedback.textContent = "Incorrect!";
    feedback.style.color = "red";
    incorrectAnswers++; 
  }
  explanation.textContent = scenario.explanation;
  currentScenarioIndex++;
  updateScore(); 
  setTimeout(loadScenario, 5000); 
}

document.getElementById("phishBtn").addEventListener("click", () => handleSelection("phish")); 
document.getElementById("legitBtn").addEventListener("click", () => handleSelection("legit"));
loadScenario();
