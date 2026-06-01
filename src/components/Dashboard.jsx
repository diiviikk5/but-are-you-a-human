import React, { useState } from 'react';

export default function Dashboard({
  metrics,
  trafficFeed,
  simulationRunning,
  toggleSimulation,
  onResetMetrics,
  onTriggerAttack
}) {
  const [activeTab, setActiveTab] = useState('log'); // 'log' | 'grammar' | 'cli'

  const renderGrammarDoc = () => (
    <div style={{ padding: '8px', fontSize: '0.75rem', color: '#abb2bf', fontFamily: 'var(--font-mono)', lineHeight: '1.5', overflowY: 'auto', height: '240px' }}>
      <div style={{ fontWeight: 'bold', color: 'var(--color-agent)', marginBottom: '8px' }}>ZEROLANG (.0) REFERENCE</div>
      
      <div style={{ marginBottom: '10px' }}>
        <span style={{ color: '#e5c07b', fontWeight: 'bold' }}>Function Declaration</span>
        <code style={{ display: 'block', background: '#0a0b0e', padding: '6px', margin: '4px 0', borderRadius: '4px', fontSize: '0.7rem' }}>
          pub fun check_policy(flow: String) -&gt; bool raises
        </code>
        <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '0.7rem' }}>
          Main policy entrypoint. Raises clause is required for standard assertions and checks.
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <span style={{ color: '#e5c07b', fontWeight: 'bold' }}>Side Effects Guard</span>
        <code style={{ display: 'block', background: '#0a0b0e', padding: '6px', margin: '4px 0', borderRadius: '4px', fontSize: '0.7rem' }}>
          check world.out.write("denied")
        </code>
        <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '0.7rem' }}>
          Impure effects require standard 'check' keywords prefix to compile.
        </p>
      </div>

      <div>
        <span style={{ color: '#e5c07b', fontWeight: 'bold' }}>Conditional block rules</span>
        <code style={{ display: 'block', background: '#0a0b0e', padding: '6px', margin: '4px 0', borderRadius: '4px', fontSize: '0.7rem' }}>
          if flow == "booking" &#123; ... &#125;
        </code>
        <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '0.7rem' }}>
          Mandatory curly braces on conditions. No semicolons required at lines ending.
        </p>
      </div>
    </div>
  );

  const renderCLIDoc = () => (
    <div style={{ padding: '8px', fontSize: '0.75rem', color: '#abb2bf', fontFamily: 'var(--font-mono)', lineHeight: '1.5', overflowY: 'auto', height: '240px' }}>
      <div style={{ fontWeight: 'bold', color: 'var(--color-agent)', marginBottom: '8px' }}>AGENT-BROWSER COMMANDS</div>
      
      <div style={{ background: '#0a0b0e', padding: '6px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--color-bot)' }}>open [url]</strong>: Navigates mock viewport.<br />
        <span style={{ color: 'var(--color-text-secondary)' }}>e.g. open /tickets, open /signup</span>
      </div>

      <div style={{ background: '#0a0b0e', padding: '6px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--color-bot)' }}>snapshot</strong>: Generates accessibility tree.<br />
        <span style={{ color: 'var(--color-text-secondary)' }}>Prints unique references (@e1, @e2)</span>
      </div>

      <div style={{ background: '#0a0b0e', padding: '6px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--color-bot)' }}>click [@ref]</strong>: Triggers tap event on ref.<br />
        <span style={{ color: 'var(--color-text-secondary)' }}>e.g. click @e3, click @seat_A1</span>
      </div>

      <div style={{ background: '#0a0b0e', padding: '6px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--color-bot)' }}>fill [@ref] [val]</strong>: Inputs text.<br />
        <span style={{ color: 'var(--color-text-secondary)' }}>e.g. fill @e2 Jane Doe</span>
      </div>

      <div style={{ background: '#0a0b0e', padding: '6px', borderRadius: '4px', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--color-bot)' }}>assert.contains [@ref] [text]</strong>: Verify DOM labels.<br />
        <span style={{ color: 'var(--color-text-secondary)' }}>e.g. assert.contains @e1 Tickets</span>
      </div>
    </div>
  );

  return (
    <div className="glass-panel simulator-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="simulator-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
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

      {/* Instant Traffic Triggers */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => onTriggerAttack('bot')} style={{ flex: 1, background: 'rgba(213, 0, 249, 0.1)', color: 'var(--color-bot)', border: '1px solid rgba(213, 0, 249, 0.25)', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold', transition: 'all 0.2s' }}>💥 Bot Attack</button>
        <button onClick={() => onTriggerAttack('agent')} style={{ flex: 1, background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-agent)', border: '1px solid rgba(0, 229, 255, 0.25)', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold', transition: 'all 0.2s' }}>🤖 Run Agent</button>
        <button onClick={() => onTriggerAttack('human')} style={{ flex: 1, background: 'rgba(0, 230, 118, 0.1)', color: 'var(--color-human)', border: '1px solid rgba(0, 230, 118, 0.25)', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold', transition: 'all 0.2s' }}>👤 Human Load</button>
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

      {/* Tab Navigation header */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', gap: '4px', marginBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('log')}
          style={{ flex: 1, background: activeTab === 'log' ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTab === 'log' ? '#fff' : 'var(--color-text-secondary)', border: 'none', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}
        >
          📡 Live Log
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          style={{ flex: 1, background: activeTab === 'grammar' ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTab === 'grammar' ? '#fff' : 'var(--color-text-secondary)', border: 'none', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}
        >
          📖 Zero Grammar
        </button>
        <button
          onClick={() => setActiveTab('cli')}
          style={{ flex: 1, background: activeTab === 'cli' ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTab === 'cli' ? '#fff' : 'var(--color-text-secondary)', border: 'none', borderRadius: '6px', fontSize: '0.75rem', padding: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}
        >
          🤖 CLI Actions
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'grammar' ? renderGrammarDoc() :
         activeTab === 'cli' ? renderCLIDoc() : (
          <>
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
          </>
        )}
      </div>
      
      {/* Policy Insights */}
      <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', fontSize: '0.8rem', marginTop: '12px' }}>
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
