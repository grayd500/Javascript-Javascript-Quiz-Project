// Get references to HTML elements
var timerEl = document.getElementById('countdown');
var startbtn = document.getElementById("start");
var scoreEl = document.getElementById("score");
var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var resultEl = document.getElementById("result");
var finalEl = document.getElementById("final");

// Initialize variables
var currentQuestionIndex = 0;
var timeInterval; // Declare the interval variable here
var timeLeft = 60;
var currentScore = 0;


// Define the questions array
var questions = [
    {
        questionText: "How many stooges are there?",
        answerArray: ["1", "2", "3", "4"],
        correct: "3"
    },
    {
        questionText: "How many pipers piping?",
        answerArray: ["12", "11", "10", "9"],
        correct: "11"
    },
    {
        questionText: "How many lives does a cat have?",
        answerArray: ["3", "6", "9", "12"],
        correct: "9"
    },
];

// Function to display a question and its answer choices
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

// Function to start the quiz and countdown timer
function startQuiz() {
    countdown();
    displayQuestion();
    answersEl.style.display = "flex"; // Show the answer area
}

// Function to check the user's answer and move to the next question
function checkAnswer(correctAnswer, selectedAnswer) {
    if (correctAnswer === selectedAnswer) {
        resultEl.textContent = "Hooray!";
        currentScore++;
    } else {
        resultEl.textContent = "Boo!";
        timeLeft -= 10; // Subtract 10 seconds for an incorrect answer
    }

    scoreEl.textContent = currentScore; // Update the score regardless of the answer

    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        clearInterval(timeInterval); // Clear the interval to stop the timer
        endQuiz();
    }

    
}

// Function to handle the countdown timer
function countdown() {
    timerEl.textContent = timeLeft;

    startbtn.disabled = true; // Disable the start button

    timeInterval = setInterval(function () {
        timeLeft--;

        timerEl.textContent = timeLeft;

        if (timeLeft === 0 || currentQuestionIndex >= questions.length) {
            clearInterval(timeInterval);
            endQuiz(); // Call endQuiz when the timer is up or all questions are answered
        }
    }, 1000);
}

// Function to handle the end of the quiz
function endQuiz() {
    clearInterval(timeInterval); // Clear the interval to stop the timer
    finalEl.textContent = "Game Over";
    startbtn.disabled = false; // Re-enable the start button when the game is over

    // Prompt the player for their initials
    var playerInitials = prompt("Enter your initials:");
    if (playerInitials !== null) {
        // Store player's initials and score in local storage
        var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push({ initials: playerInitials, score: currentScore });
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }

    displayHighScoresPrompt(); // Display the high scores prompt

    startbtn.disabled = false; // Re-enable the start button
}

// Function to display the high scores prompt
function displayHighScoresPrompt() {
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    var scoresText = "High Scores:\n";
    highScores.forEach(function (entry, index) {
        scoresText += `${index + 1}. ${entry.initials}: ${entry.score}\n`;
    });
    alert(scoresText);
}

 
// Attach the startQuiz function to the start button's click event
startbtn.addEventListener("click", startQuiz);
