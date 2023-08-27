// Get references to HTML elements
var timerEl = document.getElementById('countdown');
var startbtn = document.getElementById("start");
var scoreEl = document.getElementById("score");
var scoreLabel = document.getElementById("scoreLabel");
var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var resultEl = document.getElementById("result");
var finalEl = document.getElementById("final");

// Initialize variables
var currentQuestionIndex = 0;
var timeInterval; // Declare the interval variable here
var timeLeft = 60;
var currentScore = 0;
var quizEnded = false;


// Define the questions array
var questions = [
    {
        questionText: "What is the first letter in HTML?",
        answerArray: ["H", "T", "M", "L"],
        correct: "H"
    },
    {
        questionText: "How many S's are in CSS?",
        answerArray: ["0", "1", "2", "3"],
        correct: "2"
    },
    {
        questionText: "Which word comes first in JavaScript?",
        answerArray: ["Java", "Script", "vaScr", "ipt"],
        correct: "Java"
    },
];

// Function to start the quiz and countdown timer
function startQuiz() {
    quizEnded = false;
    resetQuiz(); // Reset the quiz before starting
    displayQuestion();
    countdown();
    answersEl.style.display = "flex"; // Show the answer area
    startbtn.disabled = true; // Disable the start button
}

// Function to reset the quiz to its initial state
function resetQuiz() {
    currentQuestionIndex = 0;
    timeLeft = 60;
    currentScore = 0;
    resultEl.textContent = "";
    scoreEl.textContent = "0"; // Reset the score display
    finalEl.textContent = "";
    answersEl.innerHTML = ""; // Clear answer buttons
    startbtn.disabled = false; // Re-enable the start button
    timerEl.textContent = ""; // Clear the timer display
}

// Function to display questions and its answers
function displayQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.questionText;

    answersEl.innerHTML = ""; // Clear previous answers

    // Loop through answerArray and create answer buttons
    for (var i = 0; i < currentQuestion.answerArray.length; i++) {
        var answerButton = document.createElement("button");
        answerButton.textContent = currentQuestion.answerArray[i];

        // Use a closure to capture the current answer for the click event
        (function (selectedAnswer) {
            answerButton.addEventListener("click", function () {
                checkAnswer(currentQuestion.correct, selectedAnswer);
            });
        })(currentQuestion.answerArray[i]); // Pass the current answer to the closure

        answersEl.appendChild(answerButton);
    }
}

// Function to check the user's answer and move to the next question
function checkAnswer(correctAnswer, selectedAnswer) {
    if (quizEnded) { // Add this line
        return; // Add this line
    }
    if (correctAnswer === selectedAnswer) {
        currentScore += 100; // Increment the currentScore by 10
        resultEl.innerHTML = '<div style="text-align: center;"><span style="color: #00FF00;">Hooray!</span><br><span style="color: white;">You earned 100 points!</span></div>';
        scoreEl.textContent = currentScore; // Update the score display
        
    } else {
        resultEl.innerHTML = '<div style="text-align: center;"><span style="color: red;">Boo!</span><br><span style="color: white;">10 Second Penalty!</span></div>';
        timeLeft -= 10; // Subtract 10 seconds for an incorrect answer
    }

    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Function to end the quiz
function endQuiz() {
    quizEnded = true;
    clearInterval(timeInterval); // Clear the interval to stop the timer
    finalEl.textContent = "Game Over - Bonus Points for time awarded.";
    scoreLabel.textContent = "Final Score: ";
    scoreEl.textContent = (timeLeft+currentScore); // Update the score display

   // Delay calling promptForInitials to ensure proper sequence of events
   setTimeout(function () {
    promptForInitials();
    displayHighScoresPrompt(); // Display high scores prompt
    startbtn.disabled = false; // Re-enable the start button
    startbtn.textContent = "Try Again"; // Change the button text
}, 100);
}

// Function to handle the countdown timer
function countdown() {
    timeInterval = setInterval(function () {
        timeLeft--;

        timerEl.textContent = timeLeft;

        if (timeLeft === 0 || currentQuestionIndex >= questions.length) {
            endQuiz(); // Call endQuiz when the timer is up or all questions are answered
        }
    }, 1000);
}

// Function to prompt for player's initials
function promptForInitials() {
    var playerInitials = prompt("Enter your initials:");
    if (playerInitials !== null) {
        var totalScore = currentScore + timeLeft; // Store player's initials and total score in local storage
        
        // Store player's initials and score in local storage
        var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push({ initials: playerInitials, score: totalScore });

        highScores.sort((a, b) => b.score - a.score); // Sort the highScores array in descending order
        highScores = highScores.slice(0, 10);  // Keep only the top 10 scores

        localStorage.setItem("highScores", JSON.stringify(highScores));
    }
}

// Function to display the high scores prompt
function displayHighScoresPrompt() {
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    var scoresText = "High Scores:\n";

    highScores.sort((a, b) => b.score - a.score); // Sort in descending order (highest scores first)
    
    for (var i = 0; i < highScores.length; i++) {
        var entry = highScores[i];
        scoresText = scoresText.concat(
            `${i + 1}. ${entry.initials}: ${entry.score}\n`
        );
    }

    alert(scoresText);
}

// Attach the startQuiz function to the start button's click event
startbtn.addEventListener("click", startQuiz);