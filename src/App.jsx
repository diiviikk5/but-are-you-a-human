import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import CodeEditor from './components/CodeEditor';
import AgentTerminal from './components/AgentTerminal';
import ScenarioView from './components/ScenarioView';
import Dashboard from './components/Dashboard';
import { compileZeroPolicy, DEFAULT_POLICY_CODE, PERMISSIVE_POLICY_CODE, SUPER_STRICT_POLICY_CODE } from './compiler/zeroRuntime';

const SCENARIOS = [
  {
    id: 'booking',
    title: '🎫 Ticket Seat Booking',
    desc: 'Scalpers vs Verified Agents buying limited tickets.',
    url: 'https://neonpulse.com/tickets'
  },
  {
    id: 'signup',
    title: '🚀 SaaS Account Creation',
    desc: 'Spambots creating free trial tiers vs secure DIDs.',
    url: 'https://scaleflow.io/signup'
  },
  {
    id: 'scraping',
    title: '📦 Inventory Scraping',
    desc: 'Aggressive scrapers vs polite structured endpoints.',
    url: 'https://apexlogistics.com/inventory'
  }
];

const INITIAL_SEATS = [
  { id: 'seat_A1', name: 'A1', status: 'available' },
  { id: 'seat_A2', name: 'A2', status: 'available' },
  { id: 'seat_A3', name: 'A3', status: 'taken' },
  { id: 'seat_A4', name: 'A4', status: 'available' },
  { id: 'seat_B1', name: 'B1', status: 'available' },
  { id: 'seat_B2', name: 'B2', status: 'scalped' },
  { id: 'seat_B3', name: 'B3', status: 'scalped' },
  { id: 'seat_B4', name: 'B4', status: 'available' },
  { id: 'seat_C1', name: 'C1', status: 'available' },
  { id: 'seat_C2', name: 'C2', status: 'available' },
  { id: 'seat_C3', name: 'C3', status: 'taken' },
  { id: 'seat_C4', name: 'C4', status: 'available' },
  { id: 'seat_D1', name: 'D1', status: 'available' },
  { id: 'seat_D2', name: 'D2', status: 'available' },
  { id: 'seat_D3', name: 'D3', status: 'available' },
  { id: 'seat_D4', name: 'D4', status: 'taken' }
];

