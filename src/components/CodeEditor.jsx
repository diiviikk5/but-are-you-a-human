import React, { useState } from 'react';
import { runCompilerTests } from '../compiler/zeroTestRunner';
import { playSound } from '../utils/audio';

export default function CodeEditor({ code, onChange, compileResult, onLoadPreset }) {
  const [testResults, setTestResults] = useState(null);

  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  const handleRunTests = () => {
    playSound('trigger');
    const res = runCompilerTests();
    setTestResults(res);
    playSound(res.success ? 'success' : 'error');
    setTimeout(() => setTestResults(null), 5000); // clear after 5 seconds
  };

  const isSuccess = compileResult.status === 'success';

  return (
    <div className="glass-panel editor-panel">
      <div className="editor-header">
        <div className="editor-filename">policy.0</div>
        <div className={`compile-status ${isSuccess ? 'success' : 'error'}`}>
          <span className="dot"></span>
          {isSuccess ? 'Compiled Successfully (0)' : 'Compilation Failed'}
        </div>
      </div>
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>Presets:</span>
        <button onClick={() => onLoadPreset('balanced')} style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-agent)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>🛡️ Balanced</button>
        <button onClick={() => onLoadPreset('permissive')} style={{ background: 'rgba(0, 230, 118, 0.05)', color: 'var(--color-human)', border: '1px solid rgba(0, 230, 118, 0.15)', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>🔓 Permissive</button>
        <button onClick={() => onLoadPreset('strict')} style={{ background: 'rgba(255, 23, 68, 0.05)', color: 'var(--color-danger)', border: '1px solid rgba(255, 23, 68, 0.15)', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>🔒 Block All</button>
      </div>

      <textarea
        className="code-editor-textarea"
        value={code}
        onChange={handleTextChange}
        spellCheck="false"
      />
      
      <div className="diagnostics-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ color: '#8c9ba5', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Compiler Diagnostics (JSON Output)
          </div>
          <button onClick={handleRunTests} style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-agent)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '4px', fontSize: '0.65rem', padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>🧪 Run compiler tests</button>
        </div>

        {testResults && (
          <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.7rem', lineHeight: '1.4' }}>
            <span style={{ color: 'var(--color-agent)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>🧪 COMPILER REGRESSION TESTS: {testResults.success ? 'PASSED (4/4)' : 'FAILED'}</span>
            {testResults.results.map((r, idx) => (
              <div key={idx} style={{ color: r.passed ? 'var(--color-human)' : 'var(--color-danger)' }}>
                {r.passed ? '✓' : '❌'} {r.name}: {r.message}
              </div>
            ))}
          </div>
        )}

        {compileResult.diagnostics.length === 0 ? (
          <div style={{ color: '#00e676', padding: '4px 8px' }}>
            ✓ zero check: No compiler warnings or errors found in policy.0
          </div>
        ) : (
          compileResult.diagnostics.map((diag, i) => (
            <div key={i} className={`diagnostic-item ${diag.type}`}>
              [{diag.type}] Line {diag.line}:{diag.character} - {diag.message} (code: {diag.code})
            </div>
          ))
        )}
      </div>
    </div>
  );
}
