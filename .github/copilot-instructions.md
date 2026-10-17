# Copilot instructions for this repository

This repository is a small JavaScript quiz app used for the GitHub Copilot Dev Days workshop. The project is intentionally lightweight: there is no bundler, framework, or backend. Most work happens in plain HTML, CSS, and browser-side JavaScript, with Node-based tests validating the logic.

## Build, test, and lint commands

This project has no lint step or build step. The main commands are:

- Run the full test suite:
  - `npm test`
- Start the local web app:
  - `npm start`
- Run a single test file directly:
  - `node --test tests/quiz.test.js`
  - `node --test tests/questions.test.js`

The Node test runner is built in, so there are no install steps beyond standard Node.js setup. The app is served via `npx --yes http-server src -p 8080 -c-1` when using `npm start`.

## High-level architecture

The repository is structured around a very small static web app:

- `src/index.html` is the page shell for the quiz UI.
- `src/style.css` contains the visual styling.
- `src/questions.js` defines the quiz data as a `QUESTIONS` array. Each question has:
  - `question`: the prompt text
  - `options`: four answer choices
  - `answer`: the zero-based index of the correct choice
- `src/quiz.js` contains the logic that is safe to test in Node.js, including:
  - `shuffle(items)`
  - `isCorrect(question, selectedIndex)`
  - `calculatePercentage(score, total)`
  - `getGrade(percentage)`
- `src/app.js` connects the page DOM to the quiz logic and manages the UI state (current question, score, screens, feedback, navigation).
- `tests/quiz.test.js` exercises the pure logic functions in `src/quiz.js`.
- `tests/questions.test.js` validates the questionnaire content and invariants, such as having at least 5 questions, exactly 4 options per question, and valid answer indexes.

The app intentionally separates pure logic from DOM code so it is easy to test without a browser. If you add new quiz logic, prefer placing it in `src/quiz.js` unless the code genuinely needs DOM access.

## Key conventions

- Keep logic testable in Node.js whenever possible. The `src/quiz.js` module is the pattern to follow for pure functions.
- Keep data definitions in `src/questions.js` and do not hide quiz content in the UI code.
- Use zero-based indexes for `answer` values in question objects; the tests enforce that each answer points to a valid option index.
- Preserve the browser-safe pattern used in the codebase:
  - guard browser-only code with DOM access patterns
  - keep `module.exports` for Node tests when a file is intended to be imported in tests
- Treat the app as a static site, not a framework app. Do not introduce build tooling or a framework unless the project explicitly changes direction.
- Maintain the workshop semantics: the repository is meant to be used as a teaching example and should stay simple and readable.

## Repository-specific guidance for Copilot

- Prefer small, targeted edits in the existing files rather than introducing new architecture.
- If changing question content, check both `src/questions.js` and `tests/questions.test.js` to keep the checkers valid.
- When fixing logic bugs, validate against the relevant Node test(s) first; this project is designed for quick iteration with the built-in `node:test` runner.
- Keep new functionality consistent with the current separation of concerns: data in `src/questions.js`, logic in `src/quiz.js`, UI behavior in `src/app.js`.

## Related documentation

- `README.md` is the best source for workshop goals, setup expectations, and the intended flow of the exercise.
- `workshops/` contains the guided workshop instructions for VS Code, CLI, and Copilot app flows.
