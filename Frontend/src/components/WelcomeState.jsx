export default function WelcomeState({ examples, onExample }) {
  return (
    <div className="welcome-state">
      <div className="welcome-icon">⚔️</div>
      <h2 className="welcome-title">AI Battle Arena</h2>
      <p className="welcome-subtitle">
        Ask any coding question and watch two AI models compete to provide the best solution — with a judge to crown the winner.
      </p>
      <div className="welcome-examples">
        {examples.map((ex, i) => (
          <button
            key={i}
            id={`example-prompt-${i}`}
            className="welcome-example-chip"
            onClick={() => onExample(ex)}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
