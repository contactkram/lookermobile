// AskScreen.jsx — conversational home screen for Looker mobile.
// Four layout variations selectable via Tweaks: combined (default), composer, hero, grid.

function AskScreen({ variant = 'combined', accent = '#1A73E8', prefs, answerState = 'auto', onOpenDashboard, onOpenLook, onOpenSettings }) {
  const t = window.LKR_TOKENS;
  const [draft, setDraft]   = React.useState('');
  const [thread, setThread] = React.useState(null); // null | {q, busy, result}
  const [listening, setListening] = React.useState(false);
  const inputRef = React.useRef(null);

  const submit = (text) => {
    const q = (text ?? draft).trim();
    if (!q) return;
    setThread({ q, busy: true });
    setDraft('');
    setTimeout(() => {
      setThread({ q, busy: false, result: fakeResult(q, answerState) });
    }, 1100);
  };

  // Open the source dashboard / Look behind a chart card
  const openSource = (card) => {
    const item = {
      id: card.sourceId,
      title: card.sourceTitle,
      kind: card.kind,
    };
    if (card.kind === 'look' && onOpenLook) onOpenLook(item);
    else if (onOpenDashboard) onOpenDashboard(item);
  };

  // Resolve personalization (falls back to staid + consumer if no prefs)
  const personality = prefs?.personality || 'staid';
  const role        = prefs?.role        || 'consumer';
  const greeting    = (window.LKR_GREETINGS || {})[personality] || { hello: 'Hi Hanna', title: "What would you like to know?", hero: "What do you want to know?" };

  const SUGGESTIONS = (window.LKR_SUGGESTIONS_BY_ROLE || {})[role] || [
    { icon: 'trending_up',    prompt: "What's driving revenue this quarter?", thumb: 'bar'   },
    { icon: 'group',          prompt: 'Which accounts are at risk of churn?', thumb: 'line'  },
    { icon: 'compare_arrows', prompt: 'Compare pipeline Q3 vs Q4',             thumb: 'donut' },
    { icon: 'rocket_launch',  prompt: 'Top 5 customers by ARR growth',         thumb: 'spark' },
  ];

  const RECENT_CONVOS = [
    { id: 'c1', q: 'Revenue by region last 90 days',     when: '12 min ago', glyph: 'public' },
    { id: 'c2', q: 'Top accounts by ARR',                 when: '1 hr ago',   glyph: 'workspace_premium' },
    { id: 'c3', q: 'Why did NA pipeline drop last week?', when: 'yesterday',  glyph: 'help' },
    { id: 'c4', q: 'Activation rate by cohort',           when: '2 days ago', glyph: 'group_add' },
  ];

  // Thread / answer view ─────────────────────────────────────────────────
  if (thread) {
    // Prefer the externalized AskAnswerView (richer states); fall back to legacy.
    const View = window.AskAnswer || AskAnswerLegacy;
    return <View thread={thread} accent={accent} prefs={prefs}
      onAsk={(q) => submit(q)} onClose={() => setThread(null)}
      onOpenSource={(src) => {
        if (!src) return;
        if (src.kind === 'look' && onOpenLook) onOpenLook({ id: src.id || src.title, title: src.title });
        else if (onOpenDashboard) onOpenDashboard({ id: src.id || src.title, title: src.title });
      }}
      onListen={() => setListening(true)} />;
  }

  // ── COMBINED (A + B) — default ───────────────────────────────────────
  if (variant === 'combined' || !variant) {
    return (
      <div data-screen-label="01 Ask · combined" style={{ paddingBottom: 24 }}>
        {/* B-style personalized greeting header */}
        <div style={{ padding: '4px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onOpenSettings} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          }}>
            <window.LkrAvatar initials="HW" color="#7B61FF" size={36} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_600,
              lineHeight: 1.2,
            }}>{greeting.hello}</div>
            <div style={{
              fontFamily: t.FONT_BRAND, fontSize: 22, fontWeight: 500, color: t.GREY_900,
              letterSpacing: '-0.3px', lineHeight: 1.2, marginTop: 2,
              textWrap: 'pretty',
            }}>{greeting.title}</div>
          </div>
          <button onClick={onOpenSettings} style={{
            background: 'transparent', border: 'none', padding: 8,
            color: t.GREY_700, cursor: 'pointer',
          }}>
            <window.LkrIcon name="settings" size={22} />
          </button>
        </div>

        {/* A-style composer, prominent at top (not sticky) */}
        <Composer value={draft} onChange={setDraft} onSubmit={submit}
          onListen={() => setListening(true)} accent={accent} inputRef={inputRef} />

        {/* Prompt chips — quick conversational starters, kept compact */}
        <SectionLabel>Try asking</SectionLabel>
        <window.LkrChipRow>
          {SUGGESTIONS.map((s, i) => (
            <window.LkrChip key={i} icon={s.icon} onClick={() => submit(s.prompt)}>
              {s.prompt}
            </window.LkrChip>
          ))}
        </window.LkrChipRow>

        {/* Real-data chart grid — the most-viewed dashboards / Looks */}
        <window.MostViewedGrid accent={accent} onOpen={openSource} max={4} />

        {/* A-style clean list group for recent convos */}
        <SectionLabel right="See all">Recent conversations</SectionLabel>
        <window.LkrListGroup>
          {RECENT_CONVOS.map((c) => (
            <window.LkrRow key={c.id} icon={c.glyph} title={c.q} sub={c.when}
              onClick={() => submit(c.q)} />
          ))}
        </window.LkrListGroup>

        {listening && <ListeningSheet onClose={() => setListening(false)}
          onTranscribed={(text) => { setListening(false); submit(text); }} accent={accent} />}
      </div>
    );
  }

  // ── A. Composer-first ────────────────────────────────────────────────
  if (variant === 'composer') {
    return (
      <div data-screen-label="01 Ask · composer" style={{ paddingBottom: 24 }}>
        <window.LkrLargeTitle
          title="Ask your data"
          subtitle={`${greeting.hello}, ${greeting.title.toLowerCase()}`}
          right={
            <button onClick={onOpenSettings} style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            }}>
              <window.LkrAvatar initials="HW" color="#7B61FF" size={32} />
            </button>
          }
        />
        <Composer value={draft} onChange={setDraft} onSubmit={submit}
          onListen={() => setListening(true)} accent={accent} inputRef={inputRef} />

        <SectionLabel>Try asking</SectionLabel>
        <window.LkrChipRow>
          {SUGGESTIONS.map((s, i) => (
            <window.LkrChip key={i} icon={s.icon} onClick={() => submit(s.prompt)}>
              {s.prompt}
            </window.LkrChip>
          ))}
        </window.LkrChipRow>

        <SectionLabel right="See all">Your most viewed</SectionLabel>
        <window.MostViewedScroller accent={accent} onOpen={openSource} />

        <SectionLabel right="See all">Recent conversations</SectionLabel>
        <window.LkrListGroup>
          {RECENT_CONVOS.map((c) => (
            <window.LkrRow key={c.id} icon={c.glyph} title={c.q} sub={c.when}
              onClick={() => submit(c.q)} />
          ))}
        </window.LkrListGroup>

        {listening && <ListeningSheet onClose={() => setListening(false)}
          onTranscribed={(text) => { setListening(false); submit(text); }}
          accent={accent} />}
      </div>
    );
  }

  // ── B. Gemini-style hero ─────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <div data-screen-label="01 Ask · hero" style={{ paddingBottom: 24 }}>
        <div style={{ padding: '4px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onOpenSettings} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          }}>
            <window.LkrAvatar initials="HW" color="#7B61FF" size={32} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_600 }}>{greeting.hello}</div>
            <div style={{ fontFamily: t.FONT_BRAND, fontSize: 22, fontWeight: 500, color: t.GREY_900, letterSpacing: '-0.3px' }}>Hanna</div>
          </div>
          <button onClick={onOpenSettings} style={{ background: 'transparent', border: 'none', padding: 8, color: t.GREY_700, cursor: 'pointer' }}>
            <window.LkrIcon name="settings" size={22} />
          </button>
        </div>

        <HeroCard accent={accent} heroText={greeting.hero}
          onTap={() => inputRef.current?.focus()}
          onListen={() => setListening(true)} />

        <window.MostViewedGrid accent={accent} onOpen={openSource} max={4} />

        <SectionLabel>Try asking</SectionLabel>
        <window.LkrChipRow>
          {SUGGESTIONS.map((s, i) => (
            <window.LkrChip key={i} icon={s.icon} onClick={() => submit(s.prompt)}>
              {s.prompt}
            </window.LkrChip>
          ))}
        </window.LkrChipRow>

        <SectionLabel right="See all">Continue where you left off</SectionLabel>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECENT_CONVOS.slice(0, 3).map((c) => (
            <ConvoRow key={c.id} convo={c} onClick={() => submit(c.q)} />
          ))}
        </div>

        <Composer value={draft} onChange={setDraft} onSubmit={submit}
          onListen={() => setListening(true)} accent={accent} inputRef={inputRef}
          sticky />

        {listening && <ListeningSheet onClose={() => setListening(false)}
          onTranscribed={(text) => { setListening(false); submit(text); }} accent={accent} />}
      </div>
    );
  }

  // ── C. Grid-first ────────────────────────────────────────────────────
  return (
    <div data-screen-label="01 Ask · grid" style={{ paddingBottom: 110 }}>
      <window.LkrLargeTitle
        title="What can I help you find?"
        right={
          <button onClick={onOpenSettings} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          }}>
            <window.LkrAvatar initials="HW" color="#7B61FF" size={32} />
          </button>
        }
      />

      <window.MostViewedGrid accent={accent} onOpen={openSource} max={4} />

      <SectionLabel>Try asking</SectionLabel>
      <window.LkrChipRow>
        {SUGGESTIONS.map((s, i) => (
          <window.LkrChip key={i} icon={s.icon} onClick={() => submit(s.prompt)}>
            {s.prompt}
          </window.LkrChip>
        ))}
      </window.LkrChipRow>

      <SectionLabel right="See all">Recent answers</SectionLabel>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RECENT_CONVOS.map((c) => (
          <ConvoRow key={c.id} convo={c} onClick={() => submit(c.q)} />
        ))}
      </div>

      <Composer value={draft} onChange={setDraft} onSubmit={submit}
        onListen={() => setListening(true)} accent={accent} inputRef={inputRef}
        sticky />

      {listening && <ListeningSheet onClose={() => setListening(false)}
        onTranscribed={(text) => { setListening(false); submit(text); }} accent={accent} />}
    </div>
  );
}