const INITIAL_INVENTORY = [
  { id: 1, partNo: 'CPU-8096', description: 'Octa-Core AI Neural Unit', stock: 12, price: '$340.00' },
  { id: 2, partNo: 'RAM-DDR6-64', description: '64GB Ultra Latency DRAM', stock: 4, price: '$180.00' },
  { id: 3, partNo: 'SSD-M2-4TB', description: '4TB PCI-E Gen 6 Solid Drive', stock: 18, price: '$220.00' },
  { id: 4, partNo: 'GPU-RTX-900', description: 'CyberRender Tensor Accelerator', stock: 0, price: '$850.00' }
];

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'a11y'
  const [policyCode, setPolicyCode] = useState(DEFAULT_POLICY_CODE);
  const [compileResult, setCompileResult] = useState({ status: 'success', diagnostics: [], execute: null });
  
  // Interactive scenario states
  const [ticketSeats, setTicketSeats] = useState(INITIAL_SEATS);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', attestation: '' });
  const [inventoryData, setInventoryData] = useState(INITIAL_INVENTORY);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [browserMessage, setBrowserMessage] = useState(null);

  // Simulation Metrics
  const [metrics, setMetrics] = useState({
    humanFriction: 0,
    agentSuccess: 100,
    botsBlocked: 100,
    humanRequests: 0,
    humanBypasses: 0,
    agentRequests: 0,
    agentSuccesses: 0,
    botRequests: 0,
    botBlocks: 0
  });
  const [trafficFeed, setTrafficFeed] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simInterval = useRef(null);

  // Trigger compiler in real-time on policy code edits
  useEffect(() => {
    const result = compileZeroPolicy(policyCode);
    setCompileResult(result);
  }, [policyCode]);

  // Handle Scenario change
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    setBrowserMessage(null);
    setCaptchaRequired(false);
    setCaptchaValue('');
    setCaptchaValid(false);
    
    if (scenario.id === 'booking') {
      setTicketSeats(INITIAL_SEATS);
    } else if (scenario.id === 'signup') {
      setSignupForm({ name: '', email: '', attestation: '' });
    }
  };

  // Execution engine for Agent-Browser CLI commands
  const handleExecuteAgentCommand = (command, args) => {
    setBrowserMessage(null);
    
    if (command === 'open') {
      const url = args[0] || '';
      if (!url) return { success: false, message: 'URL parameter required' };
      
      const found = SCENARIOS.find(s => url.includes(s.id) || url === s.url);
      if (found) {
        handleScenarioChange(found);
        return { success: true, message: `Successfully opened ${found.url}` };
      }
      return { success: false, message: `Domain resolution failed for "${url}". (Available mock urls inside console help)` };
    }

    if (command === 'snapshot') {
      // Print elements and their refs
      if (selectedScenario.id === 'booking') {
        const details = [
          'Page Nodes:',
          '  [Header] @e1: NeonPulse Tickets',
          '  [Grid] @e2: Seat list (seats available: A1, A2, A4, B1, B4, C1, C2, C4, D1, D2, D3)',
          captchaRequired ? '  [InputText] @e4: CAPTCHA protection field' : '',
          '  [Button] @e3: Confirm Ticket Checkout'
        ].filter(Boolean);
        return { success: true, message: 'Accessibility snapshot compiled.', details };
      }

      if (selectedScenario.id === 'signup') {
        const details = [
          'Page Nodes:',
          '  [Header] @e1: ScaleFlow Signup',
          `  [InputText] @e2: Full Name (Value: "${signupForm.name}")`,
          `  [InputEmail] @e3: Email Address (Value: "${signupForm.email}")`,
          `  [InputText] @e4: Attestation Key (Value: "${signupForm.attestation}")`,
          captchaRequired ? `  [InputText] @e6: CAPTCHA Input (Value: "${captchaValue}")` : '',
          '  [Button] @e5: Register Account'
        ].filter(Boolean);
        return { success: true, message: 'Accessibility snapshot compiled.', details };
      }

      if (selectedScenario.id === 'scraping') {
        const details = [
          'Page Nodes:',
          '  [Header] @e1: Apex Inventory',
          '  [Button] @e2: Polite JSON Feed',
          '  [Table] @e3: Inventory details (CPU-8096, RAM-DDR6, SSD-M2)'
        ];
        return { success: true, message: 'Accessibility snapshot compiled.', details };
      }
    }

    if (command === 'fill') {
      const ref = args[0];
      const value = args.slice(1).join(' ');

      if (!ref || !value) {
        return { success: false, message: 'Usage: fill <@ref> <value>' };
      }

      if (selectedScenario.id === 'signup') {
        if (ref === '@e2') {
          setSignupForm(prev => ({ ...prev, name: value }));
          return { success: true, message: `Typed name "${value}" into Name Field (@e2)` };
        }
        if (ref === '@e3') {
          setSignupForm(prev => ({ ...prev, email: value }));
          return { success: true, message: `Typed email "${value}" into Email Field (@e3)` };
        }
        if (ref === '@e4') {
          setSignupForm(prev => ({ ...prev, attestation: value }));
          return { success: true, message: `Supplied attestation token "${value}" into Field (@e4)` };
        }
        if (ref === '@e6' && captchaRequired) {
          setCaptchaValue(value.toUpperCase());
          return { success: true, message: `Typed "${value}" into CAPTCHA verification field (@e6)` };
        }
      }

      if (selectedScenario.id === 'booking' && ref === '@e4' && captchaRequired) {
        setCaptchaValue(value.toUpperCase());
        return { success: true, message: `Typed "${value}" into CAPTCHA field (@e4)` };
      }

      return { success: false, message: `Reference element "${ref}" is either read-only or not present in current viewport.` };
    }

    if (command === 'click') {
      const ref = args[0];
      if (!ref) return { success: false, message: 'Usage: click <@ref>' };

      if (selectedScenario.id === 'booking') {
        // Direct click on a seat
        if (ref.startsWith('@seat_')) {
          const seatId = ref.replace('@', '');
          const found = ticketSeats.find(s => s.id === seatId);
          if (found && found.status === 'available') {
            onSeatClick(seatId);
            return { success: true, message: `Selected Seat ${found.name}` };
          }
          return { success: false, message: `Seat ${seatId} is unavailable for booking.` };
        }

        // Checkout confirm click
        if (ref === '@e3') {
          const hasSelected = ticketSeats.some(s => s.status === 'selected');
          if (!hasSelected) {
            return { success: false, message: 'Checkout failed. Please select an available seat first.' };
          }

          // Evaluate policy
          const rate = 1; // Agent checkout rate
          const isVerified = true; // agent terminal assumes verified agent credentials
          
          if (compileResult.execute) {
            const decision = compileResult.execute('booking', 'agent', rate, isVerified);
            if (decision.allow) {
              setTicketSeats(prev => prev.map(s => s.status === 'selected' ? { ...s, status: 'taken' } : s));
              setBrowserMessage({ success: true, text: '🎉 Booking Checkout Successful! Ticket confirmed.' });
              return { success: true, message: 'Ticket booking transaction authorized and finalized by active policy!' };
            } else {
              if (decision.reason.includes('unverified') || decision.reason.includes('rate limit')) {
                setCaptchaRequired(true);
                setBrowserMessage({ success: false, text: `⚠️ Policy Block: ${decision.reason}. Interactive CAPTCHA challenge initiated to verify human presence.` });
                return { success: false, message: `Transaction intercepted by policy engine: "${decision.reason}". CAPTCHA challenge required.` };
              }
              setBrowserMessage({ success: false, text: `❌ Policy Deny: ${decision.reason}` });
              return { success: false, message: `Transaction denied by ZeroPolicy: ${decision.reason}` };
            }
          }
        }
      }

      if (selectedScenario.id === 'signup') {
        if (ref === '@e5') {
          if (!signupForm.name || !signupForm.email) {
            return { success: false, message: 'Validation failed: Full Name and Email must be filled.' };
          }

          // Evaluate SaaS Policy
          const isVerified = signupForm.attestation.startsWith('0x'); // cryptographic credential checks
          const rate = 1; // signup rate

          if (compileResult.execute) {
            const decision = compileResult.execute('signup', 'agent', rate, isVerified);
            if (decision.allow) {
              setBrowserMessage({ success: true, text: '🎉 Account Registration Successful! Welcome aboard.' });
              return { success: true, message: 'Account creation authorized and verified by security policy!' };
            } else {
              if (decision.reason.includes('unverified')) {
                setCaptchaRequired(true);
                setBrowserMessage({ success: false, text: '⚠️ Policy Block: Unverified Agent signup. Standard human CAPTCHA protection triggered.' });
                return { success: false, message: 'Account signup intercepted. Attestation key invalid, human CAPTCHA required.' };
              }
              setBrowserMessage({ success: false, text: `❌ Policy Block: ${decision.reason}` });
              return { success: false, message: `Account registration blocked by policy: ${decision.reason}` };
            }
          }
        }
      }

      if (selectedScenario.id === 'scraping') {
        if (ref === '@e2') {
          // Polite feed checkout
          if (compileResult.execute) {
            const decision = compileResult.execute('scraping', 'agent', 1, true);
            if (decision.allow) {
              setBrowserMessage({ success: true, text: '✓ Polite API Feed Fetch Approved. Returning structured payload (4 elements).' });
              return { success: true, message: 'Polite feed access granted by ZeroPolicy.', details: ['[API Response]: 200 OK', JSON.stringify(inventoryData)] };
            } else {
              return { success: false, message: `Polite feed access blocked: ${decision.reason}` };
            }
          }
        }
      }

      return { success: false, message: `Interactive click action on element "${ref}" is invalid or unresolvable.` };
    }

    return { success: false, message: `Unknown agent-browser action: "${command}"` };
  };

  // Human ticket seat selection handler
  const onSeatClick = (seatId) => {
    setTicketSeats(prev => prev.map(s => {
      if (s.id === seatId) {
        return { ...s, status: s.status === 'selected' ? 'available' : 'selected' };
      }
      return s;
    }));
  };

  // Interactive Form submits (Human mimicking)
  const handleInteractiveSubmit = (type) => {
    setBrowserMessage(null);
    
    if (type === 'booking') {
      const selected = ticketSeats.some(s => s.status === 'selected');
      if (!selected) {
        setBrowserMessage({ success: false, text: 'Please select a seat first.' });
        return;
      }

      // Check CAPTCHA
      if (captchaRequired && captchaValue !== 'H8T4Q') {
        setBrowserMessage({ success: false, text: 'Security Verification Failed. Invalid CAPTCHA.' });
        return;
      }

      // Authorize
      if (compileResult.execute) {
        const decision = compileResult.execute('booking', 'human', 1, false);
        if (decision.allow) {
          setTicketSeats(prev => prev.map(s => s.status === 'selected' ? { ...s, status: 'taken' } : s));
          setBrowserMessage({ success: true, text: '🎉 Booking Successful! Enjoy your concert.' });
          setCaptchaRequired(false);
          setCaptchaValue('');
        } else {
          setBrowserMessage({ success: false, text: `Blocked by policy: ${decision.reason}` });
        }
      }
    }

    if (type === 'signup') {
      if (!signupForm.name || !signupForm.email) {
        setBrowserMessage({ success: false, text: 'Name and Email are required fields.' });
        return;
      }

      if (captchaRequired && captchaValue !== '9K2W8') {
        setBrowserMessage({ success: false, text: 'Invalid CAPTCHA code. Please verify human presence again.' });
        return;
      }

      if (compileResult.execute) {
        const decision = compileResult.execute('signup', 'human', 1, false);
        if (decision.allow) {
          setBrowserMessage({ success: true, text: '🎉 SaaS Signup Successful! Your developer workspace is ready.' });
          setCaptchaRequired(false);
          setCaptchaValue('');
        } else {
          setBrowserMessage({ success: false, text: `Blocked: ${decision.reason}` });
        }
      }
    }

    if (type === 'scraping-api') {
      if (compileResult.execute) {
        const decision = compileResult.execute('scraping', 'agent', 1, true);
        if (decision.allow) {
          setBrowserMessage({ success: true, text: '✓ Polite API Feed Fetch Approved. Payload loaded successfully.' });
        } else {
          setBrowserMessage({ success: false, text: `Blocked: ${decision.reason}` });
        }
      }
    }
  };

  // Real-time Traffic Simulator loop
  const toggleSimulation = () => {
    if (simulationRunning) {
      clearInterval(simInterval.current);
      setSimulationRunning(false);
    } else {
      setSimulationRunning(true);
      
      simInterval.current = setInterval(() => {
        // Randomly generate traffic: Human, Verified Agent, or Bot
        const types = ['human', 'agent', 'bot'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        
        let flow = selectedScenario.id;
        let rate = Math.floor(Math.random() * 8) + 1; // request rates
        let isVerified = false;
        
        if (chosenType === 'agent') {
          // 80% of agents present cryptographically valid attestation signatures
          isVerified = Math.random() > 0.2;
        }

        let allow = true;
        let reason = 'Allowed by default';

        if (compileResult.execute) {
          const decision = compileResult.execute(flow, chosenType, rate, isVerified);
          allow = decision.allow;
          reason = decision.reason;
        }

        // Add to traffic feed log
        const logId = Math.random().toString(36).substring(7);
        const actionStr = 
          flow === 'booking' ? `Purchase limited ticket` :
          flow === 'signup' ? `Create trial account` :
          `Scrape global part pricing table`;

        const newLog = {
          id: logId,
          type: chosenType,
          flow,
          rate,
          verified: isVerified,
          action: actionStr,
          allow,
          reason: allow ? '' : reason
        };

        setTrafficFeed(prev => [newLog, ...prev.slice(0, 14)]);

        // Calculate and update metrics
        setMetrics(prev => {
          let updated = { ...prev };
          
          if (chosenType === 'human') {
            updated.humanRequests += 1;
            // Human friction is calculated based on how many captcha challenges humans faced.
            // If the policy denies humans or rates are too tight, they suffer.
            // In a secure policy, humans should always be allowed (friction = 0%).
            // If they are denied, friction increases.
            if (!allow) {
              updated.humanFriction = Math.min(100, Math.round(( (updated.humanRequests - updated.humanBypasses) / updated.humanRequests ) * 100));
            } else {
              updated.humanBypasses += 1;
              updated.humanFriction = Math.round( ( (updated.humanRequests - updated.humanBypasses) / updated.humanRequests ) * 100 );
            }
          } else if (chosenType === 'agent') {
            updated.agentRequests += 1;
            if (allow) updated.agentSuccesses += 1;
            updated.agentSuccess = Math.round((updated.agentSuccesses / updated.agentRequests) * 100);
          } else if (chosenType === 'bot') {
            updated.botRequests += 1;
            if (!allow) updated.botBlocks += 1;
            updated.botsBlocked = Math.round((updated.botBlocks / updated.botRequests) * 100);
          }

          return updated;
        });

      }, 1200);
    }
  };

  // Clean metrics on scenario switch or reset click
  const handleResetMetrics = () => {
    setMetrics({
      humanFriction: 0,
      agentSuccess: 100,
      botsBlocked: 100,
      humanRequests: 0,
      humanBypasses: 0,
      agentRequests: 0,
      agentSuccesses: 0,
      botRequests: 0,
      botBlocks: 0
    });
    setTrafficFeed([]);
  };

  const handlePresetLoad = (preset) => {
    if (preset === 'balanced') setPolicyCode(DEFAULT_POLICY_CODE);
    if (preset === 'permissive') setPolicyCode(PERMISSIVE_POLICY_CODE);
    if (preset === 'strict') setPolicyCode(SUPER_STRICT_POLICY_CODE);
  };

  const handleTriggerAttack = (type) => {
    const burstCount = 6;
    let newLogs = [];
    
    setMetrics(prev => {
      let updated = { ...prev };
      
      for (let i = 0; i < burstCount; i++) {
        let flow = selectedScenario.id;
        let rate = type === 'bot' ? 12 : Math.floor(Math.random() * 4) + 1;
        let isVerified = type === 'agent' ? Math.random() > 0.3 : false;

        let allow = true;
        let reason = 'Allowed by default';

        if (compileResult.execute) {
          const decision = compileResult.execute(flow, type, rate, isVerified);
          allow = decision.allow;
          reason = decision.reason;
        }

        const logId = Math.random().toString(36).substring(7);
        const actionStr = 
          flow === 'booking' ? `Purchase concert seat [BURST]` :
          flow === 'signup' ? `Create trial account [BURST]` :
          `Scrape global inventory [BURST]`;

        newLogs.push({
          id: logId,
          type,
          flow,
          rate,
          verified: isVerified,
          action: actionStr,
          allow,
          reason: allow ? '' : reason
        });

        if (type === 'human') {
          updated.humanRequests += 1;
          if (!allow) {
            updated.humanFriction = Math.min(100, Math.round(( (updated.humanRequests - updated.humanBypasses) / updated.humanRequests ) * 100));
          } else {
            updated.humanBypasses += 1;
            updated.humanFriction = Math.round( ( (updated.humanRequests - updated.humanBypasses) / updated.humanRequests ) * 100 );
          }
        } else if (type === 'agent') {
          updated.agentRequests += 1;
          if (allow) updated.agentSuccesses += 1;
          updated.agentSuccess = Math.round((updated.agentSuccesses / updated.agentRequests) * 100);
        } else if (type === 'bot') {
          updated.botRequests += 1;
          if (!allow) updated.botBlocks += 1;
          updated.botsBlocked = Math.round((updated.botBlocks / updated.botRequests) * 100);
        }
      }

      return updated;
    });

    setTrafficFeed(prev => [...newLogs, ...prev].slice(0, 15));
  };

  // Pause simulation on unmount
  useEffect(() => {
    return () => clearInterval(simInterval.current);
  }, []);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header glass-panel">
        <div className="logo-section">
          <h1>
            <span>🤖</span> BUT ARE YOU A HUMAN?
          </h1>
          <p>The "Agent-Safe but Abuse-Resistant" Web Flow Testing Playground</p>
        </div>
        <div className="status-badge">
          <span className="dot"></span>
          <span>ACTIVE PLAYGROUND</span>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="main-workspace">
        {/* Left Column: Scenarios & Configs */}
        <div className="column">
          <div className="column-header">
            <h3>📂 SIMULATION FLOWS</h3>
          </div>
          <div className="glass-panel scenario-selector">
            {SCENARIOS.map((s) => (
              <div
                key={s.id}
                className={`scenario-option ${selectedScenario.id === s.id ? 'active' : ''}`}
                onClick={() => handleScenarioChange(s)}
              >
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="column-header" style={{ marginTop: '12px' }}>
            <h3>🛠️ AGENT TERMINAL</h3>
          </div>
          <AgentTerminal
            onExecuteCommand={handleExecuteAgentCommand}
            currentScenario={selectedScenario}
          />
        </div>

        {/* Center Column: Sandbox Browser viewport */}
        <div className="column">
          <div className="column-header">
            <h3>🌐 SANDBOX BROWSER</h3>
          </div>
          <ScenarioView
            scenario={selectedScenario}
            viewMode={viewMode}
            setViewMode={setViewMode}
            ticketSeats={ticketSeats}
            onSeatClick={onSeatClick}
            signupForm={signupForm}
            onSignupFormChange={(field, val) => setSignupForm(p => ({ ...p, [field]: val }))}
            onSignupSubmit={handleInteractiveSubmit}
            inventoryData={inventoryData}
            captchaRequired={captchaRequired}
            captchaValue={captchaValue}
            onCaptchaChange={setCaptchaValue}
            captchaValid={captchaValid}
            message={browserMessage}
          />
        </div>

        {/* Right Column: Code Editor & Metrics Dashboard */}
        <div className="column">
          <div className="column-header">
            <h3>🛡️ ZERO POLICY EDITOR</h3>
          </div>
          <CodeEditor
            code={policyCode}
            onChange={setPolicyCode}
            compileResult={compileResult}
            onLoadPreset={handlePresetLoad}
          />
          
          <Dashboard
            metrics={metrics}
            trafficFeed={trafficFeed}
            simulationRunning={simulationRunning}
            toggleSimulation={toggleSimulation}
            onResetMetrics={handleResetMetrics}
            onTriggerAttack={handleTriggerAttack}
          />
        </div>
      </main>
    </div>
  );
}
