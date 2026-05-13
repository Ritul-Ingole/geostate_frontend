import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calculator, TrendingUp, GitCompare, Table, ChevronDown, ChevronUp, Info, Home, MapPin, Key, Ruler, FileText, Compass, IndianRupee } from 'lucide-react';
import '../styles/Mortgage.css';

/* ─────────────────────────────────────────
   Floating Background Icons
   Used in: Recommendations + Services sections
───────────────────────────────────────── */
const FLOAT_ICONS = [
  // [Icon, size, top%, left%, animDuration, animDelay, animation]
  { Icon: Home,       size: 78, top: '12%',  left: '2%',   dur: '7s',   delay: '0s',    anim: 'geoFloat' },
  { Icon: MapPin,     size: 66, top: '65%',  left: '18%', dur: '9s',   delay: '0s',  anim: 'geoPulse' },
  { Icon: Key,        size: 70, top: '35%',  left: '94%',  dur: '8s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Building2,  size: 72, top: '72%',  left: '75%',  dur: '10s',  delay: '0s',    anim: 'geoPulse' },
  { Icon: TrendingUp, size: 64, top: '8%',   left: '55%',  dur: '6.5s', delay: '0s',  anim: 'geoFloat' },
  { Icon: Ruler,      size: 68, top: '50%',  left: '40%',  dur: '7.5s', delay: '0s',  anim: 'geoPulse' },
  { Icon: FileText,   size: 62, top: '80%',  left: '30%',   dur: '8.5s', delay: '0s',    anim: 'geoFloat' },
  { Icon: Compass,    size: 62, top: '25%',  left: '65%', dur: '11s',  delay: '0s',  anim: 'geoPulse' },
  { Icon: IndianRupee, size: 60, top: '90%',  left: '85%',  dur: '7s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Home,       size: 68, top: '55%',  left: '50%',  dur: '9.5s', delay: '0s',  anim: 'geoPulse' },
];

const floatAnimStyles = `
  @keyframes geoFloat {
    0%   { transform: translateY(0px);    opacity: 0.13; }
    50%  { transform: translateY(-18px);  opacity: 0.22; }
    100% { transform: translateY(0px);    opacity: 0.13; }
  }
  @keyframes geoPulse {
    0%   { transform: scale(1);    opacity: 0.10; }
    50%  { transform: scale(1.12); opacity: 0.20; }
    100% { transform: scale(1);    opacity: 0.10; }
  }
`;

const FloatingIcons = () => (
  <>
    <style>{floatAnimStyles}</style>
    {FLOAT_ICONS.map(({ Icon, size, top, left, dur, delay, anim }, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top,
          left,
          zIndex: 0,
          pointerEvents: 'none',
          animation: `${anim} ${dur} ease-in-out ${delay} infinite`,
          color: 'rgba(101, 78, 52, 0.55)',   /* warm brown to match cream bg */
        }}
      >
        <Icon size={size} strokeWidth={1.2} />
      </div>
    ))}
  </>
);

// ── Bank reference rates ──────────────────────────────
const BANK_RATES = [
  { bank: 'SBI',          rate: '8.50%', color: '#1b5e3b' },
  { bank: 'HDFC Bank',    rate: '8.75%', color: '#b85c38' },
  { bank: 'ICICI Bank',   rate: '8.75%', color: '#4a3728' },
  { bank: 'Axis Bank',    rate: '8.75%', color: '#1b5e3b' },
  { bank: 'Kotak Mahindra', rate: '8.85%', color: '#b85c38' },
  { bank: 'LIC Housing',  rate: '8.50%', color: '#4a3728' },
];

const TABS = [
  { id: 'emi',         label: 'EMI Calculator', icon: Calculator },
  { id: 'eligibility', label: 'Eligibility',    icon: TrendingUp },
  { id: 'compare',     label: 'Compare Loans',  icon: GitCompare },
  { id: 'schedule',    label: 'Amortization',   icon: Table      },
];

// ── EMI formula ───────────────────────────────────────
function calcEMI(principal, annualRate, tenureYears) {
  if (!principal || !annualRate || !tenureYears) return null;
  const r = annualRate / 100 / 12;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { emi, total: emi * n, interest: emi * n - principal, n, r };
}

function formatINR(val) {
  if (!val || isNaN(val)) return '—';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000)   return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

