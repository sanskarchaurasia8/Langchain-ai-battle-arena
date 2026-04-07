export default function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner-ring" />
      <p className="loading-text">
        Battle in progress
        <span className="loading-dots" style={{ marginLeft: '8px' }}>
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </span>
      </p>
      <p style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '-8px' }}>
        Both AI models are crafting their solutions
      </p>
    </div>
  );
}
