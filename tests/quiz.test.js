// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  calculatePercentage,
  formatTimeLeft,
  getGrade,
  getFeedbackMessage,
  createQuiz,
  answerQuestion,
  isQuizFinished,
  startQuestion,
  tickQuestion,
  markQuestionAnswered,
  advanceQuestion,
} = require("../src/quiz.js");

test("createQuiz initializes a new state with the supplied questions", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, {
    questions,
    current: 0,
    score: 0,
    timeLeft: 0,
    questionAnswered: false,
  });
  assert.notEqual(state, questions);
});

test("answerQuestion returns a new state and increments score for a correct answer", () => {
  const initialState = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(initialState, 1);

  assert.equal(result.correct, true);
  assert.deepEqual(result.state, { ...initialState, score: 1, questionAnswered: true });
  assert.deepEqual(initialState, createQuiz(initialState.questions));
});

test("answerQuestion marks an incorrect answer without incrementing score", () => {
  const initialState = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(initialState, 0);

  assert.equal(result.correct, false);
  assert.deepEqual(result.state, { ...initialState, questionAnswered: true });
  assert.equal(initialState.questionAnswered, false);
});

test("isQuizFinished becomes true after advancing past the final question", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished(advanceQuestion(state)), true);
});

test("question state transition helpers return updated states without mutation", () => {
  const state = createQuiz([{ answer: 0 }]);
  const started = startQuestion(state, 15);
  const ticked = tickQuestion(started);
  const answered = markQuestionAnswered(ticked);

  assert.equal(started.timeLeft, 15);
  assert.equal(ticked.timeLeft, 14);
  assert.equal(answered.questionAnswered, true);
  assert.deepEqual(state, createQuiz(state.questions));
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("formatTimeLeft includes seconds when time remains", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats the threshold when five seconds remain", () => {
  assert.equal(formatTimeLeft(5), "⏱ 5s");
});

test("formatTimeLeft shows zero when time expires", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade boundaries are inclusive at 90%, 75% and 50%", () => {
  assert.equal(getGrade(89), "B");
  assert.equal(getGrade(75), "B");
  assert.equal(getGrade(74), "C");
  assert.equal(getGrade(50), "C");
  assert.equal(getGrade(49), "Keep practicing");
});

test("getFeedbackMessage returns the matching message for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work! You're a quiz master!");
  assert.equal(getFeedbackMessage("B"), "Good job! Keep up the great work!");
  assert.equal(getFeedbackMessage("C"), "Not bad! Keep practicing and you'll get there!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing and you'll improve!");
});
