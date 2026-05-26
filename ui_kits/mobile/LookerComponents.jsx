// LookerComponents.jsx — primitive UI components for Looker mobile.
// All chrome lives here so screens can compose freely.
//
// Exports (to window):
//   LkrTopNav, LkrLargeTitle, LkrSearch, LkrTabBar,
//   LkrSection, LkrListGroup, LkrRow, LkrContentCard,
//   LkrChip, LkrChipRow, LkrKpi, LkrSparkline, LkrBarChart,
//   LkrDashboardTile, LkrSheet, LkrIcon, LkrButton, LkrEmptyState,
//   LkrAvatar
// ─────────────────────────────────────────────────────────────────────────────

const BLUE     = '#1A73E8';
const BLUE_50  = '#E8F0FE';
const BLUE_100 = '#D2E3FC';
const BLUE_800 = '#185ABC';
const GREY_50  = '#F8F9FA';
const GREY_100 = '#F1F3F4';
const GREY_200 = '#E8EAED';
const GREY_300 = '#DADCE0';
const GREY_500 = '#9AA0A6';
const GREY_600 = '#80868B';
const GREY_700 = '#5F6368';
const GREY_900 = '#202124';
const HAIRLINE = 'rgba(60,64,67,0.12)';
const FONT_BRAND = '"Google Sans", "Roboto", -apple-system, "SF Pro Display", system-ui, sans-serif';
const FONT_TEXT  = '"Google Sans Text", "Roboto", -apple-system, "SF Pro Text", system-ui, sans-serif';

// ─── Material Symbol wrapper ──────────────────────────────────────────────────
function LkrIcon({ name, size = 24, color, fill = 0, weight = 400 }) {
  return (
    <span className="material-symbols-rounded" style={{
      fontFamily: '"Material Symbols Rounded"',
      fontSize: size, color: color || 'inherit', lineHeight: 1,
      fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      display: 'inline-flex', flex: '0 0 auto', fontWeight: 'normal',
      whiteSpace: 'nowrap', wordWrap: 'normal',
    }}>{name}</span>
  );
}

// ─── Top nav bar (compact, push view) ─────────────────────────────────────────
function LkrTopNav({ title, onBack, right, transparent = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '8px 12px', height: 44, boxSizing: 'border-box',
      background: transparent ? 'transparent' : 'rgba(255,255,255,0.85)',
      backdropFilter: transparent ? undefined : 'blur(20px)',
      WebkitBackdropFilter: transparent ? undefined : 'blur(20px)',
      borderBottom: transparent ? 'none' : `1px solid ${HAIRLINE}`,
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 2, color: BLUE,
          fontFamily: FONT_TEXT, fontSize: 17, padding: '6px 6px',
        }}>
          <LkrIcon name="arrow_back_ios" size={20} />
        </button>
      ) : <div style={{ width: 32 }} />}
      <div style={{
        flex: 1, textAlign: 'center', fontFamily: FONT_BRAND, fontWeight: 500,
        fontSize: 17, color: GREY_900, letterSpacing: '-0.2px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 32, justifyContent: 'flex-end' }}>
        {right}
      </div>
    </div>
  );
}

