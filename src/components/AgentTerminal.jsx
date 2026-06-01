import React, { useState, useRef, useEffect } from 'react';

export default function AgentTerminal({ onExecuteCommand, currentScenario }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Agent-Browser CLI v1.0.4 (Vercel Labs)' },
    { type: 'output', text: 'Type "agent-browser --help" or "help" for a list of available actions.' },
    { type: 'output', text: `Connected daemon session active for scenario: "${currentScenario.title}"` }
  ]);
  const [input, setInput] = useState('');
  const logsEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

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

    // If typed with or without agent-browser prefix
    if (program === 'agent-browser') {
      program = args[0];
      args = args.slice(1);
    }

    if (!program) {
      setHistory(prev => [...prev, { type: 'error', text: 'Error: No command provided.' }]);
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
        { type: 'ref', text: '  clear                 Clear terminal history buffer' }
      ]);
      return;
    }

    if (program === 'clear') {
      setHistory([]);
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
    } else {
      setHistory(prev => [...prev, { type: 'error', text: `Error: ${result.message}` }]);
    }
  };

  return (
    <div className="glass-panel terminal-panel">
      <div className="terminal-header">
        <div className="terminal-title">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-agent)', marginRight: '6px' }}></span>
          AGENT-BROWSER TERMINAL
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>PORT: 9222</span>
      </div>

      <div className="terminal-logs">
        {history.map((line, idx) => (
          <div key={idx} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="terminal-input-container">
        <span className="terminal-prompt">&gt;</span>
        <input
          type="text"
          className="terminal-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="agent-browser click @e3..."
          spellCheck="false"
        />
      </form>
    </div>
  );
}
