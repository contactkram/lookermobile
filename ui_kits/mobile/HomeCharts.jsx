// HomeCharts.jsx — orchestration: MostViewedCard, Grid, Scroller, EditMode,
// DrillSheet, useHomeCards (with localStorage persistence).
//
// Chart kinds + raw data live in HomeChartTypes.jsx. This file owns user-
// facing behavior: which cards show on home, drill on tap, refresh affordance,
// edit mode (pin/reorder/remove/add).

(function () {
  if (!window.LkrPickChart || !window.LkrCardsCatalog) {
    console.error('HomeChartTypes.jsx must be loaded before HomeCharts.jsx');
    return;
  }
  const CATALOG = window.LkrCardsCatalog;
  const pickChart = window.LkrPickChart;
  const STORAGE_KEY = 'lkr.homeCards.v1';

  // Default top-4 on home, in this order
  const DEFAULT_IDS = ['rev-daily', 'pipeline-region', 'win-rate', 'channel-mix'];

  // ── useHomeCards — persisted list of card ids in display order ───────
  function useHomeCards() {
    const [ids, setIds] = React.useState(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length) return arr;
        }
      } catch {}
      return [...DEFAULT_IDS];
    });
    const save = (next) => {
      setIds(next);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    };
    return [ids, save];
  }

  function cardById(id) { return CATALOG.find((c) => c.id === id); }

  // ── Relative-time helper ─────────────────────────────────────────────
  function relTime(minutes) {
    if (minutes < 1)  return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const h = Math.floor(minutes / 60);
    if (h < 24) return `${h} hr ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  // ─────────────────────────────────────────────────────────────────────
  // MostViewedCard
  //   props: card, accent, onOpen, onDrill, edit?, onRemove?, onMoveLeft?,
  //          onMoveRight?, dragHandle?
  // ─────────────────────────────────────────────────────────────────────
  function MostViewedCard({ card, accent, onOpen, onDrill, edit, onRemove, onMoveLeft, onMoveRight }) {
    const t = window.LKR_TOKENS;
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshedAt, setRefreshedAt] = React.useState(card.refreshedMin || 5);

    React.useEffect(() => { setRefreshedAt(card.refreshedMin || 5); }, [card.id, card.refreshedMin]);

    const deltaColor =
      card.deltaKind === 'pos' ? '#1E8E3E' :
      card.deltaKind === 'neg' ? '#D93025' : t.GREY_700;
    const deltaGlyph =
      card.deltaKind === 'pos' ? '▲ ' :
      card.deltaKind === 'neg' ? '▼ ' : '';

    const onCardClick = (e) => {
      // Allow nested element handlers (Recharts drill, refresh button) to win.
      if (e.defaultPrevented) return;
      if (edit) return;
      onOpen?.(card);
    };

    const refresh = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (refreshing) return;
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setRefreshedAt(0);
      }, 700);
    };

    return (
      <div onClick={onCardClick} style={{
        background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
        padding: 12, cursor: edit ? 'default' : 'pointer', textAlign: 'left',
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 6,
        fontFamily: t.FONT_TEXT, minHeight: 168,
        transition: 'transform 150ms cubic-bezier(0.2,0,0,1), box-shadow 150ms',
        animation: edit ? 'lkrJiggle 320ms ease-in-out infinite' : 'none',
      }}>
        {/* Edit-mode remove (top-left) */}
        {edit && (
          <button onClick={(e) => { e.stopPropagation(); onRemove?.(card.id); }} style={{
            position: 'absolute', top: -6, left: -6, zIndex: 4,
            width: 24, height: 24, borderRadius: '50%', border: 'none',
            background: t.GREY_900, color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)', padding: 0,
            animation: 'lkrJiggleReverse 320ms ease-in-out infinite',
          }}>
            <window.LkrIcon name="remove" size={16} />
          </button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <window.LkrIcon
            name={card.kind === 'look' ? 'query_stats' : 'dashboard'}
            size={14} color={t.GREY_600}
          />
          <div style={{
            flex: 1, fontFamily: t.FONT_BRAND, fontSize: 12, fontWeight: 500,
            color: t.GREY_700, lineHeight: 1.2, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{card.title}</div>
          {!edit && (
            <button onClick={refresh} title="Refresh" style={{
              background: 'transparent', border: 'none', padding: 2,
              color: refreshing ? accent : t.GREY_500, cursor: 'pointer',
              display: 'flex',
            }}>
              <span style={{
                display: 'inline-flex',
                animation: refreshing ? 'lkrSpin 700ms linear infinite' : 'none',
              }}>
                <window.LkrIcon name="refresh" size={14} />
              </span>
            </button>
          )}
        </div>

        {/* KPI row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: t.FONT_BRAND, fontSize: 20, fontWeight: 500, color: t.GREY_900,
            letterSpacing: '-0.5px', lineHeight: 1.1,
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}>{card.kpi}</div>
          <div style={{
            fontFamily: t.FONT_BRAND, fontSize: 11, fontWeight: 500,
            color: deltaColor, fontFeatureSettings: '"tnum"',
          }}>{deltaGlyph}{card.delta}</div>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, minHeight: 64, marginTop: 2, opacity: refreshing ? 0.45 : 1,
                      transition: 'opacity 200ms cubic-bezier(0.2,0,0,1)' }}>
          {pickChart(card.chart, {
            data: card.data,
            color: accent,
            onDrill: edit ? undefined : (info) => onDrill?.({ ...info, card }),
          })}
        </div>

        {/* Footer: source + timestamp */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: t.FONT_TEXT, fontSize: 10, color: t.GREY_500,
          marginTop: 2,
        }}>
          <span style={{
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
          }}>{card.sub}</span>
          {!edit && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <span style={{
                width: 4, height: 4, borderRadius: '50%',
                background: refreshedAt === 0 ? '#34A853' : t.GREY_400,
              }} />
              {relTime(refreshedAt)}
            </span>
          )}
        </div>

        {/* Edit-mode reorder controls (bottom-right) */}
        {edit && (
          <div style={{
            position: 'absolute', bottom: 6, right: 6, display: 'flex', gap: 4,
            animation: 'lkrJiggleReverse 320ms ease-in-out infinite',
          }}>
            <button onClick={(e) => { e.stopPropagation(); onMoveLeft?.(card.id); }} style={iconBtnStyle(t)}>
              <window.LkrIcon name="arrow_back" size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMoveRight?.(card.id); }} style={iconBtnStyle(t)}>
              <window.LkrIcon name="arrow_forward" size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  function iconBtnStyle(t) {
    return {
      width: 24, height: 24, borderRadius: '50%', border: 'none',
      background: t.GREY_100, color: t.GREY_700, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 0,
    };
  }

  // ── "+ Add card" tile (shown in edit mode at the end of the grid) ────
  function AddCardTile({ onClick }) {
    const t = window.LKR_TOKENS;
    return (
      <button onClick={onClick} style={{
        background: t.GREY_50, border: `1.5px dashed ${t.GREY_300}`, borderRadius: 14,
        minHeight: 168, cursor: 'pointer', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, color: t.GREY_700, fontFamily: t.FONT_TEXT, padding: 12,
      }}>
        <window.LkrIcon name="add" size={28} />
        <div style={{ fontFamily: t.FONT_BRAND, fontSize: 12, fontWeight: 500 }}>Add card</div>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // MostViewedGrid
  //   Top-level home component. Owns: edit mode state, drill sheet state,
  //   home-card persistence.
  // ─────────────────────────────────────────────────────────────────────
  function MostViewedGrid({ accent, onOpen, max = 4 }) {
    const t = window.LKR_TOKENS;
    const [ids, setIds] = useHomeCards();
    const [edit, setEdit] = React.useState(false);
    const [drill, setDrill] = React.useState(null);
    const [addOpen, setAddOpen] = React.useState(false);

    const cards = (edit ? ids : ids.slice(0, max)).map(cardById).filter(Boolean);

    const remove = (id) => setIds(ids.filter((x) => x !== id));
    const moveLeft = (id) => {
      const i = ids.indexOf(id);
      if (i <= 0) return;
      const next = [...ids];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      setIds(next);
    };
    const moveRight = (id) => {
      const i = ids.indexOf(id);
      if (i < 0 || i >= ids.length - 1) return;
      const next = [...ids];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      setIds(next);
    };
    const add = (id) => { if (!ids.includes(id)) setIds([...ids, id]); setAddOpen(false); };

    return (
      <>
        {/* Section header w/ Edit/Done button */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '20px 20px 8px',
          fontFamily: t.FONT_BRAND, fontSize: 12, fontWeight: 500,
          color: t.GREY_700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span style={{ flex: 1 }}>Your most viewed</span>
          <button onClick={() => setEdit(!edit)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: accent, fontFamily: t.FONT_BRAND, fontSize: 14, fontWeight: 500,
            textTransform: 'none', letterSpacing: 0, padding: '4px 6px',
          }}>{edit ? 'Done' : 'Edit'}</button>
        </div>

        <div style={{
          padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {cards.map((c) => (
            <MostViewedCard key={c.id} card={c} accent={accent}
              onOpen={onOpen}
              onDrill={(info) => setDrill(info)}
              edit={edit}
              onRemove={remove}
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
            />
          ))}
          {edit && <AddCardTile onClick={() => setAddOpen(true)} />}
        </div>

        {/* Drill sheet */}
        <DrillSheet drill={drill} accent={accent}
          onClose={() => setDrill(null)}
          onOpenSource={() => {
            const c = drill?.card;
            setDrill(null);
            if (c) onOpen?.(c);
          }} />

        {/* Add-card picker sheet */}
        <AddCardSheet open={addOpen} onClose={() => setAddOpen(false)}
          existingIds={ids} onAdd={add} accent={accent} />
      </>
    );
  }

  // ── Horizontal scroller (smaller cards, for variant A) ───────────────
  function MostViewedScroller({ accent, onOpen }) {
    const [ids] = useHomeCards();
    const [drill, setDrill] = React.useState(null);
    const cards = ids.map(cardById).filter(Boolean);
    return (
      <>
        <div style={{
          display: 'flex', gap: 10, padding: '0 16px 8px',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        }}>
          {cards.map((c) => (
            <div key={c.id} style={{ flex: '0 0 220px' }}>
              <MostViewedCard card={c} accent={accent}
                onOpen={onOpen}
                onDrill={(info) => setDrill(info)} />
            </div>
          ))}
        </div>
        <DrillSheet drill={drill} accent={accent}
          onClose={() => setDrill(null)}
          onOpenSource={() => {
            const c = drill?.card;
            setDrill(null);
            if (c) onOpen?.(c);
          }} />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // DrillSheet — opens when a data point is tapped inside any chart.
  // ─────────────────────────────────────────────────────────────────────
  function DrillSheet({ drill, accent, onClose, onOpenSource }) {
    const t = window.LKR_TOKENS;
    const open = !!drill;
    if (!open) return null;

    const subtitle = drill.card
      ? `${drill.card.title} · ${drill.card.sub}`
      : null;

    return (
      <window.LkrSheet open={open} onClose={onClose}>
        <div style={{ padding: '4px 20px 24px' }}>
          {/* Title */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '4px 0 14px', borderBottom: `1px solid ${t.HAIRLINE}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: accent + '1A',
              color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 36px',
            }}>
              <window.LkrIcon name={drillIcon(drill.kind)} size={20} fill={1} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: t.FONT_BRAND, fontSize: 11, fontWeight: 500, color: t.GREY_700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{drillLabel(drill.kind)}</div>
              <div style={{
                fontFamily: t.FONT_BRAND, fontSize: 18, fontWeight: 500, color: t.GREY_900,
                letterSpacing: '-0.2px', marginTop: 2,
              }}>{drill.label}</div>
              <div style={{
                fontFamily: t.FONT_BRAND, fontSize: 22, fontWeight: 500, color: t.GREY_900,
                letterSpacing: '-0.4px', marginTop: 2, fontFeatureSettings: '"tnum"',
              }}>{drill.value}</div>
              {subtitle && (
                <div style={{
                  fontFamily: t.FONT_TEXT, fontSize: 12, color: t.GREY_600, marginTop: 4,
                }}>from {subtitle}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ paddingTop: 8 }}>
            {[
              { icon: 'filter_alt',    title: `Filter by ${drill.label}`,                 onClick: onClose },
              { icon: 'auto_awesome',  title: `Why did ${drill.label} change?`,            onClick: onClose },
              { icon: 'open_in_new',   title: 'Open source dashboard',                     onClick: onOpenSource },
              { icon: 'add_alert',     title: 'Create alert',                              onClick: onClose },
              { icon: 'share',         title: 'Share data point',                          onClick: onClose },
            ].map((a, i) => (
              <button key={i} onClick={a.onClick} style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: i < 4 ? `1px solid ${t.HAIRLINE}` : 'none',
                padding: '14px 0', display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', textAlign: 'left', fontFamily: t.FONT_TEXT,
              }}>
                <window.LkrIcon name={a.icon} size={20} color={accent} />
                <span style={{
                  flex: 1, fontFamily: t.FONT_BRAND, fontSize: 15, fontWeight: 500,
                  color: t.GREY_900,
                }}>{a.title}</span>
                <window.LkrIcon name="chevron_right" size={18} color={t.GREY_500} />
              </button>
            ))}
          </div>
        </div>
      </window.LkrSheet>
    );
  }
  function drillIcon(kind) {
    return ({
      bar: 'bar_chart', point: 'scatter_plot', segment: 'donut_small',
      account: 'workspace_premium', funnel: 'filter_alt', flow: 'route',
      stack: 'view_week', radar: 'track_changes', treemap: 'grid_view',
      cell: 'apps', gauge: 'speed', goal: 'flag',
    })[kind] || 'data_object';
  }
  function drillLabel(kind) {
    return ({
      bar: 'Data point', point: 'Data point', segment: 'Segment',
      account: 'Account', funnel: 'Funnel stage', flow: 'Flow node',
      stack: 'Stacked value', radar: 'Profile', treemap: 'Region',
      cell: 'Cell', gauge: 'Metric', goal: 'Goal',
    })[kind] || 'Detail';
  }

  // ─────────────────────────────────────────────────────────────────────
  // AddCardSheet — picker of available cards (those not already on home)
  // ─────────────────────────────────────────────────────────────────────
  function AddCardSheet({ open, onClose, existingIds, onAdd, accent }) {
    const t = window.LKR_TOKENS;
    const remaining = CATALOG.filter((c) => !existingIds.includes(c.id));
    if (!open) return null;
    return (
      <window.LkrSheet open={open} onClose={onClose} title="Add a card">
        <div style={{
          padding: '4px 16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {remaining.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', padding: '40px 16px', textAlign: 'center',
              color: t.GREY_600, fontFamily: t.FONT_TEXT,
            }}>
              All available cards are on your home already.
            </div>
          ) : (
            remaining.map((c) => (
              <button key={c.id} onClick={() => onAdd(c.id)} style={{
                background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 12,
                padding: 10, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 6,
                fontFamily: t.FONT_TEXT, minHeight: 132,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <window.LkrIcon name={c.kind === 'look' ? 'query_stats' : 'dashboard'} size={12} color={t.GREY_600} />
                  <div style={{
                    flex: 1, fontFamily: t.FONT_BRAND, fontSize: 11, fontWeight: 500,
                    color: t.GREY_700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{c.title}</div>
                  <window.LkrIcon name="add_circle" size={14} color={accent} fill={1} />
                </div>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontSize: 15, fontWeight: 500, color: t.GREY_900,
                  letterSpacing: '-0.3px', lineHeight: 1.1,
                  fontFeatureSettings: '"tnum"',
                }}>{c.kpi}</div>
                <div style={{ flex: 1, minHeight: 48 }}>
                  {pickChart(c.chart, { data: c.data, color: accent })}
                </div>
                <div style={{ fontSize: 10, color: t.GREY_500 }}>{c.sub}</div>
              </button>
            ))
          )}
        </div>
      </window.LkrSheet>
    );
  }

  // ── keyframes ─────────────────────────────────────────────────────────
  const _kfHome = document.createElement('style');
  _kfHome.textContent = `
    @keyframes lkrJiggle {
      0%, 100% { transform: rotate(-0.6deg); }
      50%      { transform: rotate(0.6deg); }
    }
    @keyframes lkrJiggleReverse {
      0%, 100% { transform: rotate(0.6deg); }
      50%      { transform: rotate(-0.6deg); }
    }
    @keyframes lkrSpin {
      from { transform: rotate(0); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(_kfHome);

  window.MostViewedGrid     = MostViewedGrid;
  window.MostViewedScroller = MostViewedScroller;
  window.MostViewedCards    = CATALOG; // back-compat with earlier API
})();