// ─── iOS large title block ────────────────────────────────────────────────────
function LkrLargeTitle({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '4px 16px 8px', display: 'flex', alignItems: 'flex-end', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: FONT_BRAND, fontWeight: 500, fontSize: 32,
          letterSpacing: '-0.7px', color: GREY_900, lineHeight: 1.1,
        }}>{title}</div>
        {subtitle && <div style={{
          fontFamily: FONT_TEXT, fontSize: 14, color: GREY_600, marginTop: 4,
        }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Search field (iOS grouped) ───────────────────────────────────────────────
function LkrSearch({ placeholder = 'Search', value = '', onChange = () => {} }) {
  return (
    <div style={{ padding: '6px 16px 10px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, height: 36,
        background: GREY_100, borderRadius: 10, padding: '0 10px',
        color: GREY_600,
      }}>
        <LkrIcon name="search" size={20} />
        <input
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: FONT_TEXT, fontSize: 15, color: GREY_900,
            letterSpacing: '-0.1px', minWidth: 0,
          }}
        />
        {value && (
          <button onClick={() => onChange('')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: GREY_500, padding: 0, display: 'flex',
          }}>
            <LkrIcon name="cancel" size={18} fill={1} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Bottom tab bar ───────────────────────────────────────────────────────────
function LkrTabBar({ active = 'ask', onChange = () => {}, tabs }) {
  tabs = tabs || [
    { id: 'ask',       icon: 'auto_awesome',  label: 'Ask'       },
    { id: 'favorites', icon: 'star',          label: 'Favorites' },
    { id: 'folders',   icon: 'folder',        label: 'Folders'   },
    { id: 'boards',    icon: 'bookmarks',     label: 'Boards'    },
    { id: 'alerts',    icon: 'notifications', label: 'Alerts'    },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 5,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderTop: `1px solid ${HAIRLINE}`,
      paddingBottom: 18, /* home indicator inset */
    }}>
      <div style={{ display: 'flex', padding: '6px 4px 4px' }}>
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 0', color: isActive ? BLUE : GREY_600,
              fontFamily: FONT_TEXT, fontSize: 10, fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              <LkrIcon name={t.icon} size={24} fill={isActive ? 1 : 0} weight={isActive ? 500 : 400} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function LkrSection({ title, action, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', padding: '4px 20px 8px',
          fontFamily: FONT_BRAND, fontSize: 13, fontWeight: 500,
          color: GREY_700, letterSpacing: '0.02em', textTransform: 'uppercase',
        }}>
          <span style={{ flex: 1 }}>{title}</span>
          {action && <span style={{
            color: BLUE, textTransform: 'none', fontWeight: 500,
            letterSpacing: 0, fontSize: 14, cursor: 'pointer',
          }}>{action}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── iOS-style grouped list ───────────────────────────────────────────────────
function LkrListGroup({ children }) {
  return (
    <div style={{
      margin: '0 16px', background: '#fff', borderRadius: 12,
      border: `1px solid ${HAIRLINE}`, overflow: 'hidden',
    }}>{children}</div>
  );
}

function LkrRow({ icon, iconBg, title, sub, accessory = 'chevron', onClick, active }) {
  const Wrap = onClick ? 'button' : 'div';
  return (
    <Wrap onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
      minHeight: 52, width: '100%', boxSizing: 'border-box',
      background: active ? BLUE_50 : 'transparent', border: 'none',
      borderTop: `1px solid ${HAIRLINE}`, cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left', fontFamily: FONT_TEXT,
    }}>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 7, flex: '0 0 30px',
          background: iconBg || BLUE_100, color: BLUE_800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LkrIcon name={icon} size={18} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, color: GREY_900, fontFamily: FONT_TEXT,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: GREY_600, marginTop: 1 }}>{sub}</div>}
      </div>
      {accessory === 'chevron' && <LkrIcon name="chevron_right" size={18} color={GREY_500} />}
      {accessory === 'check'   && <LkrIcon name="check" size={20} color={BLUE} />}
      {accessory === 'star'    && <LkrIcon name="star" size={20} color={BLUE} fill={1} />}
      {accessory === 'more'    && <LkrIcon name="more_vert" size={20} color={GREY_600} />}
      {typeof accessory === 'object' && accessory}
    </Wrap>
  );
}

// Override the first border-top
const _listFirstStyle = document.createElement('style');
_listFirstStyle.textContent = `
  .lkr-list > *:first-child, .lkr-list-row-first { border-top: none !important; }
`;
document.head.appendChild(_listFirstStyle);

// ─── Chip ─────────────────────────────────────────────────────────────────────
function LkrChip({ children, selected, onClick, icon, onRemove }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '6px 12px', borderRadius: 999,
      background: selected ? BLUE_100 : '#fff',
      color: selected ? BLUE_800 : GREY_700,
      border: `1px solid ${selected ? BLUE_100 : GREY_300}`,
      fontFamily: FONT_TEXT, fontSize: 13, fontWeight: 500,
      cursor: 'pointer', letterSpacing: '-0.05px',
      whiteSpace: 'nowrap', flex: '0 0 auto',
    }}>
      {icon && <LkrIcon name={icon} size={16} />}
      {children}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <LkrIcon name="close" size={14} />
        </span>
      )}
    </button>
  );
}