// ── Amortization table ────────────────────────────────
function buildSchedule(principal, annualRate, tenureYears) {
  const result = calcEMI(principal, annualRate, tenureYears);
  if (!result) return [];
  const { emi, r, n } = result;
  const rows = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest  = balance * r;
    const prinPart  = emi - interest;
    balance        -= prinPart;
    rows.push({ month: i, emi, interest, principal: prinPart, balance: Math.max(0, balance) });
  }
  return rows;
}

// ─────────────────────────────────────────────────────
export default function Mortgage() {
  const navigate  = useNavigate();
  const [tab, setTab] = useState('emi');

  // EMI state
  const [emi, setEmi] = useState({ principal: 5000000, rate: 8.5, tenure: 20 });

  // Eligibility state
  const [elig, setElig] = useState({ income: 100000, existing: 0, rate: 8.5, tenure: 20 });

  // Compare state
  const [loanA, setLoanA] = useState({ bank: 'SBI',       amount: 5000000, rate: 8.50, tenure: 20 });
  const [loanB, setLoanB] = useState({ bank: 'HDFC Bank', amount: 5000000, rate: 8.75, tenure: 20 });

  // Schedule: reuse EMI inputs; show first 24 rows then expand
  const [schedExpanded, setSchedExpanded] = useState(false);

  // ── Derived ────────────────────────────────────────
  const emiResult = useMemo(() => calcEMI(emi.principal, emi.rate, emi.tenure), [emi]);

  const eligResult = useMemo(() => {
    const maxEmiAffordable = elig.income * 0.5 - elig.existing;
    if (maxEmiAffordable <= 0) return null;
    const r = elig.rate / 100 / 12;
    const n = elig.tenure * 12;
    const maxLoan = r === 0
      ? maxEmiAffordable * n
      : maxEmiAffordable * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    return { maxLoan, maxEmi: maxEmiAffordable };
  }, [elig]);

  const resultA = useMemo(() => calcEMI(loanA.amount, loanA.rate, loanA.tenure), [loanA]);
  const resultB = useMemo(() => calcEMI(loanB.amount, loanB.rate, loanB.tenure), [loanB]);

  const schedule = useMemo(() => buildSchedule(emi.principal, emi.rate, emi.tenure), [emi]);
  const scheduleVisible = schedExpanded ? schedule : schedule.slice(0, 24);

  // ── Donut helper ───────────────────────────────────
  const principalPct = emiResult
    ? Math.round((emi.principal / emiResult.total) * 100)
    : 0;

  return (
    <div className="mort-page">
      {/* Floating icons — behind all content */}
        <FloatingIcons />
        
      {/* ── Navbar ── */}
      <nav className="mort-nav">
        <div className="mort-nav-inner">
          <div className="mort-logo" onClick={() => navigate('/landing')}>
            <Building2 size={22} />
            <span>GeoState</span>
          </div>
          <button className="mort-back" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="mort-hero">
        <div className="mort-hero-inner">
          <p className="mort-eyebrow">Home Finance</p>
          <h1 className="mort-title">Mortgage<br /><em>Calculator</em></h1>
          <p className="mort-subtitle">
            Calculate EMIs, check eligibility, compare loan offers, and see your full repayment schedule — all in one place.
          </p>
        </div>
      </div>

      {/* ── Bank rates strip ── */}
      <div className="mort-rates-strip">
        <span className="rates-label">Current rates</span>
        <div className="rates-scroll">
          {BANK_RATES.map(b => (
            <div key={b.bank} className="rate-pill">
              <span className="rate-bank">{b.bank}</span>
              <span className="rate-val" style={{ color: b.color }}>{b.rate} p.a.</span>
            </div>
          ))}
        </div>
        <span className="rates-disclaimer">*Indicative rates, subject to change</span>
      </div>

      {/* ── Tabs ── */}
      <div className="mort-body">
        <div className="mort-tabs">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`mort-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ══════ EMI CALCULATOR ══════ */}
        {tab === 'emi' && (
          <div className="mort-panel">
            {/* Floating icons — behind all content */}
            <FloatingIcons />
            <div className="mort-grid-2">
              {/* Inputs */}
              <div className="mort-card">
                <h3 className="card-title">Loan Details</h3>

                <SliderField
                  label="Loan Amount"
                  value={emi.principal}
                  min={100000} max={50000000} step={100000}
                  display={formatINR(emi.principal)}
                  onChange={v => setEmi(p => ({ ...p, principal: v }))}
                />
                <SliderField
                  label="Interest Rate (% p.a.)"
                  value={emi.rate}
                  min={6} max={18} step={0.05}
                  display={`${emi.rate.toFixed(2)}%`}
                  onChange={v => setEmi(p => ({ ...p, rate: v }))}
                />
                <SliderField
                  label="Loan Tenure"
                  value={emi.tenure}
                  min={1} max={30} step={1}
                  display={`${emi.tenure} yr`}
                  onChange={v => setEmi(p => ({ ...p, tenure: v }))}
                />
              </div>

              {/* Results */}
              <div className="mort-card result-card">
                <h3 className="card-title">Your EMI Breakdown</h3>
                {emiResult ? (
                  <>
                    <div className="emi-big">
                      <span className="emi-label">Monthly EMI</span>
                      <span className="emi-amount">{formatINR(emiResult.emi)}</span>
                    </div>

                    {/* Donut-style bar */}
                    <div className="breakdown-bar">
                      <div className="bar-principal" style={{ width: `${principalPct}%` }} />
                      <div className="bar-interest"  style={{ width: `${100 - principalPct}%` }} />
                    </div>
                    <div className="bar-legend">
                      <span><span className="dot principal-dot" />Principal {principalPct}%</span>
                      <span><span className="dot interest-dot" />Interest {100 - principalPct}%</span>
                    </div>

                    <div className="emi-summary">
                      <div className="summary-row-item">
                        <span>Principal Amount</span>
                        <strong>{formatINR(emi.principal)}</strong>
                      </div>
                      <div className="summary-row-item">
                        <span>Total Interest</span>
                        <strong className="red">{formatINR(emiResult.interest)}</strong>
                      </div>
                      <div className="summary-row-item total-row">
                        <span>Total Payable</span>
                        <strong>{formatINR(emiResult.total)}</strong>
                      </div>
                    </div>
                  </>
                ) : <p className="empty-msg">Fill in the details to see your EMI.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ══════ ELIGIBILITY ══════ */}
        {tab === 'eligibility' && (
          <div className="mort-panel">
            {/* Floating icons — behind all content */}
            <FloatingIcons />
            <div className="mort-grid-2">
              <div className="mort-card">
                <h3 className="card-title">Your Financial Profile</h3>
                <div className="info-tip">
                  <Info size={14} />
                  Banks typically allow EMI up to 50% of gross monthly income.
                </div>

                <NumberField label="Monthly Income (₹)" value={elig.income}
                  onChange={v => setElig(p => ({ ...p, income: v }))} min={10000} />
                <NumberField label="Existing EMIs / month (₹)" value={elig.existing}
                  onChange={v => setElig(p => ({ ...p, existing: v }))} min={0} />
                <SliderField
                  label="Interest Rate (% p.a.)"
                  value={elig.rate}
                  min={6} max={18} step={0.05}
                  display={`${elig.rate.toFixed(2)}%`}
                  onChange={v => setElig(p => ({ ...p, rate: v }))}
                />
                <SliderField
                  label="Loan Tenure"
                  value={elig.tenure}
                  min={1} max={30} step={1}
                  display={`${elig.tenure} yr`}
                  onChange={v => setElig(p => ({ ...p, tenure: v }))}
                />
              </div>

              <div className="mort-card result-card">
                <h3 className="card-title">Loan Eligibility</h3>
                {eligResult ? (
                  <>
                    <div className="emi-big">
                      <span className="emi-label">Max Eligible Loan</span>
                      <span className="emi-amount">{formatINR(eligResult.maxLoan)}</span>
                    </div>
                    <div className="emi-summary" style={{ marginTop: '24px' }}>
                      <div className="summary-row-item">
                        <span>Monthly Income</span>
                        <strong>{formatINR(elig.income)}</strong>
                      </div>
                      <div className="summary-row-item">
                        <span>Existing EMIs</span>
                        <strong>{formatINR(elig.existing)}</strong>
                      </div>
                      <div className="summary-row-item">
                        <span>Max Affordable EMI</span>
                        <strong className="green">{formatINR(eligResult.maxEmi)}</strong>
                      </div>
                    </div>
                    <div className="elig-note">
                      Based on 50% FOIR (Fixed Obligation to Income Ratio) — the standard used by most Indian banks.
                    </div>
                  </>
                ) : (
                  <p className="empty-msg red">Your existing EMIs exceed 50% of income — most banks will not approve a new loan.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ COMPARE ══════ */}
        {tab === 'compare' && (
          <div className="mort-panel">
            {/* Floating icons — behind all content */}
            <FloatingIcons />
            <div className="mort-grid-2">
              {[
                { loan: loanA, setLoan: setLoanA, label: 'Loan A' },
                { loan: loanB, setLoan: setLoanB, label: 'Loan B' },
              ].map(({ loan, setLoan, label }, idx) => {
                const res = idx === 0 ? resultA : resultB;
                return (
                  <div className="mort-card" key={label}>
                    <h3 className="card-title">{label}</h3>
                    <div className="form-field">
                      <label>Bank Name</label>
                      <input value={loan.bank} onChange={e => setLoan(p => ({ ...p, bank: e.target.value }))} />
                    </div>
                    <NumberField label="Loan Amount (₹)" value={loan.amount}
                      onChange={v => setLoan(p => ({ ...p, amount: v }))} min={100000} />
                    <SliderField
                      label="Interest Rate (% p.a.)"
                      value={loan.rate}
                      min={6} max={18} step={0.05}
                      display={`${loan.rate.toFixed(2)}%`}
                      onChange={v => setLoan(p => ({ ...p, rate: v }))}
                    />
                    <SliderField
                      label="Tenure"
                      value={loan.tenure}
                      min={1} max={30} step={1}
                      display={`${loan.tenure} yr`}
                      onChange={v => setLoan(p => ({ ...p, tenure: v }))}
                    />
                    {res && (
                      <div className="compare-result">
                        <div className="compare-stat">
                          <span>Monthly EMI</span>
                          <strong>{formatINR(res.emi)}</strong>
                        </div>
                        <div className="compare-stat">
                          <span>Total Interest</span>
                          <strong className="red">{formatINR(res.interest)}</strong>
                        </div>
                        <div className="compare-stat">
                          <span>Total Payable</span>
                          <strong>{formatINR(res.total)}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Winner banner */}
            {resultA && resultB && (
              <div className="winner-banner">
                {resultA.total < resultB.total ? (
                  <><span className="winner-tag">Better Deal</span> <strong>{loanA.bank}</strong> saves you {formatINR(resultB.total - resultA.total)} in total interest</>
                ) : resultB.total < resultA.total ? (
                  <><span className="winner-tag">Better Deal</span> <strong>{loanB.bank}</strong> saves you {formatINR(resultA.total - resultB.total)} in total interest</>
                ) : (
                  <>Both loans have identical total cost.</>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════ AMORTIZATION ══════ */}
        {tab === 'schedule' && (
          <div className="mort-panel">
            {/* Floating icons — behind all content */}
            <FloatingIcons />
            <div className="mort-card">
              <div className="sched-header">
                <h3 className="card-title">Repayment Schedule</h3>
                <p className="sched-note">Based on EMI Calculator inputs — adjust sliders there to update this table.</p>
              </div>

              {schedule.length > 0 ? (
                <>
                  {/* Year summary cards */}
                  <div className="year-summary">
                    {Array.from({ length: Math.ceil(emi.tenure) }, (_, yi) => {
                      const yearRows = schedule.slice(yi * 12, (yi + 1) * 12);
                      const yearInterest  = yearRows.reduce((s, r) => s + r.interest,   0);
                      const yearPrincipal = yearRows.reduce((s, r) => s + r.principal,  0);
                      return (
                        <div key={yi} className="year-card">
                          <span className="year-label">Year {yi + 1}</span>
                          <span className="year-principal">↓ {formatINR(yearPrincipal)}</span>
                          <span className="year-interest red">+ {formatINR(yearInterest)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Month-by-month table */}
                  <div className="sched-table-wrap">
                    <table className="sched-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>EMI</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleVisible.map(row => (
                          <tr key={row.month}>
                            <td>{row.month}</td>
                            <td>{formatINR(row.emi)}</td>
                            <td className="green">{formatINR(row.principal)}</td>
                            <td className="red">{formatINR(row.interest)}</td>
                            <td>{formatINR(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {schedule.length > 24 && (
                    <button className="expand-btn" onClick={() => setSchedExpanded(e => !e)}>
                      {schedExpanded
                        ? <><ChevronUp size={16} /> Show less</>
                        : <><ChevronDown size={16} /> Show all {schedule.length} months</>}
                    </button>
                  )}
                </>
              ) : (
                <p className="empty-msg">Set loan details in the EMI Calculator tab first.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reusable field components ─────────────────────────
function SliderField({ label, value, min, max, step, display, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-field">
      <div className="slider-top">
        <label>{label}</label>
        <span className="slider-val">{display}</span>
      </div>
      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0 }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}