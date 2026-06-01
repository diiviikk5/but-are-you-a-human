import React from 'react';

export default function Dashboard({
  metrics,
  trafficFeed,
  simulationRunning,
  toggleSimulation,
  onResetMetrics
}) {
  return (
    <div className="glass-panel simulator-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="simulator-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📡 REAL-TIME POLICY SIMULATOR</h3>
          <button
            className="play-pause-btn"
            onClick={toggleSimulation}
            style={{
              background: simulationRunning ? 'var(--color-danger)' : 'var(--color-agent)',
              boxShadow: simulationRunning ? '0 0 12px rgba(255, 23, 68, 0.3)' : 'var(--glow-agent)'
            }}
          >
            {simulationRunning ? '⏸ Pause Traffic' : '▶ Start Traffic'}
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
          Simulates continuous web requests hitting the active Zero policy.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Human Friction</h4>
          <div className="metric-value green">{metrics.humanFriction}%</div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>
            {metrics.humanFriction > 40 ? '⚠️ High Friction' : '✓ Good UX'}
          </span>
        </div>
        <div className="metric-card">
          <h4>Agent Success</h4>
          <div className="metric-value cyan">{metrics.agentSuccess}%</div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>
            {metrics.agentRequests} requests
          </span>
        </div>
        <div className="metric-card">
          <h4>Bots Blocked</h4>
          <div className="metric-value purple">{metrics.botsBlocked}%</div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>
            {metrics.botRequests} requests
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>
          Live Traffic Log
        </span>
        <button
          onClick={onResetMetrics}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-agent)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}
        >
          Reset Stats
        </button>
      </div>

      {/* Live traffic rows list */}
      <div className="traffic-feed" style={{ flex: 1 }}>
        {trafficFeed.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Waiting to start traffic simulator...
          </div>
        ) : (
          trafficFeed.map((log) => (
            <div key={log.id} className={`traffic-row ${log.type}`}>
              <span className={`traffic-label ${log.type}`}>{log.type}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                  {log.action}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>
                  Rate: {log.rate}/min • {log.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className={`traffic-decision ${log.allow ? 'allow' : 'deny'}`}>
                {log.allow ? '✓ ALLOW' : '❌ DENY'}
                {log.reason && (
                  <span style={{ fontSize: '0.65rem', color: '#ff5252', display: 'block', fontWeight: 'normal', textAlign: 'right' }}>
                    ({log.reason})
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Policy Insights */}
      <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', fontSize: '0.8rem' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--color-agent)', marginBottom: '4px' }}>🛡️ Defensive Insights</div>
        {metrics.botsBlocked < 50 ? (
          <div style={{ color: 'var(--color-danger)' }}>
            ⚠️ <strong>Bot Vulnerability:</strong> Bots are bypassing policies! Add a rate limit or block unverified bots to secure inventory.
          </div>
        ) : metrics.humanFriction > 50 ? (
          <div style={{ color: 'var(--color-warning)' }}>
            ⚠️ <strong>Human Friction warning:</strong> Human checkout friction is very high. Make agent flows smoother by using verified attestations!
          </div>
        ) : (
          <div style={{ color: 'var(--color-human)' }}>
            ✓ <strong>Optimal Configuration:</strong> Securely blocking abuse while preserving high agent throughput and seamless human UX!
          </div>
        )}
      </div>
    </div>
  );
}
