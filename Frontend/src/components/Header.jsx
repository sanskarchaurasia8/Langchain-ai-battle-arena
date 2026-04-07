import { Settings, User } from 'lucide-react';

export default function Header({ battleResult }) {
  const model1Name = 'GPT-4';
  const model2Name = 'Claude 3';
  const battling = !!battleResult;

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-subtitle">The Observatory</span>
        <h1 className="header-title">
          {battling ? `"${battleResult.problem.slice(0, 45)}${battleResult.problem.length > 45 ? '…' : ''}"` : 'AI High-Stakes'}
        </h1>
      </div>

      <div className="header-center">
        <div className="header-model-badge model-1">
          <span className="dot" />
          {model1Name}
        </div>
        <span className="header-vs-badge">VS</span>
        <div className="header-model-badge model-2">
          <span className="dot" />
          {model2Name}
        </div>
      </div>

      <div className="header-right">
        <button id="header-settings-btn" className="header-icon-btn" aria-label="Settings">
          <Settings size={15} />
        </button>
        <button id="header-profile-btn" className="header-icon-btn" aria-label="Profile">
          <User size={15} />
        </button>
      </div>
    </header>
  );
}
