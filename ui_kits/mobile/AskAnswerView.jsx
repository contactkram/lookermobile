// AskAnswerView.jsx — the answer screen shown after submitting a question.
// Replaces the inline AskAnswer that was in AskScreen.jsx.
//
// Features:
//  - Progressive reveal: thinking → summary text (word-by-word) → chart → sources → follow-ups
//  - Inline citations [1] [2] tied to a Sources card below
//  - Three result kinds:
//      'answer'      — normal answer with chart + sources + follow-ups
//      'long'        — multi-paragraph long-form with two chart blocks
//      'cant_answer' — apology + nearest matching dashboards/Looks + escalate
//      'error'       — connectivity / server error with retry
//  - Tone phrasing varies by personality (passed via prefs)

(function () {
  const PHASE_DELAYS = {
    thinking:  900,   // skeleton → start revealing summary
    summary:   60,    // ms per word during typewriter reveal
    chart:     220,   // delay before chart fades in after summary completes
    sources:   320,
    followups: 280,
  };

  // ─── Personality phrasing for header attribution + can't-answer ─────────
  const ATTRIB_BY_PERSONALITY = {
    staid:    'From Looker',
    friendly: 'Here\'s what Looker found',
    quirky:   'Hot off the warehouse',
    concise:  'Looker',
  };
  const CANT_HEADLINE_BY_PERSONALITY = {
    staid:    "I couldn't find an answer in your data.",
    friendly: "Hmm, I couldn't find a clean answer for that.",
    quirky:   "Drew a blank on that one.",
    concise:  "No match.",
  };
  const CANT_BODY_BY_PERSONALITY = {
    staid:    "The question doesn't map to a model I have access to. Try rephrasing, or browse existing content below.",
    friendly: "The data isn't quite shaped that way. Try a different angle, or open one of these — they're close.",
    quirky:   "Either the data isn't shaped that way, or the question's too sneaky for me. These might help though.",
    concise:  "Try rephrasing. Closest matches below.",
  };

  // ─── Main view ──────────────────────────────────────────────────────────
  function AskAnswer({ thread, accent, prefs, onAsk, onClose, onOpenSource }) {
    const t = window.LKR_TOKENS;
    const personality = prefs?.personality || 'staid';

    // Internal phase state — advances as content reveals.
    // phases: 'thinking' | 'summary' | 'chart' | 'sources' | 'followups' | 'done'
    const [phase, setPhase] = React.useState('thinking');
    // Word index for the typewriter reveal of the summary
    const [revealIdx, setRevealIdx] = React.useState(0);

    const result    = thread.result;
    const kind      = result?.kind || 'answer';
    const isStreaming = thread.busy;

    // ── Drive the progressive reveal once `result` is available ──────────
    React.useEffect(() => {
      // Reset for a new thread.
      setPhase('thinking'); setRevealIdx(0);
    }, [thread.q]);

    React.useEffect(() => {
      if (isStreaming || !result) return;

      // Special-cased non-success kinds: just reveal everything at once.
      if (kind === 'cant_answer' || kind === 'error') {
        setPhase('done');
        return;
      }

      // 1. Advance from thinking → summary after a tiny pause.
      const startSummary = setTimeout(() => setPhase('summary'), 80);
      return () => clearTimeout(startSummary);
    }, [isStreaming, result, kind]);

    // ── Typewriter for the summary text ───────────────────────────────────
    React.useEffect(() => {
      if (phase !== 'summary' || !result?.summary) return;
      const words = result.summary.split(/(\s+)/); // keep whitespace tokens
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setRevealIdx(i);
        if (i >= words.length) {
          clearInterval(id);
          // Phase chain: chart → sources → followups → done
          setTimeout(() => setPhase('chart'),                                                   PHASE_DELAYS.chart);
          setTimeout(() => setPhase('sources'),   PHASE_DELAYS.chart + PHASE_DELAYS.sources);
          setTimeout(() => setPhase('followups'), PHASE_DELAYS.chart + PHASE_DELAYS.sources + PHASE_DELAYS.followups);
          setTimeout(() => setPhase('done'),      PHASE_DELAYS.chart + PHASE_DELAYS.sources + PHASE_DELAYS.followups + 80);
        }
      }, PHASE_DELAYS.summary);
      return () => clearInterval(id);
    }, [phase, result]);

    return (
      <div data-screen-label="01b Ask · answer" style={{
        background: t.GREY_50, minHeight: '100%', paddingBottom: 100,
        display: 'flex', flexDirection: 'column',
      }}>
        <window.LkrTopNav title="Answer" onBack={onClose}
          right={<window.LkrIcon name="more_vert" size={22} color={t.GREY_700} />}
        />

        {/* Question bubble */}
        <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            background: accent, color: '#fff', borderRadius: '18px 18px 4px 18px',
            padding: '10px 14px', maxWidth: '85%', fontFamily: t.FONT_TEXT,
            fontSize: 15, lineHeight: 1.35,
          }}>{thread.q}</div>
        </div>

        {/* Attribution row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px 6px',
          color: t.GREY_600, fontSize: 12, fontFamily: t.FONT_TEXT,
        }}>
          <window.LkrIcon name="auto_awesome" size={14} color={accent} fill={1} />
          {isStreaming
            ? <ThinkingDots />
            : kind === 'error'
              ? <span style={{ color: '#D93025' }}>Couldn't reach Looker</span>
              : kind === 'cant_answer'
                ? <span>No matching data found</span>
                : <span>{ATTRIB_BY_PERSONALITY[personality]} · {result.sources?.length || 2} sources</span>}
        </div>

        {/* Body — switches on kind + isStreaming */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isStreaming
            ? <ThinkingSkeleton t={t} />
            : kind === 'error'
              ? <ErrorCard message={result.message} onRetry={() => onAsk(thread.q)} t={t} accent={accent} />
              : kind === 'cant_answer'
                ? <CantAnswerCard result={result} personality={personality}
                    onOpenSource={onOpenSource} onAsk={onAsk} t={t} accent={accent} />
                : <SuccessAnswer
                    result={result} accent={accent} phase={phase} revealIdx={revealIdx}
                    onAsk={onAsk} onOpenSource={onOpenSource} t={t} />}
        </div>

        <div style={{ flex: 1 }} />

        <window.Composer value="" onChange={() => {}} onSubmit={(q) => q && onAsk(q)}
          onListen={() => {}} accent={accent} inputRef={React.useRef()} sticky />
      </div>
    );
  }

  // ─── Thinking dots ──────────────────────────────────────────────────────
  function ThinkingDots() {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        Thinking
        <span className="lkr-dot-pulse" style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
          <i style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', animation: 'lkrDot 1.2s ease-in-out infinite' }} />
          <i style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', animation: 'lkrDot 1.2s ease-in-out 0.18s infinite' }} />
          <i style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', animation: 'lkrDot 1.2s ease-in-out 0.36s infinite' }} />
        </span>
      </span>
    );
  }

  function ThinkingSkeleton({ t }) {
    return (
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
    );
  }

  // ─── SuccessAnswer — orchestrates the progressive reveal ────────────────
  function SuccessAnswer({ result, accent, phase, revealIdx, onAsk, onOpenSource, t }) {
    const showSummary   = phase === 'summary' || phase === 'chart' || phase === 'sources' || phase === 'followups' || phase === 'done';
    const showChart     = phase === 'chart' || phase === 'sources' || phase === 'followups' || phase === 'done';
    const showSources   = phase === 'sources' || phase === 'followups' || phase === 'done';
    const showFollowups = phase === 'followups' || phase === 'done';

    return (
      <>
        {/* Card with summary + chart together */}
        <div style={{
          background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
          fontFamily: t.FONT_TEXT, overflow: 'hidden',
        }}>
          {/* Summary text — typewriter, with citation markers */}
          {showSummary ? (
            <SummaryText summary={result.summary} revealIdx={revealIdx}
              sources={result.sources} accent={accent}
              extras={result.paragraphs} extrasShown={phase === 'done'}
              t={t} />
          ) : null}

          {/* First chart block — fades in */}
          {showChart && (
            <FadeIn>
              <ChartBlock title={result.chartTitle} accent={accent} kind={result.chartKind}
                labels={result.labels} values={result.values}
                series={result.series} t={t} />
            </FadeIn>
          )}

          {/* Optional second chart block for long-form answers */}
          {phase === 'done' && result.chart2Title && (
            <FadeIn>
              <ChartBlock title={result.chart2Title} accent={accent} kind={result.chart2Kind || 'line'}
                labels={result.chart2Labels} values={result.chart2Values}
                t={t} />
            </FadeIn>
          )}

          {/* Action row */}
          {showChart && (
            <FadeIn>
              <div style={{
                display: 'flex', gap: 8, paddingTop: 6,
                borderTop: `1px solid ${t.HAIRLINE}`, alignItems: 'center',
              }}>
                <button style={textBtn(t)} onClick={() => onOpenSource?.(result.sources?.[0])}>
                  <window.LkrIcon name="open_in_new" size={16} /> Open as Look
                </button>
                <div style={{ flex: 1 }} />
                <button style={iconBtn(t)}><window.LkrIcon name="thumb_up" size={18} /></button>
                <button style={iconBtn(t)}><window.LkrIcon name="thumb_down" size={18} /></button>
                <button style={iconBtn(t)}><window.LkrIcon name="share" size={18} /></button>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Sources card */}
        {showSources && result.sources?.length > 0 && (
          <FadeIn>
            <SourcesCard sources={result.sources} accent={accent}
              onOpen={onOpenSource} t={t} />
          </FadeIn>
        )}

        {/* Follow-ups */}
        {showFollowups && result.followups?.length > 0 && (
          <FadeIn>
            <div style={{ marginTop: 4 }}>
              <SectionLabel t={t}>Follow up</SectionLabel>
              <window.LkrChipRow>
                {result.followups.map((f, i) => (
                  <window.LkrChip key={i} onClick={() => onAsk(f)}>{f}</window.LkrChip>
                ))}
              </window.LkrChipRow>
            </div>
          </FadeIn>
        )}
      </>
    );
  }

  // ─── SummaryText — renders prose with inline [n] citations ──────────────
  function SummaryText({ summary, revealIdx, sources, accent, extras, extrasShown, t }) {
    // Split on whitespace, keep separators
    const tokens = React.useMemo(() => (summary || '').split(/(\s+)/), [summary]);
    const visible = tokens.slice(0, revealIdx).join('');
    const stillTyping = revealIdx < tokens.length;

    return (
      <div style={{
        fontSize: 15, color: t.GREY_900, lineHeight: 1.5,
        fontFamily: t.FONT_TEXT, letterSpacing: '-0.05px', whiteSpace: 'pre-wrap',
      }}>
        <CitedText text={visible} sources={sources} accent={accent} />
        {stillTyping && <span style={{
          display: 'inline-block', width: 2, height: '1em', background: accent,
          verticalAlign: '-2px', marginLeft: 1,
          animation: 'lkrCaret 1s steps(2, end) infinite',
        }} />}
        {/* Extra paragraphs for long-form (revealed only when phase = done) */}
        {extrasShown && extras?.map((p, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <CitedText text={p} sources={sources} accent={accent} />
          </div>
        ))}
      </div>
    );
  }

  // Parses [N] markers inside the given text and replaces them with small
  // tappable superscript pills that scroll to the matching source card.
  function CitedText({ text, sources, accent }) {
    const parts = String(text || '').split(/(\[\d+\])/g);
    return (
      <>
        {parts.map((part, i) => {
          const m = /^\[(\d+)\]$/.exec(part);
          if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
          const n = Number(m[1]);
          const src = sources?.find((s) => s.n === n);
          return (
            <button key={i} onClick={() => {
              const el = document.getElementById(`lkr-src-${n}`);
              if (el) {
                el.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
                el.style.outline = `2px solid ${accent}`;
                setTimeout(() => { el.style.outline = ''; }, 1200);
              }
            }} title={src?.title || ''} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18, padding: '0 5px', marginInline: 1,
              fontFamily: 'inherit', fontSize: 10, fontWeight: 600, color: accent,
              background: accent + '14', border: 'none', borderRadius: 5,
              cursor: 'pointer', verticalAlign: '1px', lineHeight: 1,
            }}>{n}</button>
          );
        })}
      </>
    );
  }

  // ─── ChartBlock — labelled chart with a soft inner surface ──────────────
  function ChartBlock({ title, accent, kind = 'bar', labels = [], values = [], series, t }) {
    return (
      <div style={{
        borderRadius: 10, padding: 12, background: t.GREY_50,
        border: `1px solid ${t.HAIRLINE}`,
      }}>
        <div style={{
          fontFamily: t.FONT_BRAND, fontSize: 11, color: t.GREY_700, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
        }}>{title}</div>
        {kind === 'line'
          ? <MiniLine values={values} labels={labels} accent={accent} t={t} />
          : kind === 'stacked'
            ? <MiniStackedBar series={series} labels={labels} accent={accent} t={t} />
            : <window.LkrBarChart values={values} labels={labels} color={accent} height={120} />}
      </div>
    );
  }

  // Hand-tuned mini line chart — clean, no axes, with end-of-line dot
  function MiniLine({ values, labels, accent, t }) {
    const min = Math.min(...values), max = Math.max(...values);
    const range = max - min || 1;
    const pts = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 84 - 8;
      return [x, y];
    });
    const polyline = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const polygon  = `0,100 ${polyline} 100,100`;
    const last = pts[pts.length - 1];
    return (
      <div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 110, display: 'block', overflow: 'visible' }}>
          <polygon points={polygon} fill={accent} opacity="0.10" />
          <polyline points={polyline} fill="none" stroke={accent} strokeWidth="1.7"
            vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={last[0]} cy={last[1]} r="2.4" fill={accent} vectorEffect="non-scaling-stroke" />
        </svg>
        {labels?.length > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 6,
            fontFamily: t.FONT_TEXT, fontSize: 10, color: t.GREY_600,
          }}>
            {labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        )}
      </div>
    );
  }

  // Mini stacked bar — for long-form's second chart
  function MiniStackedBar({ series, labels, accent, t }) {
    if (!series?.length) return null;
    const palette = [accent, '#7B61FF', '#34A853', '#FBBC04', '#EA4335'];
    const totals = labels.map((_, i) => series.reduce((s, ser) => s + ser.values[i], 0));
    const max = Math.max(...totals);
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }}>
          {labels.map((_, i) => {
            const total = totals[i];
            return (
              <div key={i} style={{
                flex: 1, height: `${(total / max) * 100}%`, display: 'flex',
                flexDirection: 'column-reverse', borderRadius: '4px 4px 0 0', overflow: 'hidden', minHeight: 4,
              }}>
                {series.map((ser, j) => (
                  <div key={j} style={{
                    background: palette[j % palette.length],
                    height: `${(ser.values[i] / total) * 100}%`,
                  }} />
                ))}
              </div>
            );
          })}
        </div>
        <div style={{
          display: 'flex', gap: 6, marginTop: 6,
          fontFamily: t.FONT_TEXT, fontSize: 10, color: t.GREY_600,
        }}>
          {labels.map((l, i) => <div key={i} style={{ flex: 1, textAlign: 'center' }}>{l}</div>)}
        </div>
        <div style={{
          display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap',
          fontFamily: t.FONT_TEXT, fontSize: 10, color: t.GREY_700,
        }}>
          {series.map((ser, j) => (
            <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: palette[j % palette.length] }} />
              {ser.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ─── SourcesCard ────────────────────────────────────────────────────────
  function SourcesCard({ sources, accent, onOpen, t }) {
    return (
      <div style={{
        background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '12px 14px 8px',
          fontFamily: t.FONT_BRAND, fontSize: 11, color: t.GREY_700, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <window.LkrIcon name="bookmark" size={14} color={t.GREY_600} />
          <span>Sources</span>
        </div>
        {sources.map((src, i) => (
          <button key={src.n} id={`lkr-src-${src.n}`} onClick={() => onOpen?.(src)} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '10px 14px', background: 'transparent', border: 'none',
            borderTop: i ? `1px solid ${t.HAIRLINE}` : 'none', cursor: 'pointer',
            textAlign: 'left', fontFamily: t.FONT_TEXT,
            transition: 'outline 200ms', outlineOffset: -2, borderRadius: 0,
          }}>
            {/* Citation number badge */}
            <div style={{
              minWidth: 22, height: 22, padding: '0 6px', flex: '0 0 auto',
              background: accent + '14', color: accent, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.FONT_BRAND, fontWeight: 600, fontSize: 11,
            }}>{src.n}</div>
            <div style={{
              width: 28, height: 28, borderRadius: 7, flex: '0 0 28px',
              background: t.GREY_100, color: t.GREY_700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <window.LkrIcon name={src.kind === 'look' ? 'query_stats' : 'dashboard'} size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 14, color: t.GREY_900, fontFamily: t.FONT_BRAND, fontWeight: 500,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{src.title}</div>
              <div style={{ fontSize: 11, color: t.GREY_600, marginTop: 1 }}>
                {src.kind === 'look' ? 'Look' : 'Dashboard'} · {src.model || src.sub}
              </div>
            </div>
            <window.LkrIcon name="chevron_right" size={18} color={t.GREY_500} />
          </button>
        ))}
      </div>
    );
  }

  // ─── CantAnswerCard ─────────────────────────────────────────────────────
  function CantAnswerCard({ result, personality, onOpenSource, onAsk, t, accent }) {
    return (
      <>
        <div style={{
          background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          fontFamily: t.FONT_TEXT,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flex: '0 0 36px',
              background: t.GREY_100, color: t.GREY_700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <window.LkrIcon name="search_off" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 16, color: t.GREY_900,
                lineHeight: 1.3,
              }}>{CANT_HEADLINE_BY_PERSONALITY[personality]}</div>
              <div style={{ fontSize: 13, color: t.GREY_700, marginTop: 6, lineHeight: 1.45 }}>
                {CANT_BODY_BY_PERSONALITY[personality]}
              </div>
            </div>
          </div>
        </div>

        {result.suggestions?.length > 0 && (
          <div style={{
            background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 14px 8px', fontFamily: t.FONT_BRAND, fontSize: 11,
              color: t.GREY_700, fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>Close matches</div>
            {result.suggestions.map((s, i) => (
              <window.LkrRow key={i} icon={s.kind === 'look' ? 'query_stats' : 'dashboard'}
                title={s.title} sub={s.sub} onClick={() => onOpenSource?.(s)} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <window.LkrButton variant="outlined" onClick={() => onAsk('')}>
            Rephrase
          </window.LkrButton>
          <window.LkrButton variant="tonal">
            Ask a data team member
          </window.LkrButton>
        </div>
      </>
    );
  }

  // ─── ErrorCard ──────────────────────────────────────────────────────────
  function ErrorCard({ message, onRetry, t, accent }) {
    return (
      <div style={{
        background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
        padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 10, fontFamily: t.FONT_TEXT,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#FCE8E6',
          color: '#D93025', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <window.LkrIcon name="cloud_off" size={24} />
        </div>
        <div style={{
          fontFamily: t.FONT_BRAND, fontSize: 16, fontWeight: 500, color: t.GREY_900,
        }}>Something went wrong</div>
        <div style={{
          fontSize: 13, color: t.GREY_700, maxWidth: 280, lineHeight: 1.4,
        }}>{message || "Couldn't reach Looker. Check your connection and try again."}</div>
        <div style={{ marginTop: 4 }}>
          <window.LkrButton variant="filled" onClick={onRetry} icon="refresh">
            Try again
          </window.LkrButton>
        </div>
      </div>
    );
  }

  // ─── FadeIn wrapper ─────────────────────────────────────────────────────
  function FadeIn({ children }) {
    return <div style={{ animation: 'lkrFadeUp 320ms cubic-bezier(0.2,0,0,1) both' }}>{children}</div>;
  }

  function SectionLabel({ children, t }) {
    return (
      <div style={{
        padding: '4px 4px 8px', fontFamily: t.FONT_BRAND, fontSize: 11, fontWeight: 500,
        color: t.GREY_700, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>{children}</div>
    );
  }

  function textBtn(t) {
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

  // ─── Keyframes ──────────────────────────────────────────────────────────
  const kf = document.createElement('style');
  kf.textContent = `
    @keyframes lkrFadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes lkrDot    { 0%,80%,100% { opacity: 0.25; } 40% { opacity: 1; } }
    @keyframes lkrCaret  { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
  `;
  document.head.appendChild(kf);

  window.AskAnswer = AskAnswer;
})();
