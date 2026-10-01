const LINES = [
  "3rd year Bachelor of Software Engineering student at The University of Auckland",
  "Coder",
  "Baller",
  "Lifter",
  "Co-President of the Web, Design, and Coding Club (WDCC)",
  "Intern at Atlassian",
];

const GOALS = [
  "Make cool software",
  "Help others around me upskill",
  "Get a 500kg SBD total and win the UoA competition",
];

export default function AboutPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Personal</h1>

      <ul className="mt-10 space-y-3 text-lg text-muted">
        {LINES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h2 className="mt-16 font-display text-4xl font-medium text-chalk">Goals</h2>

      <ul className="mt-6 space-y-3 text-lg text-muted">
        {GOALS.map((goal) => (
          <li key={goal}>{goal}</li>
        ))}
      </ul>
    </>
  );
}