// ─── Section label ──────────────────────────────────────────────────────────
function SectionLabel({ children, right }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '20px 20px 8px',
      fontFamily: t.FONT_BRAND, fontSize: 12, fontWeight: 500,
      color: t.GREY_700, letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      <span style={{ flex: 1 }}>{children}</span>
      {right && <span style={{
        color: t.BLUE, textTransform: 'none', letterSpacing: 0, fontSize: 14,
      }}>{right}</span>}
    </div>
  );
}

// ─── Composer ───────────────────────────────────────────────────────────────
function Composer({ value, onChange, onSubmit, onListen, accent, inputRef, sticky }) {
  const t = window.LKR_TOKENS;
  const wrapStyle = sticky ? {
    position: 'sticky', bottom: 8, padding: '8px 12px 0', zIndex: 4,
    background: 'linear-gradient(180deg, rgba(248,249,250,0) 0%, rgba(248,249,250,0.92) 60%)',
    pointerEvents: 'auto',
  } : { padding: '0 12px 4px' };

  return (
    <div style={wrapStyle}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', borderRadius: 26, padding: '6px 6px 6px 14px',
        border: `1px solid ${t.HAIRLINE}`,
        boxShadow: sticky
          ? '0 4px 16px rgba(60,64,67,0.10), 0 1px 2px rgba(60,64,67,0.06)'
          : '0 1px 2px rgba(60,64,67,0.06)',
      }}>
        <window.LkrIcon name="auto_awesome" size={20} color={accent} fill={1} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask anything about your data"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: t.FONT_TEXT, fontSize: 15, color: t.GREY_900,
            minWidth: 0, padding: '8px 0',
          }}
        />
        {!value && (
          <button type="button" onClick={onListen} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: t.GREY_100, color: t.GREY_700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <window.LkrIcon name="mic" size={20} />
          </button>
        )}
        <button type="submit" disabled={!value.trim()} style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: value.trim() ? accent : t.GREY_200,
          color: value.trim() ? '#fff' : t.GREY_500,
          cursor: value.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
        }}>
          <window.LkrIcon name="arrow_upward" size={20} />
        </button>
      </form>
    </div>
  );
}

