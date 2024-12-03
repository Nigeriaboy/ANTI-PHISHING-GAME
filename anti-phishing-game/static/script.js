document.addEventListener("DOMContentLoaded", () => {
    const subjectElem = document.getElementById("subject");
    const bodyElem = document.getElementById("body");
    const feedbackElem = document.getElementById("feedback");
    const actionsElem = document.querySelector('.actions');
    const restartBtn = document.getElementById("restart-btn");
    const fromEmailElem = document.getElementById("from-email");  // Element to display the "From" email

    let currentScenarioId = null;

    async function fetchNextScenario() {
        const response = await fetch('/next_scenario');
        const data = await response.json();
        if (data.message) {
            subjectElem.textContent = data.message;
            bodyElem.textContent = '';
            fromEmailElem.textContent = '';  // Clear the "From" email if no more scenarios
            actionsElem.style.display = 'none'; // Hide actions (buttons) when there are no scenarios left
            restartBtn.style.display = 'block'; // Show the restart button if no scenarios left
        } else {
            currentScenarioId = data.id;
            subjectElem.textContent = data.subject;
            bodyElem.textContent = data.body;
            fromEmailElem.textContent = `From: ${data.from_email}`;  // Display the "From" email
            actionsElem.style.display = 'flex'; // Show actions (buttons) if scenarios are available
            restartBtn.style.display = 'none'; // Hide the restart button during the game
        }
    }

    async function markScenarioCompleted() {
        await fetch('/mark_completed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentScenarioId }),
        });
    }

    // Restart game function
    async function restartGame() {
        await fetch('/restart', { method: 'POST' }); // Send a request to restart scenarios
        feedbackElem.textContent = ''; // Clear feedback
        fetchNextScenario(); // Fetch the first scenario after system restart
    }

    document.getElementById("phish-btn").addEventListener("click", async () => {
        feedbackElem.textContent = "Correct! This is a phishing email.";
        await markScenarioCompleted();
        fetchNextScenario();
    });

    document.getElementById("legit-btn").addEventListener("click", async () => {
        feedbackElem.textContent = "Incorrect. This is not phishing.";
        await markScenarioCompleted();
        fetchNextScenario();
    });

    document.getElementById("restart-btn").addEventListener("click", restartGame); // Add event listener for restart button

    fetchNextScenario(); // Initial fetch to load the first scenario
});
