// Onboarding.jsx — first-run personalization for Looker mobile.
// 3 steps: Welcome → Role → Personality → done. Persists to localStorage.

const LKR_PREFS_KEY = 'lkr.prefs.v1';

// ─── Roles ──────────────────────────────────────────────────────────────────
const ROLES = [
  { id: 'practitioner', label: 'Data practitioner', sub: 'I build dashboards and run analysis', icon: 'analytics' },
  { id: 'consumer',     label: 'Data user',         sub: 'I view dashboards others build',     icon: 'visibility' },
  { id: 'executive',    label: 'Executive',         sub: 'I track headline metrics',           icon: 'insights' },
  { id: 'operator',     label: 'Team lead',         sub: 'I manage a team and operations',     icon: 'group' },
  { id: 'exploring',    label: 'Just exploring',    sub: 'Show me around',                     icon: 'explore' },
];

// ─── Personalities ──────────────────────────────────────────────────────────
const PERSONALITIES = [
  { id: 'staid',    label: 'Staid',    sub: 'Professional and neutral',     icon: 'account_balance' },
  { id: 'friendly', label: 'Friendly', sub: 'Warm and conversational',      icon: 'waving_hand' },
  { id: 'quirky',   label: 'Quirky',   sub: 'Playful and a little surprising', icon: 'celebration' },
  { id: 'concise',  label: 'Concise',  sub: 'Just the facts',               icon: 'bolt' },
];

// ─── Greeting copy by personality ────────────────────────────────────────────
// Keep within content rules: no emoji, sentence case, no exclamation points.
const GREETINGS = {
  staid:    { hello: 'Hi Hanna',                title: "What would you like to know?",         hero: "What do you want to know?" },
  friendly: { hello: 'Good morning, Hanna',     title: "What can I help you find today?",      hero: "What can I help you find today?" },
  quirky:   { hello: 'Hey Hanna',                title: "Let's dig in — what's on your mind?",  hero: "Let's dig in. What's on your mind?" },
  concise:  { hello: 'Hanna',                    title: "Ask anything.",                        hero: "Ask anything." },
};

// ─── Suggestion sets by role ─────────────────────────────────────────────────
const SUGGESTIONS_BY_ROLE = {
  practitioner: [
    { icon: 'compare_arrows', prompt: 'Why did NA pipeline drop last week?', thumb: 'spark' },
    { icon: 'science',        prompt: 'Compare Q3 and Q4 by segment',         thumb: 'bar'   },
    { icon: 'group_add',      prompt: 'Activation rate by cohort',            thumb: 'line'  },
    { icon: 'troubleshoot',   prompt: "What's driving variance vs forecast?", thumb: 'donut' },
  ],
  consumer: [
    { icon: 'trending_up',    prompt: "What's driving revenue this quarter?", thumb: 'bar'   },
    { icon: 'flag',           prompt: 'Where are we behind on targets?',      thumb: 'line'  },
    { icon: 'pie_chart',      prompt: 'Marketing channel mix this month',     thumb: 'donut' },
    { icon: 'group',          prompt: 'Top accounts by ARR',                  thumb: 'spark' },
  ],
  executive: [
    { icon: 'trending_up',    prompt: 'Revenue trend this quarter',           thumb: 'line'  },
    { icon: 'flag',           prompt: 'Are we on track to hit the target?',   thumb: 'bar'   },
    { icon: 'workspace_premium', prompt: 'Top accounts by ARR',               thumb: 'spark' },
    { icon: 'public',         prompt: 'Revenue by region',                    thumb: 'donut' },
  ],
  operator: [
    { icon: 'show_chart',     prompt: 'Daily active users this week',         thumb: 'line'  },
    { icon: 'filter_alt',     prompt: 'Conversion funnel today',              thumb: 'bar'   },
    { icon: 'support_agent',  prompt: 'Customer health scores',               thumb: 'donut' },
    { icon: 'person_search',  prompt: 'Pipeline by rep',                      thumb: 'spark' },
  ],
  exploring: [
    { icon: 'auto_awesome',   prompt: "What's interesting in my data?",        thumb: 'line'  },
    { icon: 'history',        prompt: "What's changed in the last 7 days?",    thumb: 'bar'   },
    { icon: 'trending_up',    prompt: 'Most-viewed dashboards',                 thumb: 'spark' },
    { icon: 'public',         prompt: 'Show me something by region',           thumb: 'donut' },
  ],
};

