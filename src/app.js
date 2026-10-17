// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_LIMIT = 15;
let state = createQuiz([]);

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const answerFeedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const startBestScoreText = document.getElementById("start-best-score");
const resultBestScoreText = document.getElementById("result-best-score");
const newBestMessage = document.getElementById("new-best-message");

let questionTimer = null;
const BEST_SCORE_KEY = "dev-days-quiz-best-score";

function readBestScore() {
  try {
    const savedScore = localStorage.getItem(BEST_SCORE_KEY);
    if (savedScore === null) return { score: null, available: true };

    const score = Number(savedScore);
    if (Number.isInteger(score) && score >= 0 && score <= 100) {
      return { score, available: true };
    }
    return { score: null, available: true };
  } catch (error) {
    console.warn("Unable to read the best score from localStorage.", error);
    return { score: null, available: false };
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    return true;
  } catch (error) {
    console.warn("Unable to save the best score to localStorage.", error);
    return false;
  }
}

let bestScoreStatus = readBestScore();

function formatBestScore() {
  if (!bestScoreStatus.available) return "Best score: unavailable";
  return bestScoreStatus.score === null
    ? "Best score: No record yet"
    : `Best score: ${bestScoreStatus.score}%`;
}

function updateBestScoreDisplays() {
  const text = formatBestScore();
  startBestScoreText.textContent = text;
  resultBestScoreText.textContent = text;
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function stopQuestionTimer() {
  if (questionTimer !== null) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(state.timeLeft);
  timerText.classList.toggle("low-time", state.timeLeft <= 5);
}

function startQuestionTimer() {
  stopQuestionTimer();
  state = startQuestion(state, QUESTION_TIME_LIMIT);
  updateTimerDisplay();

  questionTimer = setInterval(() => {
    state = tickQuestion(state);
    updateTimerDisplay();

    if (state.timeLeft === 0) {
      expireQuestion();
    }
  }, 1000);
}

function finishQuestion() {
  if (state.questionAnswered) return null;

  stopQuestionTimer();
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  nextButton.hidden = false;
  return buttons;
}

function expireQuestion() {
  const buttons = finishQuestion();
  if (!buttons) return;

  state = markQuestionAnswered(state);
  const question = state.questions[state.current];
  buttons[question.answer].classList.add("correct");
  answerFeedback.textContent = "Time's up!";
  nextButton.focus();
}

function startQuiz() {
  stopQuestionTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopQuestionTimer();
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  answerFeedback.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startQuestionTimer();
}

function selectAnswer(selectedIndex, selectedButton) {
  const buttons = finishQuestion();
  if (!buttons) return;

  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  const question = state.questions[state.current];

  if (result.correct) {
    selectedButton.classList.add("correct");
    answerFeedback.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    answerFeedback.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.focus();
}

function nextQuestion() {
  stopQuestionTimer();
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopQuestionTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const newBest = isNewBestScore(percentage, bestScoreStatus.score);

  newBestMessage.textContent = "";
  if (newBest) {
    bestScoreStatus = {
      score: percentage,
      available: saveBestScore(percentage),
    };
    newBestMessage.textContent = "🏆 New best score!";
  }

  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  document.getElementById("feedback-message").textContent = getFeedbackMessage(getGrade(percentage));
  updateBestScoreDisplays();
  showScreen(resultScreen);
}

updateBestScoreDisplays();
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