function LkrChipRow({ children, padded = true }) {
  return (
    <div style={{
      display: 'flex', gap: 8, padding: padded ? '4px 16px 12px' : 0,
      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
    }}>{children}</div>
  );
}

// ─── KPI ──────────────────────────────────────────────────────────────────────
function LkrKpi({ label, value, delta, deltaKind = 'pos', sub }) {
  const deltaColor = deltaKind === 'pos' ? '#1E8E3E' : deltaKind === 'neg' ? '#D93025' : GREY_700;
  const deltaGlyph = deltaKind === 'pos' ? '▲' : deltaKind === 'neg' ? '▼' : '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        fontFamily: FONT_BRAND, fontSize: 11, fontWeight: 500, color: GREY_700,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</div>
      <div style={{
        fontFamily: FONT_BRAND, fontWeight: 500, fontSize: 28, color: GREY_900,
        letterSpacing: '-0.6px', lineHeight: 1.1,
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
      }}>{value}</div>
      {delta && (
        <div style={{
          fontFamily: FONT_BRAND, fontSize: 12, color: deltaColor, fontWeight: 500,
          fontFeatureSettings: '"tnum" 1', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span>{deltaGlyph}</span><span>{delta}</span>
          {sub && <span style={{ color: GREY_600, marginLeft: 2 }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Sparkline (simple SVG) ───────────────────────────────────────────────────
function LkrSparkline({ values, color = BLUE, fill = true, height = 36, width = '100%' }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 90 - 5;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const linePts = pts.join(' ');
  const areaPts = `0,100 ${linePts} 100,100`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ width, height, display: 'block', overflow: 'visible' }}>
      {fill && <polygon points={areaPts} fill={color} opacity="0.12" />}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── Bar chart ───────────────────────────────────────────────────────────────
function LkrBarChart({ values, color = BLUE, height = 90, labels }) {
  const max = Math.max(...values) || 1;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
        {values.map((v, i) => (
          <div key={i} style={{
            flex: 1, background: color, opacity: 0.85 + (v / max) * 0.15,
            height: `${(v / max) * 100}%`, borderRadius: '3px 3px 0 0',
            minHeight: 2,
          }} />
        ))}
      </div>
      {labels && (
        <div style={{
          display: 'flex', gap: 6, marginTop: 6,
          fontFamily: FONT_TEXT, fontSize: 10, color: GREY_600,
        }}>
          {labels.map((l, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Content card (dashboard / look browse card) ──────────────────────────────
function LkrContentCard({ kind = 'dashboard', title, sub, thumb, onClick, favorited, onFavorite }) {
  const icon = kind === 'dashboard' ? 'dashboard' : kind === 'look' ? 'query_stats' : 'bookmarks';
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: `1px solid ${HAIRLINE}`, borderRadius: 12,
      padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: FONT_TEXT,
    }}>
      {thumb && (
        <div style={{
          background: GREY_50, borderBottom: `1px solid ${HAIRLINE}`,
          padding: 12, height: 80, overflow: 'hidden',
        }}>{thumb}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flex: '0 0 28px',
          background: BLUE_100, color: BLUE_800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LkrIcon name={icon} size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_BRAND, fontSize: 15, fontWeight: 500, color: GREY_900,
            lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: GREY_600, marginTop: 2 }}>{sub}</div>}
        </div>
        {onFavorite !== undefined && (
          <span onClick={(e) => { e.stopPropagation(); onFavorite(); }} style={{
            color: favorited ? BLUE : GREY_500, display: 'flex', padding: 2,
          }}>
            <LkrIcon name="star" size={20} fill={favorited ? 1 : 0} />
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Dashboard tile (inside a dashboard) ──────────────────────────────────────
function LkrDashboardTile({ title, children, footer }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid ${HAIRLINE}`, borderRadius: 12,
      padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        fontFamily: FONT_BRAND, fontSize: 13, fontWeight: 500, color: GREY_700,
        textTransform: 'uppercase', letterSpacing: '0.04em',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ flex: 1 }}>{title}</span>
        <LkrIcon name="more_vert" size={18} color={GREY_500} />
      </div>
      <div>{children}</div>
      {footer && <div style={{
        fontFamily: FONT_TEXT, fontSize: 11, color: GREY_600,
        borderTop: `1px solid ${HAIRLINE}`, paddingTop: 8, marginTop: 2,
      }}>{footer}</div>}
    </div>
  );
}

// ─── Sheet (bottom modal) ────────────────────────────────────────────────────
function LkrSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(32,33,36,0.45)',
        animation: 'lkrFade 200ms cubic-bezier(0.2,0,0,1)',
      }} />
      <div style={{
        position: 'relative', background: '#fff', borderRadius: '16px 16px 0 0',
        paddingBottom: 28, boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
        animation: 'lkrSlideUp 280ms cubic-bezier(0.2,0,0,1)',
        fontFamily: FONT_TEXT,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
          <div style={{ width: 36, height: 4, background: GREY_300, borderRadius: 2 }} />
        </div>
        {title && (
          <div style={{
            padding: '10px 20px 12px', borderBottom: `1px solid ${HAIRLINE}`,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{
              flex: 1, fontFamily: FONT_BRAND, fontSize: 17, fontWeight: 500,
              color: GREY_900,
            }}>{title}</div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', color: BLUE,
              fontFamily: FONT_TEXT, fontSize: 15, fontWeight: 500, cursor: 'pointer',
            }}>Done</button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

// keyframes
const _kf = document.createElement('style');
_kf.textContent = `
  @keyframes lkrSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes lkrFade { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(_kf);

// ─── Button ──────────────────────────────────────────────────────────────────
function LkrButton({ children, variant = 'filled', onClick, icon, full }) {
  const styles = {
    filled:   { background: BLUE, color: '#fff', border: 'none' },
    tonal:    { background: BLUE_100, color: BLUE_800, border: 'none' },
    outlined: { background: 'transparent', color: BLUE, border: `1px solid ${GREY_300}` },
    text:     { background: 'transparent', color: BLUE, border: 'none' },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], borderRadius: 20, height: 40, padding: '0 18px',
      fontFamily: FONT_BRAND, fontWeight: 500, fontSize: 14, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: full ? '100%' : undefined, letterSpacing: '0.005em',
    }}>
      {icon && <LkrIcon name={icon} size={18} />}
      {children}
    </button>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function LkrEmptyState({ icon = 'inbox', title, body }) {
  return (
    <div style={{
      padding: '40px 32px', textAlign: 'center', color: GREY_700,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      fontFamily: FONT_TEXT,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: GREY_100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: GREY_600,
      }}>
        <LkrIcon name={icon} size={28} />
      </div>
      <div style={{
        fontFamily: FONT_BRAND, fontSize: 17, fontWeight: 500, color: GREY_900,
        marginTop: 4,
      }}>{title}</div>
      <div style={{ fontSize: 14, color: GREY_600, maxWidth: 280, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function LkrAvatar({ initials, color = '#1A73E8', size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      color: '#fff', fontFamily: FONT_BRAND, fontWeight: 500,
      fontSize: size * 0.42, display: 'flex',
      alignItems: 'center', justifyContent: 'center', letterSpacing: 0,
    }}>{initials}</div>
  );
}

Object.assign(window, {
  LkrIcon, LkrTopNav, LkrLargeTitle, LkrSearch, LkrTabBar,
  LkrSection, LkrListGroup, LkrRow, LkrContentCard, LkrChip, LkrChipRow,
  LkrKpi, LkrSparkline, LkrBarChart, LkrDashboardTile, LkrSheet,
  LkrButton, LkrEmptyState, LkrAvatar,
  LKR_TOKENS: { BLUE, BLUE_50, BLUE_100, BLUE_800, GREY_50, GREY_100, GREY_200, GREY_300,
                GREY_500, GREY_600, GREY_700, GREY_900, HAIRLINE, FONT_BRAND, FONT_TEXT },
});
