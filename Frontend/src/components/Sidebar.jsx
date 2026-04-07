import { Swords, History, Cpu, Trophy, Plus, BookOpen, LogOut } from 'lucide-react';

const navItems = [
  { id: 'arena', icon: Swords, label: 'Arena' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'models', icon: Cpu, label: 'Models' },
  { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
];

export default function Sidebar({ activeNav, onNavChange, onNewBattle }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">⚔️</span>
        <span className="sidebar-brand-name">AI BATTLE<br/>ARENA</span>
      </div>

      <button id="new-battle-btn" className="sidebar-new-battle-btn" onClick={onNewBattle}>
        <Plus size={14} />
        New Battle
      </button>

      <span className="sidebar-section-label">Navigation</span>

      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          id={`nav-${id}`}
          className={`sidebar-nav-item ${activeNav === id ? 'active' : ''}`}
          onClick={() => onNavChange(id)}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}

      <div className="sidebar-spacer" />

      <div className="sidebar-footer-item">
        <BookOpen size={14} />
        Docs
      </div>
      <div className="sidebar-footer-item">
        <LogOut size={14} />
        Logout
      </div>
    </nav>
  );
}
