// Quiz questions.
// "answer" is the index (starting at 0) of the correct option.
const QUESTIONS = [
  {
    question: "Which command creates a new Git branch and switches to it?",
    options: ["git branch -d", "git switch -c", "git merge", "git push -u"],
    answer: 1,
  },
  {
    question: "Which file does GitHub show as a repository's front page?",
    options: ["index.txt", "README.md", "HOME.md", "about.html"],
    answer: 1,
  },
  {
    question: "What does PR stand for on GitHub?",
    options: ["Pull request", "Push release", "Project review", "Public repository"],
    answer: 0,
  },
  {
    question: "In GitHub Copilot, which key accepts an inline suggestion?",
    options: ["Enter", "Esc", "Tab", "Shift"],
    answer: 2,
  },
  {
    question: "Which file gives Copilot custom instructions for a repository?",
    options: [".github/copilot-instructions.md", "copilot.json", ".vscode/ai.txt", "package.json"],
    answer: 0,
  },
  {
    question: "What does `git clone` do?",
    options: [
      "Deletes a repository",
      "Copies a remote repository to your computer",
      "Creates a new branch",
      "Merges two branches",
    ],
    answer: 1,
  },
  {
    question: "Which command stages all changes for the next commit?",
    options: ["git add .", "git commit -m", "git push", "git status"],
    answer: 0,
  },
  {
    question: "Which command shows the commit history?",
    options: ["git log", "git history", "git status", "git show"],
    answer: 0,
  },
  {
    question: "Which command uploads your local commits to a remote repository?",
    options: ["git push", "git pull", "git fetch", "git upload"],
    answer: 0,
  },
  {
    question: "Where are GitHub Actions workflow files stored?",
    options: [".github/workflows/", ".github/actions/", "workflows/", "actions.yml"],
    answer: 0,
  },
  {
    question: "Which YAML key specifies when a workflow runs?",
    options: ["name", "jobs", "on", "uses"],
    answer: 2,
  },
  {
    question: "Which job property makes a job wait for another job?",
    options: ["runs-on", "steps", "env", "needs"],
    answer: 3,
  },
];

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS };
}