// ─── Hero card (variant B) ──────────────────────────────────────────────────
function HeroCard({ accent, onTap, onListen, heroText }) {
  const t = window.LKR_TOKENS;
  // Render hero text with the trailing word in the accent color, to keep B's
  // visual flourish even when copy changes per personality.
  const parts = (heroText || 'What do you want to know today?').split(/\s+/);
  const head  = parts.slice(0, -1).join(' ');
  const tail  = parts[parts.length - 1];
  return (
    <div style={{
      margin: '14px 16px 4px', borderRadius: 22, padding: 20,
      background: `radial-gradient(120% 80% at 90% 0%, ${accent}22 0%, transparent 60%),
                   radial-gradient(140% 100% at 0% 100%, #7B61FF1A 0%, transparent 55%),
                   #FFFFFF`,
      border: `1px solid ${t.HAIRLINE}`,
      display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: t.FONT_BRAND, fontSize: 26, fontWeight: 500, color: t.GREY_900,
        letterSpacing: '-0.4px', lineHeight: 1.2,
      }}>
        {head} <span style={{ color: accent }}>{tail}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onTap} style={{
          flex: 1, height: 44, border: `1px solid ${t.HAIRLINE}`, background: '#fff',
          borderRadius: 22, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: t.FONT_TEXT, fontSize: 14, color: t.GREY_600, cursor: 'pointer',
        }}>
          <window.LkrIcon name="auto_awesome" size={18} color={accent} fill={1} />
          Type a question…
        </button>
        <button onClick={onListen} style={{
          width: 48, height: 48, borderRadius: '50%', border: 'none',
          background: accent, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${accent}55`,
        }}>
          <window.LkrIcon name="mic" size={22} fill={1} />
        </button>
      </div>
    </div>
  );
}

// ─── Suggestion card ────────────────────────────────────────────────────────
function SuggestionCard({ icon, prompt, accent, thumbKind, onClick }) {
  const t = window.LKR_TOKENS;
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
      padding: 12, textAlign: 'left', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 130,
      fontFamily: t.FONT_TEXT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: accent + '1A',
          color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <window.LkrIcon name={icon} size={16} fill={1} />
        </div>
        <div style={{
          height: 32, flex: 1, opacity: 0.55,
        }}>
          <ThumbViz kind={thumbKind} color={accent} />
        </div>
      </div>
      <div style={{
        fontFamily: t.FONT_BRAND, fontSize: 14, color: t.GREY_900,
        fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.1px',
      }}>{prompt}</div>
    </button>
  );
}

function ThumbViz({ kind, color }) {
  if (kind === 'bar') {
    return (
      <svg viewBox="0 0 60 32" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {[10, 18, 14, 24, 28, 20].map((h, i) => (
          <rect key={i} x={i * 10 + 1} y={32 - h} width="7" height={h} rx="1.5" fill={color} />
        ))}
      </svg>
    );
  }
  if (kind === 'donut') {
    return (
      <svg viewBox="0 0 32 32" style={{ height: '100%' }}>
        <circle cx="16" cy="16" r="11" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="5" />
        <circle cx="16" cy="16" r="11" fill="none" stroke={color} strokeWidth="5"
          strokeDasharray="50 100" strokeDashoffset="0" transform="rotate(-90 16 16)" />
      </svg>
    );
  }
  if (kind === 'spark') {
    return (
      <svg viewBox="0 0 60 32" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polyline points="0,24 10,20 20,22 30,12 40,14 50,6 60,8"
          fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // line
  return (
    <svg viewBox="0 0 60 32" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <polygon points="0,28 0,18 10,14 22,16 30,10 42,12 50,6 60,8 60,28"
        fill={color} opacity="0.15" />
      <polyline points="0,18 10,14 22,16 30,10 42,12 50,6 60,8"
        fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Recent conversation row ────────────────────────────────────────────────
function ConvoRow({ convo, onClick }) {
  const t = window.LKR_TOKENS;
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 12,
      padding: 12, display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: t.FONT_TEXT,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: t.GREY_100,
        color: t.GREY_700, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <window.LkrIcon name={convo.glyph} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, color: t.GREY_900, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{convo.q}</div>
        <div style={{ fontSize: 11, color: t.GREY_600, marginTop: 1 }}>{convo.when}</div>
      </div>
      <window.LkrIcon name="chevron_right" size={18} color={t.GREY_500} />
    </button>
  );
}

// ─── Listening sheet (mic recording UI) ─────────────────────────────────────
function ListeningSheet({ onClose, onTranscribed, accent }) {
  const t = window.LKR_TOKENS;
  const [transcript, setTranscript] = React.useState('');
  const target = "Show me revenue by region last quarter";
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTranscript(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);
  return (
    <window.LkrSheet open onClose={onClose}>
      <div style={{ padding: '8px 24px 28px', textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', margin: '8px auto 16px',
          background: `radial-gradient(circle, ${accent} 0%, ${accent} 60%, transparent 70%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: `0 0 0 8px ${accent}22, 0 0 0 18px ${accent}10`,
          animation: 'lkrPulse 1.4s ease-in-out infinite',
        }}>
          <window.LkrIcon name="mic" size={40} fill={1} />
        </div>
        <div style={{
          fontFamily: t.FONT_BRAND, fontSize: 17, fontWeight: 500, color: t.GREY_900,
        }}>Listening…</div>
        <div style={{
          minHeight: 48, marginTop: 12, fontFamily: t.FONT_TEXT, fontSize: 16,
          color: t.GREY_700, padding: '0 16px', lineHeight: 1.4,
        }}>
          {transcript || <span style={{ color: t.GREY_500 }}>Try "Show me revenue by region"</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'center' }}>
          <window.LkrButton variant="outlined" onClick={onClose}>Cancel</window.LkrButton>
          <window.LkrButton variant="filled"
            onClick={() => onTranscribed(transcript || target)}>Send</window.LkrButton>
        </div>
      </div>
    </window.LkrSheet>
  );
}

