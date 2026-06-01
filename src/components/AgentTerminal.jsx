import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/audio';

export default function AgentTerminal({ onExecuteCommand, currentScenario }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Agent-Browser CLI v1.0.4 (Vercel Labs)' },
    { type: 'output', text: 'Type "agent-browser --help" or "help" for a list of available actions.' },
    { type: 'output', text: `Connected daemon session active for scenario: "${currentScenario.title}"` }
  ]);
  const [input, setInput] = useState('');
  const [terminalTheme, setTerminalTheme] = useState('cyan'); // 'cyan' | 'green' | 'amber' | 'white'
  const logsEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Map theme values to colors
  const themeColors = {
    cyan: '#00e5ff',
    green: '#00e676',
    amber: '#ffea00',
    white: '#f5f6f8'
  };

  const currentThemeColor = themeColors[terminalTheme];

  const handleInputChange = (e) => {
    setInput(e.target.value);
    playSound('beep'); // subtle keyboard tick synth sound!
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', text: `$ ${cmd}` }]);
    setInput('');

    // Parse and handle the command
    let tokens = cmd.split(/\s+/);
    let program = tokens[0];
    let args = tokens.slice(1);

    if (program === 'agent-browser') {
      program = args[0];
      args = args.slice(1);
    }

    if (!program) {
      setHistory(prev => [...prev, { type: 'error', text: 'Error: No command provided.' }]);
      playSound('error');
      return;
    }

    if (program === '--help' || program === 'help') {
      setHistory(prev => [
        ...prev,
        { type: 'output', text: 'Available agent-browser actions:' },
        { type: 'ref', text: '  open <url>            Navigate browser viewport to a specific scenario URL' },
        { type: 'ref', text: '  snapshot              Print current accessibility tree snapshot with deterministic refs' },
        { type: 'ref', text: '  click <@ref>          Trigger click action on the element specified by ref' },
        { type: 'ref', text: '  fill <@ref> <value>   Type character string into the input element specified by ref' },
        { type: 'ref', text: '  assert.contains <@r> <v> Asserts that the element visual label contains string' },
        { type: 'ref', text: '  assert.equals <@r> <v>   Asserts that an input text value matches exactly' },
        { type: 'ref', text: '  assert.exists <@ref>     Asserts that element is visible in active DOM' },
        { type: 'ref', text: '  clear                 Clear terminal history buffer' }
      ]);
      playSound('success');
      return;
    }

    if (program === 'clear') {
      setHistory([]);
      playSound('success');
      return;
    }

    // Call the parent execution handler
    const result = onExecuteCommand(program, args);

    if (result.success) {
      setHistory(prev => [
        ...prev,
        { type: 'success', text: `Success: ${result.message}` },
        ...(result.details ? result.details.map(d => ({ type: 'output', text: d })) : [])
      ]);
      playSound('success');
    } else {
      setHistory(prev => [...prev, { type: 'error', text: `Error: ${result.message}` }]);
      playSound('error');
    }
  };

  return (
    <div className="glass-panel terminal-panel" style={{ border: `1px solid rgba(255,255,255,0.06)`, boxShadow: `0 0 12px ${currentThemeColor}0a` }}>
      <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="terminal-title" style={{ color: currentThemeColor }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: currentThemeColor, marginRight: '6px', boxShadow: `0 0 8px ${currentThemeColor}` }}></span>
          AGENT-BROWSER TERMINAL
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', marginRight: '2px' }}>THEME:</span>
          <span onClick={() => { setTerminalTheme('cyan'); playSound('beep'); }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', cursor: 'pointer', border: terminalTheme === 'cyan' ? '1px solid #fff' : '1px solid rgba(0,0,0,0.5)' }}></span>
          <span onClick={() => { setTerminalTheme('green'); playSound('beep'); }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676', cursor: 'pointer', border: terminalTheme === 'green' ? '1px solid #fff' : '1px solid rgba(0,0,0,0.5)' }}></span>
          <span onClick={() => { setTerminalTheme('amber'); playSound('beep'); }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffea00', cursor: 'pointer', border: terminalTheme === 'amber' ? '1px solid #fff' : '1px solid rgba(0,0,0,0.5)' }}></span>
          <span onClick={() => { setTerminalTheme('white'); playSound('beep'); }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f5f6f8', cursor: 'pointer', border: terminalTheme === 'white' ? '1px solid #fff' : '1px solid rgba(0,0,0,0.5)' }}></span>
        </div>
      </div>

      <div className="terminal-logs">
        {history.map((line, idx) => {
          let customColor = '#abb2bf';
          if (line.type === 'command') customColor = currentThemeColor;
          if (line.type === 'success') customColor = 'var(--color-human)';
          if (line.type === 'error') customColor = 'var(--color-danger)';
          if (line.type === 'ref') customColor = 'var(--color-bot)';
          
          return (
            <div key={idx} className="terminal-line" style={{ color: customColor }}>
              {line.text}
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="terminal-input-container">
        <span className="terminal-prompt" style={{ color: currentThemeColor }}>&gt;</span>
        <input
          type="text"
          className="terminal-input-field"
          value={input}
          onChange={handleInputChange}
          placeholder="agent-browser click @e3..."
          spellCheck="false"
          style={{ caretColor: currentThemeColor }}
        />
      </form>
    </div>
  );
}
