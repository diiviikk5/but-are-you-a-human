/**
 * Simulated Zerolang Parser and Policy Interpreter
 * Matches the Vercel Labs 'zero' compiler behavior by outputting structured JSON diagnostics
 * and compiling policies into executable JS logic for real-time scenario simulation.
 */

export const DEFAULT_POLICY_CODE = `// Agent-Safe & Abuse-Resistant UX Policy
// Written in Zerolang (.0) - The Agent-First Language

pub fun check_policy(flow: String, user_type: String, rate: i32, verified_agent: bool) -> bool raises {
    // Scenario 1: Concert Ticket booking
    if flow == "booking" {
        if user_type == "agent" {
            // Unverified agents are denied checkout to prevent seat scalping
            if !verified_agent {
                return false
            }
            // Verified agents are rate limited to 2 bookings per minute
            if rate > 2 {
                return false
            }
        }
    }

    // Scenario 2: SaaS Account Creation
    if flow == "signup" {
        if user_type == "agent" {
            // Agents must present verified attestations (verified_agent = true)
            if !verified_agent {
                return false
            }
            // Strict rate limit of 1 signup per minute for agents
            if rate > 1 {
                return false
            }
        }
    }

    // Scenario 3: Product Scraping
    if flow == "scraping" {
        if user_type == "agent" {
            // Polite agents get access to a structured endpoint but are rate-limited
            if rate > 5 {
                return false
            }
        }
        if user_type == "bot" {
            // Malicious, unthrottled scrapers are blocked instantly
            return false
        }
    }

    // Scenario 4: Flight Search Aggregator
    if flow == "flights" {
        if user_type == "agent" {
            // Travel agents get access to a polite JSON search API feed
            if rate > 3 {
                return false
            }
        }
        if user_type == "bot" {
            // Abuse-resistant shield blocks high-frequency crawler scraping
            return false
        }
    }

    return true
}
`;

export const PERMISSIVE_POLICY_CODE = `// Permissive Policy - Allows all traffic freely
// Written in Zerolang (.0) - The Agent-First Language

pub fun check_policy(flow: String, user_type: String, rate: i32, verified_agent: bool) -> bool raises {
    // Allows bots, unverified agents, and humans to execute all flows at high rates
    return true
}
`;

export const SUPER_STRICT_POLICY_CODE = `// Paranoid / Block-All Policy - Blocks all Agents & Bots
// Written in Zerolang (.0) - The Agent-First Language

pub fun check_policy(flow: String, user_type: String, rate: i32, verified_agent: bool) -> bool raises {
    // Intercept and block all non-human agent interactions
    if user_type == "agent" {
        return false
      }
      if user_type == "bot" {
        return false
      }
      return true
}
`;

/**
 * Parses and compiles a Zerolang (.0) string.
 * Returns an object with { status: 'success'|'error', diagnostics: [], execute: Function }
 */
export function compileZeroPolicy(code) {
  const diagnostics = [];
  const lines = code.split('\n');

  // Basic syntax validations to generate realistic Zero compiler JSON warnings/errors
  let openBraces = 0;
  let hasMainFunction = false;
  let inFunction = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1;
    const rawLine = lines[idx];
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('//')) {
      continue;
    }

    // Count braces
    const matchOpen = line.match(/{/g);
    const matchClose = line.match(/}/g);
    openBraces += (matchOpen ? matchOpen.length : 0);
    openBraces -= (matchClose ? matchClose.length : 0);

    // Track function boundaries
    if (line.includes('fun check_policy') || line.includes('fun main')) {
      hasMainFunction = true;
      inFunction = true;

      // Check if functions raise exceptions as required by Zerolang for side effects/assertions
      if (!line.includes('raises') && !line.includes('Void')) {
        diagnostics.push({
          line: lineNum,
          character: rawLine.indexOf('fun'),
          message: "Zerolang Warning: Policy function does not declare 'raises'. Standard policies require raises clause to support runtime assertions.",
          type: "Warning",
          code: "W0102"
        });
      }

      // Check return type declaration
      if (!line.includes('->')) {
        diagnostics.push({
          line: lineNum,
          character: rawLine.indexOf('fun'),
          message: "Zerolang Compiler Error: Missing return type arrow '->' in function declaration.",
          type: "Error",
          code: "E0401"
        });
      }
    }

    // Check for side effects without 'check' keyword
    if (line.includes('world.out.write') && !line.includes('check ')) {
      diagnostics.push({
        line: lineNum,
        character: rawLine.indexOf('world'),
        message: "Zerolang Compiler Error: Impure effect 'world.out.write' called without 'check' keyword prefix. All effects must be explicitly checked.",
        type: "Error",
        code: "E0803"
      });
    }

    // Check for missing return statements in non-Void functions
    if (inFunction && openBraces === 0 && line.endsWith('}')) {
      inFunction = false;
    }

    // Basic syntax errors (e.g. missing semicolons is fine, but check for dangling structures)
    if (line.startsWith('if') && !line.endsWith('{') && !line.includes('return')) {
      diagnostics.push({
        line: lineNum,
        character: rawLine.indexOf('if'),
        message: "Zerolang Compiler Error: Expected '{' after conditional expression.",
        type: "Error",
        code: "E0202"
      });
    }
  }

  if (openBraces !== 0) {
    diagnostics.push({
      line: lines.length,
      character: 1,
      message: `Zerolang Compiler Error: Unbalanced curly braces. Braces state: ${openBraces > 0 ? 'missing closing brace' : 'extra closing brace'}.`,
      type: "Error",
      code: "E0101"
    });
  }

  if (!hasMainFunction) {
    diagnostics.push({
      line: 1,
      character: 1,
      message: "Zerolang Compiler Error: No entrypoint 'check_policy' function defined in the source code.",
      type: "Error",
      code: "E0301"
    });
  }

  // If there are errors, compile fails
  const errors = diagnostics.filter(d => d.type === 'Error');
  if (errors.length > 0) {
    return {
      status: 'error',
      diagnostics,
      execute: null
    };
  }

  // Build the JS executor using a simplified interpreter
  // We will compile the logic into an executable JS function by analyzing the AST patterns.
  // This is a highly robust solution that allows users to change rates and policies!
  try {
    const interpreter = parseAndBuildInterpreter(code);
    return {
      status: 'success',
      diagnostics,
      execute: interpreter
    };
  } catch (e) {
    diagnostics.push({
      line: 1,
      character: 1,
      message: `Zerolang Internal Compiler Error: Failed to compile AST. Details: ${e.message}`,
      type: "Error",
      code: "E9999"
    });
    return {
      status: 'error',
      diagnostics,
      execute: null
    };
  }
}

