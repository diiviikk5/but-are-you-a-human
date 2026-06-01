import { compileZeroPolicy } from './zeroRuntime';

/**
 * Automated Compiler Regression Test Suite
 * Runs standard tests against the custom Zerolang compiler interpreter.
 */
export function runCompilerTests() {
  const results = [];

  // Test Case 1: Empty policy (Should fail - missing check_policy entrypoint)
  const tc1 = compileZeroPolicy('');
  results.push({
    name: 'TC-01: Empty Policy Validation',
    passed: tc1.status === 'error' && tc1.diagnostics.some(d => d.code === 'E0301'),
    message: tc1.status === 'error' ? 'Correctly intercepted empty entrypoint error (E0301)' : 'Failed: Allowed empty entrypoint'
  });

  // Test Case 2: Unbalanced braces (Should fail - curly mismatch)
  const badBraceCode = `pub fun check_policy() -> bool raises {
    if true {
      return false
    // missing closing braces
  `;
  const tc2 = compileZeroPolicy(badBraceCode);
  results.push({
    name: 'TC-02: Unbalanced Curly Braces Check',
    passed: tc2.status === 'error' && tc2.diagnostics.some(d => d.code === 'E0101'),
    message: tc2.status === 'error' ? 'Correctly detected braces mismatch error (E0101)' : 'Failed: Allowed dangling braces'
  });

  // Test Case 3: Missing raises clause (Should trigger warning)
  const missingRaisesCode = `pub fun check_policy() -> bool {
    return true
  }`;
  const tc3 = compileZeroPolicy(missingRaisesCode);
  results.push({
    name: 'TC-03: Missing Raises Warning clause',
    passed: tc3.diagnostics.some(d => d.code === 'W0102'),
    message: tc3.diagnostics.some(d => d.code === 'W0102') ? 'Correctly raised raises warning (W0102)' : 'Failed: No warning generated'
  });

  // Test Case 4: Correct Balanced policy (Should compile successfully)
  const goodCode = `pub fun check_policy(flow: String, user_type: String, rate: i32, verified_agent: bool) -> bool raises {
    return true
  }`;
  const tc4 = compileZeroPolicy(goodCode);
  results.push({
    name: 'TC-04: Perfect Policy Compilation',
    passed: tc4.status === 'success' && tc4.diagnostics.length === 0,
    message: tc4.status === 'success' ? 'Compiled cleanly with status SUCCESS' : 'Failed: Error compiling valid structure'
  });

  return {
    success: results.every(r => r.passed),
    results
  };
}
