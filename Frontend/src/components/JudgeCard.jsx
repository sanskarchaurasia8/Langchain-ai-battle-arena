import { useEffect, useState } from 'react';

function ScoreBar({ label, score, maxScore = 10, variant }) {
  const [width, setWidth] = useState(0);
  const pct = (score / maxScore) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="score-row">
      <div className="score-label-row">
        <span className={`score-label-${variant}`}>{label}</span>
        <span className="score-value">{score}/{maxScore}</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill progress-${variant}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function JudgeCard({ judge, problem }) {
  const winner = judge.solution_1_score >= judge.solution_2_score ? 'GPT-4' : 'Claude 3';

  return (
    <div id="judge-card" className="solution-card card-judge">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-header-icon">👑</div>
          <div className="card-header-info">
            <span className="card-title">Judge's Verdict</span>
            <span className="card-subtitle">AI Evaluation System</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Summary quote */}
        <div className="judge-reasoning">
          "The battle has been evaluated. Both models demonstrated strong problem-solving approaches with clear explanations. Scores are based on correctness, clarity, and best practices."
        </div>

        {/* Score bars */}
        <div className="judge-scores">
          <ScoreBar
            label="Solution 1 (GPT-4)"
            score={judge.solution_1_score}
            variant="1"
          />
          <ScoreBar
            label="Solution 2 (Claude 3)"
            score={judge.solution_2_score}
            variant="2"
          />
        </div>

        {/* Per-solution reasoning */}
        <div className="judge-reasoning-sections">
          <div className="judge-reasoning-block block-1">
            <div className="judge-reasoning-block-header">⚡ Solution 1 Analysis</div>
            {judge.solution_1_reasoning}
          </div>
          <div className="judge-reasoning-block block-2">
            <div className="judge-reasoning-block-header">💡 Solution 2 Analysis</div>
            {judge.solution_2_reasoning}
          </div>
        </div>

        {/* Winner */}
        <div className="judge-winner">
          <span className="judge-winner-label">🏆 Winner of this Battle</span>
          <span className="judge-winner-name">{winner}</span>
        </div>
      </div>
    </div>
  );
}