// ─── Local-storage helpers (also persist favorites for niceness) ─────────────
function loadPrefs() {
  try {
    const raw = localStorage.getItem(LKR_PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function savePrefs(prefs) {
  try { localStorage.setItem(LKR_PREFS_KEY, JSON.stringify(prefs)); } catch {}
}
function clearPrefs() {
  try { localStorage.removeItem(LKR_PREFS_KEY); } catch {}
}

// ─── Onboarding flow component ──────────────────────────────────────────────
function Onboarding({ accent = '#1A73E8', onComplete }) {
  const t = window.LKR_TOKENS;
  const [step, setStep] = React.useState(0); // 0 welcome, 1 role, 2 personality
  const [role, setRole] = React.useState(null);
  const [personality, setPersonality] = React.useState(null);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    const prefs = {
      role, personality,
      completedAt: new Date().toISOString(),
      version: 1,
    };
    savePrefs(prefs);
    onComplete(prefs);
  };

  return (
    <div data-screen-label="00 Onboarding" style={{
      position: 'absolute', inset: 0, top: 47, background: '#FFFFFF',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      fontFamily: t.FONT_TEXT,
    }}>
      {/* Progress + back */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px 4px', minHeight: 32,
      }}>
        {step > 0 ? (
          <button onClick={back} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: accent, padding: 0, display: 'flex',
          }}>
            <window.LkrIcon name="arrow_back" size={22} />
          </button>
        ) : <div style={{ width: 22 }} />}
        <ProgressDots step={step} total={3} accent={accent} />
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }}>
        {step === 0 && <WelcomeStep accent={accent} onNext={next} />}
        {step === 1 && <RoleStep role={role} onSelect={(r) => setRole(r)} accent={accent} />}
        {step === 2 && <PersonalityStep value={personality} onSelect={(p) => setPersonality(p)} accent={accent} />}
      </div>

      {/* Footer */}
      {step > 0 && (
        <div style={{
          padding: '12px 20px 32px', borderTop: `1px solid ${t.HAIRLINE}`,
          background: '#fff',
        }}>
          {step === 1 && (
            <PrimaryCta accent={accent} disabled={!role} onClick={next}>Continue</PrimaryCta>
          )}
          {step === 2 && (
            <PrimaryCta accent={accent} disabled={!personality} onClick={finish}>
              Take me in
            </PrimaryCta>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step: Welcome ──────────────────────────────────────────────────────────
function WelcomeStep({ accent, onNext }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 14,
      padding: '24px 0',
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 22,
        background: `linear-gradient(180deg, ${accent} 0%, #1A73E8 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 12px 32px ${accent}33`, marginBottom: 8,
      }}>
        <window.LkrIcon name="auto_awesome" size={40} color="#fff" fill={1} />
      </div>
      <div style={{
        fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 30,
        color: t.GREY_900, letterSpacing: '-0.7px', lineHeight: 1.15,
        textWrap: 'pretty',
      }}>
        Welcome to Looker
      </div>
      <div style={{
        fontFamily: t.FONT_TEXT, fontSize: 15, color: t.GREY_700,
        maxWidth: 320, lineHeight: 1.45, textWrap: 'pretty',
      }}>
        Ask questions in plain language, get answers from your data, and keep what matters close.
      </div>
      <div style={{
        marginTop: 20, fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_600,
        maxWidth: 280, lineHeight: 1.4,
      }}>
        Two quick questions to set things up.
      </div>
      <div style={{ height: 24 }} />
      <PrimaryCta accent={accent} onClick={onNext}>Get started</PrimaryCta>
      <div style={{
        marginTop: 8, fontFamily: t.FONT_TEXT, fontSize: 12, color: t.GREY_600,
      }}>
        Takes about 15 seconds.
      </div>
    </div>
  );
}

// ─── Step: Role ─────────────────────────────────────────────────────────────
function RoleStep({ role, onSelect, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{
        fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 26,
        color: t.GREY_900, letterSpacing: '-0.5px', lineHeight: 1.2,
        marginBottom: 6,
      }}>
        Which best describes you?
      </div>
      <div style={{
        fontFamily: t.FONT_TEXT, fontSize: 14, color: t.GREY_600,
        marginBottom: 20, lineHeight: 1.4,
      }}>
        We'll tailor your home screen and suggestions.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROLES.map((r) => (
          <OptionCard key={r.id}
            icon={r.icon} title={r.label} sub={r.sub}
            selected={role === r.id}
            onClick={() => onSelect(r.id)}
            accent={accent} />
        ))}
      </div>
    </div>
  );
}

