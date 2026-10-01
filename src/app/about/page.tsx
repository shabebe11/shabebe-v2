const LINES = [
  "3rd year Bachelor of Software Engineering student at The University of Auckland",
  "Coder",
  "Baller",
  "Lifter",
  "Co-President of the Web, Design, and Coding Club (WDCC)",
  "Intern at Atlassian",
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
    </>
  );
}
