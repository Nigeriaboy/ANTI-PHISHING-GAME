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
  const correctSpan = document.getElementById("correct");
  correctSpan.textContent = `Correct: ${correctAnswers}`;
  const incorrectSpan = document.getElementById("incorrect");
  incorrectSpan.textContent = `Incorrect: ${incorrectAnswers}`;
}

function loadScenario() 
{
  if (currentScenarioIndex >= randomizedScenarios.length) {
    document.getElementById("scenario").textContent = "Game Over!";
    document.getElementById("image").innerHTML = "";
    document.getElementById("feedback").innerHTML = `Final Score:   <span id="correct-design">Correct: ${correctAnswers}</span>
    ,   <span id="incorrect-design">Incorrect: ${incorrectAnswers}</span>`;
    document.getElementById("explanation").style.display = "none";
    document.getElementById("stat-of-email").style.display = "none";
    document.getElementById("next").style.display = "none";
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

function handleSelection(userChoice) 
{

  /** Make the "phish" and the "legit" button dissappear after chosing answer */
  document.getElementById("phishBtn").style.display = "none";
  document.getElementById("legitBtn").style.display = "none";

  const scenario = randomizedScenarios[currentScenarioIndex];
  console.log("User Choice:", userChoice, "Correct Answer:", scenario.isCorrect); 
  
  const feedback = document.getElementById("feedback");
  const explanation = document.getElementById("explanation");
  if (scenario.isCorrect === userChoice)
  {
    feedback.innerHTML = `<div>Correct!</div> <div class="correctdiv"><img src="/static/Img/correct.png" alt= "correct" class="correct"></div>`;
    feedback.style.color = "green";
    correctAnswers++; 
  }
  else
  {
    feedback.innerHTML = `<div>Incorrect!</div> <div class="wrongdiv"><img src="/static/Img/wrong.png" alt= "wrong" class="wrong"></div>`;
    feedback.style.color = "red";
    incorrectAnswers++; 
  }

  /** Tell the user the correct answer based on the STAT of the email scenario */
  if (scenario.isCorrect === "legit"){
    document.getElementById("stat-of-email").textContent = "THE EMAIL SCENARIO IS LEGIT";
  }
  else{
    document.getElementById("stat-of-email").textContent = "THE EMAIL SCENARIO IS A PHISH ATTEMPT";
  }
  explanation.textContent = scenario.explanation;
  currentScenarioIndex++;
  updateScore();

  /** Go to next email scenario in 2s after the next button has been clicked*/
  document.querySelector(".next-button").addEventListener("click", () => setTimeout(loadScenario));
}

document.getElementById("phishBtn").addEventListener("click", () => handleSelection("phish")); 
document.getElementById("legitBtn").addEventListener("click", () => handleSelection("legit"));
loadScenario();