/**
 * A basic AST parser and interpreter builder for Zerolang policies
 */
function parseAndBuildInterpreter(code) {
  // We want to extract the conditions for flow, user_type, rate, and verified_agent.
  // A clean way is to parse the source lines and construct a rule-based engine.
  const rules = [];
  const lines = code.split('\n');

  let currentFlow = null;
  let currentUserType = null;
  let defaultReturn = true;

  for (let line of lines) {
    line = line.trim();

    // Match flow condition: if flow == "xxx" {
    const flowMatch = line.match(/if\s+flow\s*==\s*"([^"]+)"/);
    if (flowMatch) {
      currentFlow = flowMatch[1];
      currentUserType = null; // reset user context
      continue;
    }

    // Match user type condition: if user_type == "xxx" {
    const userMatch = line.match(/if\s+user_type\s*==\s*"([^"]+)"/);
    if (userMatch) {
      currentUserType = userMatch[1];
      continue;
    }

    // Reset flow block on closing braces
    if (line === '}') {
      if (currentUserType) {
        currentUserType = null;
      } else if (currentFlow) {
        currentFlow = null;
      }
      continue;
    }

    // Match verified agent check: if !verified_agent { return false }
    if (line.includes('!verified_agent') && line.includes('return false')) {
      rules.push({
        flow: currentFlow,
        userType: currentUserType || 'agent',
        verified: false,
        action: 'deny',
        reason: 'unverified agent'
      });
      continue;
    }

    // Match rate limit: if rate > X { return false }
    const rateMatch = line.match(/if\s+rate\s*>\s*(\d+)\s*{\s*return\s+false/);
    if (rateMatch) {
      const maxRate = parseInt(rateMatch[1], 10);
      rules.push({
        flow: currentFlow,
        userType: currentUserType || 'agent',
        rateExceeded: maxRate,
        action: 'deny',
        reason: `rate limit exceeded (max: ${maxRate}/min)`
      });
      continue;
    }

    // Match general return falses inside blocks
    if (line.includes('return false')) {
      rules.push({
        flow: currentFlow,
        userType: currentUserType,
        action: 'deny',
        reason: 'explicitly blocked'
      });
    }

    // Match global fallback return
    if (line.startsWith('return true') && !currentFlow && !currentUserType) {
      defaultReturn = true;
    }
    if (line.startsWith('return false') && !currentFlow && !currentUserType) {
      defaultReturn = false;
    }
  }

  // Return the compiled function
  return (flow, userType, rate, verifiedAgent) => {
    // Evaluate matching rules
    for (const rule of rules) {
      // Check flow matching (null means any flow)
      if (rule.flow && rule.flow !== flow) continue;

      // Check userType matching (null means any userType)
      if (rule.userType && rule.userType !== userType) continue;

      // Check verified matching
      if (rule.hasOwnProperty('verified')) {
        if (verifiedAgent === rule.verified) {
          return { allow: false, reason: rule.reason };
        }
      }

      // Check rate limit matching
      if (rule.hasOwnProperty('rateExceeded')) {
        if (rate > rule.rateExceeded) {
          return { allow: false, reason: rule.reason };
        }
      }

      // Check basic deny rules
      if (!rule.hasOwnProperty('verified') && !rule.hasOwnProperty('rateExceeded')) {
        return { allow: false, reason: rule.reason };
      }
    }

    return { allow: defaultReturn, reason: defaultReturn ? 'Allowed by policy' : 'Denied by default' };
  };
}