// ─── Answer view (after submitting) ─────────────────────────────────────────
// Legacy inline AskAnswer — kept as a fallback. The richer answer view lives in
// AskAnswerView.jsx (window.AskAnswer) and is preferred when loaded.
function AskAnswerLegacy({ thread, accent, onAsk, onClose }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{ background: t.GREY_50, minHeight: '100%', paddingBottom: 100, display: 'flex', flexDirection: 'column' }}>
      <window.LkrTopNav title="Answer" onBack={onClose}
        right={<window.LkrIcon name="more_vert" size={22} color={t.GREY_700} />}
      />

      {/* The question bubble */}
      <div style={{ padding: '12px 16px 4px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: accent, color: '#fff', borderRadius: '18px 18px 4px 18px',
          padding: '10px 14px', maxWidth: '85%', fontFamily: t.FONT_TEXT,
          fontSize: 15, lineHeight: 1.35,
        }}>{thread.q}</div>
      </div>

      {/* Answer card */}
      <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 2px',
          color: t.GREY_600, fontSize: 12, fontFamily: t.FONT_TEXT,
        }}>
          <window.LkrIcon name="auto_awesome" size={14} color={accent} fill={1} />
          {thread.busy ? <span>Thinking…</span> : <span>From Looker · 2 sources</span>}
        </div>

        {thread.busy ? (
          <div style={{
            background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {[100, 86, 60].map((w, i) => (
              <div key={i} style={{
                height: 12, width: `${w}%`, borderRadius: 6, background: t.GREY_100,
                animation: `lkrShimmer 1.4s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <>
            <div style={{
              background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
              padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
              fontFamily: t.FONT_TEXT,
            }}>
              <div style={{ fontSize: 15, color: t.GREY_900, lineHeight: 1.45 }}>
                {thread.result.summary}
              </div>
              <div style={{
                borderRadius: 10, padding: 12, background: t.GREY_50,
                border: `1px solid ${t.HAIRLINE}`,
              }}>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontSize: 11, color: t.GREY_700, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
                }}>{thread.result.chartTitle}</div>
                <window.LkrBarChart
                  values={thread.result.values}
                  labels={thread.result.labels}
                  color={accent}
                  height={110}
                />
              </div>
              <div style={{
                display: 'flex', gap: 8, paddingTop: 6,
                borderTop: `1px solid ${t.HAIRLINE}`, alignItems: 'center',
              }}>
                <button style={btnTextStyle(t)}>
                  <window.LkrIcon name="open_in_new" size={16} /> Open as Look
                </button>
                <div style={{ flex: 1 }} />
                <button style={iconBtn(t)}><window.LkrIcon name="thumb_up" size={18} /></button>
                <button style={iconBtn(t)}><window.LkrIcon name="thumb_down" size={18} /></button>
                <button style={iconBtn(t)}><window.LkrIcon name="share" size={18} /></button>
              </div>
            </div>

            <div style={{ marginTop: 4 }}>
              <SectionLabel>Follow up</SectionLabel>
              <div style={{ padding: '0 0' }}>
                <window.LkrChipRow>
                  {thread.result.followups.map((f, i) => (
                    <window.LkrChip key={i} onClick={() => onAsk(f)}>{f}</window.LkrChip>
                  ))}
                </window.LkrChipRow>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <Composer value="" onChange={() => {}} onSubmit={(q) => q && onAsk(q)}
        onListen={() => {}} accent={accent} inputRef={React.useRef()} sticky />
    </div>
  );
}

function btnTextStyle(t) {
  return {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: t.BLUE, fontFamily: t.FONT_BRAND, fontSize: 13, fontWeight: 500,
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 8px',
  };
}
function iconBtn(t) {
  return {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: t.GREY_700, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

// Deterministic fake result so the demo is satisfying ────────────────────────
function fakeResult(q, answerState = 'auto') {
  // Forced state from tweaks — overrides keyword matching
  if (answerState === 'cant_answer') {
    return {
      kind: 'cant_answer',
      suggestions: [
        { kind: 'dashboard', title: 'Sales overview — Q4', sub: 'Hanna Wei · viewed 12 min ago' },
        { kind: 'look',      title: 'Top accounts by ARR',  sub: 'Updated 1 hr ago' },
        { kind: 'dashboard', title: 'Pipeline by region',   sub: 'Aamir Khan · viewed yesterday' },
      ],
    };
  }
  if (answerState === 'error') {
    return {
      kind: 'error',
      message: "Couldn't reach the Looker API. Check your connection and try again.",
    };
  }
  if (answerState === 'long') {
    return {
      kind: 'long',
      summary:
        "Revenue this quarter is $1.24M, tracking +12.4% vs last quarter and +8% ahead of target [1]. " +
        "Growth is concentrated in North America (+18%), driven primarily by enterprise expansion deals from the " +
        "top 20 accounts. APAC is the fastest grower in percentage terms (+28%) but from a smaller base.",
      paragraphs: [
        "EU is flat quarter-over-quarter — the slowdown is mostly in Mid-Market, where deal cycles have lengthened from 38 to 52 days [2]. Enterprise EU is healthy.",
        "Pipeline coverage for next quarter sits at 2.4×, which is below the 3× threshold the sales team aims for. NA and APAC are above; EU and LATAM are below.",
      ],
      chartTitle: "Revenue trend · $K · weekly",
      chartKind: 'line',
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      values: [180, 215, 198, 242, 268, 282, 295, 318],
      chart2Title: "Pipeline by segment and region · $M",
      chart2Kind: 'stacked',
      chart2Labels: ['NA', 'EU', 'APAC', 'LATAM'],
      series: [
        { name: 'Enterprise',  values: [4.2, 2.1, 1.6, 0.6] },
        { name: 'Mid-Market',  values: [2.8, 0.7, 1.0, 0.2] },
        { name: 'Self-serve',  values: [0.9, 0.4, 0.3, 0.1] },
      ],
      sources: [
        { n: 1, kind: 'dashboard', title: 'Sales overview — Q4',  model: 'ecommerce', id: 'd1' },
        { n: 2, kind: 'look',      title: 'EU pipeline velocity', model: 'sales',     id: 'l3' },
      ],
      followups: ['Drill into NA enterprise', 'Why has EU velocity slowed?', 'Compare to forecast'],
    };
  }

  // Keyword-driven defaults
  const ql = q.toLowerCase();
  if (ql.includes('region')) {
    return {
      kind: 'answer',
      summary: "North America leads at $1.24M, up 12.4% vs last quarter [1]. APAC is the fastest grower at +28% but from a smaller base. EU is flat [2].",
      chartTitle: "Revenue by region · $K · last quarter",
      chartKind: 'bar',
      labels: ['NA', 'EU', 'APAC', 'LATAM', 'ME', 'AF'],
      values: [1240, 820, 612, 198, 92, 48],
      sources: [
        { n: 1, kind: 'dashboard', title: 'Sales overview — Q4', model: 'ecommerce', id: 'd1' },
        { n: 2, kind: 'look',      title: 'EU pipeline velocity', model: 'sales',     id: 'l3' },
      ],
      followups: ['Drill into NA by state', 'Why is EU flat?', 'Share with my team'],
    };
  }
  if (ql.includes('risk') || ql.includes('churn')) {
    return {
      kind: 'answer',
      summary: "8 accounts have churn risk above 60% [1]. Acme Corp ($842K ARR) is the highest-value account in this group, with declining product usage in the last 30 days [2].",
      chartTitle: "At-risk accounts by ARR · $K",
      chartKind: 'bar',
      labels: ['Acme', 'Globex', 'Initech', 'Wayne', 'Stark'],
      values: [842, 612, 498, 421, 388],
      sources: [
        { n: 1, kind: 'dashboard', title: 'Customer health',     model: 'cs',     id: 'd5' },
        { n: 2, kind: 'look',      title: 'Acme usage trend',     model: 'product', id: 'l4' },
      ],
      followups: ['Show Acme usage trend', 'Who owns these accounts?', 'Set up a daily alert'],
    };
  }
  if (ql.includes('pipeline') && ql.includes('q')) {
    return {
      kind: 'answer',
      summary: "Q4 pipeline is $8.92M, down 3.1% from Q3's $9.21M [1]. Coverage ratio is 2.4× against the $3.7M revenue target. Enterprise segment is up; Mid-Market dragged the total [2].",
      chartTitle: "Pipeline by quarter · $M",
      chartKind: 'bar',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      values: [6.8, 7.9, 9.2, 8.9],
      sources: [
        { n: 1, kind: 'dashboard', title: 'Pipeline by region', model: 'sales', id: 'd3' },
        { n: 2, kind: 'look',      title: 'Mid-Market velocity', model: 'sales', id: 'l5' },
      ],
      followups: ['Break down by segment', 'Compare to forecast', 'Why is Mid-Market down?'],
    };
  }
  return {
    kind: 'answer',
    summary: "Revenue this quarter is $1.24M, tracking +12.4% vs last quarter and +8% ahead of target [1].",
    chartTitle: "Revenue trend · $K · weekly",
    chartKind: 'line',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    values: [180, 215, 198, 242, 268, 282],
    sources: [
      { n: 1, kind: 'dashboard', title: 'Sales overview — Q4', model: 'ecommerce', id: 'd1' },
    ],
    followups: ['Compare to target', 'Break down by channel', 'Show me last quarter'],
  };
}

// Expose Composer so AskAnswerView (loaded separately) can render the sticky bar.
window.Composer = Composer;

// keyframes
const _kfAsk = document.createElement('style');
_kfAsk.textContent = `
  @keyframes lkrPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  @keyframes lkrShimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
`;
document.head.appendChild(_kfAsk);

window.AskScreen = AskScreen;
