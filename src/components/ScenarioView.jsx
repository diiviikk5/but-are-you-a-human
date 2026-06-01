import React from 'react';

export default function ScenarioView({
  scenario,
  viewMode,
  setViewMode,
  ticketSeats,
  onSeatClick,
  signupForm,
  onSignupFormChange,
  onSignupSubmit,
  inventoryData,
  captchaRequired,
  captchaValue,
  onCaptchaChange,
  captchaValid,
  message
}) {
  
  // Format visual DOM rendering for seat booking
  const renderTicketBookingVisual = () => (
    <div className="flow-screen">
      <div className="flow-title">🎫 NeonPulse Concert Tickets</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
        Select your seats and complete checkout. <strong>Price per ticket: $120.</strong>
      </p>
      
      <div className="ticket-grid">
        {ticketSeats.map((seat) => {
          let seatClass = 'seat available';
          if (seat.status === 'taken') seatClass = 'seat taken';
          if (seat.status === 'scalped') seatClass = 'seat scalped';
          if (seat.status === 'selected') seatClass = 'seat selected';
          
          return (
            <div
              key={seat.id}
              className={seatClass}
              onClick={() => seat.status === 'available' && onSeatClick(seat.id)}
            >
              {seat.name}
            </div>
          );
        })}
      </div>

      {captchaRequired && (
        <div className="glass-panel" style={{ padding: '12px', marginBottom: '16px', border: '1px solid var(--color-danger)' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--color-danger)' }}>🚨 Bot Protection CAPTCHA Required</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '8px 0' }}>
              <div style={{ background: '#2c3540', padding: '8px 16px', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-mono)', border: '1px dashed #526073', textDecoration: 'line-through' }}>
                H8T4Q
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Enter characters"
                value={captchaValue}
                onChange={(e) => onCaptchaChange(e.target.value)}
                style={{ width: '120px', textTransform: 'uppercase' }}
              />
            </div>
            {!captchaValid && captchaValue && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>Incorrect CAPTCHA text!</span>}
          </div>
        </div>
      )}

      <button className="btn" onClick={() => onSignupSubmit('booking')}>
        Confirm Ticket Checkout ($120)
      </button>
    </div>
  );

  // Format visual DOM rendering for SaaS Account signup
  const renderSaaSVisual = () => (
    <div className="flow-screen">
      <div className="flow-title">🚀 ScaleFlow Cloud - Free Trial</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
        Create an account to access the developer workspace.
      </p>

      <div className="input-group">
        <label className="input-label">Full Name</label>
        <input
          type="text"
          className="input-field"
          value={signupForm.name}
          onChange={(e) => onSignupFormChange('name', e.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      <div className="input-group">
        <label className="input-label">Email Address</label>
        <input
          type="email"
          className="input-field"
          value={signupForm.email}
          onChange={(e) => onSignupFormChange('email', e.target.value)}
          placeholder="jane@example.com"
        />
      </div>

      <div className="input-group">
        <label className="input-label">Cryptographic Attestation Key (Agents Only)</label>
        <input
          type="text"
          className="input-field"
          value={signupForm.attestation}
          onChange={(e) => onSignupFormChange('attestation', e.target.value)}
          placeholder="0x89f2c38..."
          style={{ fontFamily: 'var(--font-mono)' }}
        />
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
          * Leaving this blank triggers standard human CAPTCHA verification.
        </span>
      </div>

      {captchaRequired && (
        <div className="glass-panel" style={{ padding: '12px', marginBottom: '16px', border: '1px solid var(--color-danger)' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--color-danger)' }}>🚨 Captcha Protection</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '8px 0' }}>
              <div style={{ background: '#2c3540', padding: '8px 16px', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-mono)', border: '1px dashed #526073', textDecoration: 'line-through' }}>
                9K2W8
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Enter CAPTCHA"
                value={captchaValue}
                onChange={(e) => onCaptchaChange(e.target.value)}
                style={{ width: '120px', textTransform: 'uppercase' }}
              />
            </div>
          </div>
        </div>
      )}

      <button className="btn" onClick={() => onSignupSubmit('signup')}>
        Register Account
      </button>
    </div>
  );

  // Format visual DOM rendering for inventory scraping
  const renderInventoryVisual = () => (
    <div className="flow-screen">
      <div className="flow-title">📦 Apex Logistics Global Inventory</div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Standard product inventory tracking.
        </p>
        <button
          className="btn"
          style={{ width: 'auto', padding: '6px 12px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-agent)', border: '1px solid rgba(0, 229, 255, 0.3)' }}
          onClick={() => onSignupSubmit('scraping-api')}
        >
          ✓ Fetch Polite JSON Feed
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#abb2bf', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
            <th style={{ padding: '8px 4px' }}>PART NO</th>
            <th>DESCRIPTION</th>
            <th>STOCK LEVEL</th>
            <th>UNIT PRICE</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((part) => (
            <tr key={part.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '8px 4px', fontFamily: 'var(--font-mono)', color: 'var(--color-agent)' }}>{part.partNo}</td>
              <td>{part.description}</td>
              <td style={{ color: part.stock > 10 ? 'var(--color-human)' : 'var(--color-danger)' }}>{part.stock} units</td>
              <td>{part.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Accessibility representation showing simplified refs (how agent-browser views it)
  const renderAccessibilityTree = () => {
    if (scenario.id === 'booking') {
      return (
        <div className="a11y-tree-container">
          <div className="a11y-node">
            <span>[Header] NeonPulse Concert Tickets</span>
            <span className="a11y-ref">@e1</span>
          </div>
          <div className="a11y-node" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>[Grid] Seating Chart Selection (16 options)</span>
              <span className="a11y-ref">@e2</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', paddingLeft: '16px' }}>
              {ticketSeats.map((seat) => (
                <div key={seat.id} className={`a11y-node ${seat.status === 'selected' ? 'a11y-agent-interactive' : ''}`} style={{ padding: '4px', fontSize: '0.7rem' }}>
                  <span>[{seat.name}] {seat.status}</span>
                  <span style={{ fontSize: '0.6rem', color: '#ff0057' }}>@{seat.id}</span>
                </div>
              ))}
            </div>
          </div>
          {captchaRequired && (
            <div className="a11y-node a11y-agent-interactive">
              <span>[InputText] Bot Protection Check (CAPTCHA Required)</span>
              <span className="a11y-ref">@e4</span>
            </div>
          )}
          <div className="a11y-node a11y-agent-interactive">
            <span>[Button] Confirm Ticket Checkout ($120)</span>
            <span className="a11y-ref">@e3</span>
          </div>
        </div>
      );
    }

    if (scenario.id === 'signup') {
      return (
        <div className="a11y-tree-container">
          <div className="a11y-node">
            <span>[Header] ScaleFlow Cloud Signup Portal</span>
            <span className="a11y-ref">@e1</span>
          </div>
          <div className="a11y-node a11y-agent-interactive">
            <span>[InputText] Full Name - Value: "{signupForm.name}"</span>
            <span className="a11y-ref">@e2</span>
          </div>
          <div className="a11y-node a11y-agent-interactive">
            <span>[InputEmail] Email Address - Value: "{signupForm.email}"</span>
            <span className="a11y-ref">@e3</span>
          </div>
          <div className="a11y-node a11y-agent-interactive">
            <span>[InputText] Cryptographic Attestation Key - Value: "{signupForm.attestation}"</span>
            <span className="a11y-ref">@e4</span>
          </div>
          {captchaRequired && (
            <div className="a11y-node a11y-agent-interactive">
              <span>[InputText] Captcha Check Code - Value: "{captchaValue}"</span>
              <span className="a11y-ref">@e6</span>
            </div>
          )}
          <div className="a11y-node a11y-agent-interactive">
            <span>[Button] Register Account</span>
            <span className="a11y-ref">@e5</span>
          </div>
        </div>
      );
    }

    if (scenario.id === 'scraping') {
      return (
        <div className="a11y-tree-container">
          <div className="a11y-node">
            <span>[Header] Apex Logistics Global Inventory Portal</span>
            <span className="a11y-ref">@e1</span>
          </div>
          <div className="a11y-node a11y-agent-interactive">
            <span>[Button] Fetch Polite JSON API Feed</span>
            <span className="a11y-ref">@e2</span>
          </div>
          <div className="a11y-node" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}>
            <span>[Table] Inventory Data (4 parts)</span>
            <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {inventoryData.map((part) => (
                <div key={part.id} className="a11y-node" style={{ padding: '4px', fontSize: '0.7rem' }}>
                  <span>[{part.partNo}] {part.description} - stock: {part.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return <div>No accessibility tree available for this scenario.</div>;
  };

  return (
    <div className="glass-panel mock-browser-container">
      <div className="browser-bar">
        <div className="browser-dots">
          <span className="browser-dot red"></span>
          <span className="browser-dot yellow"></span>
          <span className="browser-dot green"></span>
        </div>
        <div className="browser-url-bar">
          <span className="lock">🔒</span>
          <span>{scenario.url}</span>
        </div>
      </div>
      
      <div className="dom-mode-toggle" style={{ margin: '16px' }}>
        <button
          className={`dom-toggle-btn ${viewMode === 'visual' ? 'active' : ''}`}
          onClick={() => setViewMode('visual')}
        >
          🌐 Visual Page (Human UX)
        </button>
        <button
          className={`dom-toggle-btn ${viewMode === 'a11y' ? 'active' : ''}`}
          onClick={() => setViewMode('a11y')}
        >
          🦾 Accessibility Tree (Agent View)
        </button>
      </div>

      <div className="browser-viewport">
        {message && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            background: message.success ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 23, 68, 0.12)',
            color: message.success ? 'var(--color-human)' : 'var(--color-danger)',
            border: `1px solid ${message.success ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 23, 68, 0.2)'}`,
            animation: 'fadeIn 0.3s ease'
          }}>
            {message.text}
          </div>
        )}
        
        {viewMode === 'visual' ? (
          scenario.id === 'booking' ? renderTicketBookingVisual() :
          scenario.id === 'signup' ? renderSaaSVisual() :
          renderInventoryVisual()
        ) : (
          renderAccessibilityTree()
        )}
      </div>
    </div>
  );
}