// ─── Step: Personality ──────────────────────────────────────────────────────
function PersonalityStep({ value, onSelect, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{
        fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 26,
        color: t.GREY_900, letterSpacing: '-0.5px', lineHeight: 1.2,
        marginBottom: 6,
      }}>
        How should the app sound?
      </div>
      <div style={{
        fontFamily: t.FONT_TEXT, fontSize: 14, color: t.GREY_600,
        marginBottom: 20, lineHeight: 1.4,
      }}>
        Pick a tone for greetings and answers. You can change this later in Settings.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PERSONALITIES.map((p) => (
          <OptionCard key={p.id}
            icon={p.icon} title={p.label} sub={p.sub}
            preview={<TonePreview personality={p.id} />}
            selected={value === p.id}
            onClick={() => onSelect(p.id)}
            accent={accent} />
        ))}
      </div>
    </div>
  );
}

// Renders a tiny sample greeting in the option card so users see the tone
function TonePreview({ personality }) {
  const t = window.LKR_TOKENS;
  const samples = {
    staid:    'Hi Hanna. What would you like to know?',
    friendly: "Good morning, Hanna. What can I help you find?",
    quirky:   "Hey Hanna. Let's dig in.",
    concise:  'Hanna. Ask anything.',
  };
  return (
    <div style={{
      marginTop: 10, padding: '8px 10px', borderRadius: 8,
      background: t.GREY_50, color: t.GREY_700, fontFamily: t.FONT_TEXT,
      fontSize: 12, lineHeight: 1.4, fontStyle: 'italic',
    }}>
      "{samples[personality]}"
    </div>
  );
}

// ─── Bits ───────────────────────────────────────────────────────────────────
function OptionCard({ icon, title, sub, preview, selected, onClick, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <button onClick={onClick} style={{
      background: selected ? `${accent}0F` : '#fff',
      border: `1.5px solid ${selected ? accent : t.HAIRLINE}`,
      borderRadius: 14, padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
      fontFamily: t.FONT_TEXT, display: 'flex', flexDirection: 'column', gap: 4,
      transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flex: '0 0 36px',
          background: selected ? accent : t.GREY_100,
          color: selected ? '#fff' : t.GREY_700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
        }}>
          <window.LkrIcon name={icon} size={20} fill={selected ? 1 : 0} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 15,
            color: t.GREY_900, lineHeight: 1.25,
          }}>{title}</div>
          <div style={{ fontSize: 12, color: t.GREY_600, marginTop: 1 }}>{sub}</div>
        </div>
        {selected && (
          <window.LkrIcon name="check_circle" size={22} color={accent} fill={1} />
        )}
      </div>
      {preview}
    </button>
  );
}

function PrimaryCta({ children, onClick, disabled, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 50, borderRadius: 25, border: 'none',
      background: disabled ? t.GREY_200 : accent,
      color: disabled ? t.GREY_500 : '#fff',
      fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 16,
      cursor: disabled ? 'default' : 'pointer',
      letterSpacing: '-0.1px',
      transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
      boxShadow: disabled ? 'none' : `0 4px 14px ${accent}40`,
    }}>{children}</button>
  );
}

function ProgressDots({ step, total, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 6, borderRadius: 3,
          background: i <= step ? accent : t.GREY_200,
          width: i === step ? 22 : 6,
          transition: 'all 200ms cubic-bezier(0.2,0,0,1)',
        }} />
      ))}
    </div>
  );
}

// ─── Exports ────────────────────────────────────────────────────────────────
Object.assign(window, {
  Onboarding,
  LKR_PREFS_KEY,
  LKR_GREETINGS: GREETINGS,
  LKR_SUGGESTIONS_BY_ROLE: SUGGESTIONS_BY_ROLE,
  LKR_ROLES: ROLES,
  LKR_PERSONALITIES: PERSONALITIES,
  loadLkrPrefs: loadPrefs,
  saveLkrPrefs: savePrefs,
  clearLkrPrefs: clearPrefs,
});
