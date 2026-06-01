import React from 'react';

export default function CodeEditor({ code, onChange, compileResult }) {
  const handleTextChange = (e) => {
    onChange(e.target.value);
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
      
      <textarea
        className="code-editor-textarea"
        value={code}
        onChange={handleTextChange}
        spellCheck="false"
      />
      
      <div className="diagnostics-panel">
        <div style={{ color: '#8c9ba5', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Compiler Diagnostics (JSON Output)
        </div>
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
