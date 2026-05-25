// DashboardScreen.jsx — the marquee view: a dashboard with KPI + chart tiles
// Mirrors Looker mobile docs: vertical stack of tiles, filters at top, 3-dot menu

function DashboardScreen({ dashboard, onBack, favorites, onToggleFavorite, onShowMenu, onShowFilters }) {
  const t = window.LKR_TOKENS;
  const { LkrTopNav, LkrIcon, LkrDashboardTile, LkrKpi, LkrSparkline, LkrBarChart, LkrChip } = window;

  const isFav = favorites.has(dashboard.id);
  const filters = dashboard.filters || [
    { id: 'date',   label: 'Last 90 days', selected: true },
    { id: 'region', label: 'Region: All',  selected: false },
    { id: 'channel', label: 'Channel: All', selected: false },
  ];

  return (
    <div style={{ background: t.GREY_50, minHeight: '100%' }}>
      <LkrTopNav
        title={dashboard.title || 'Dashboard'}
        onBack={onBack}
        right={
          <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            <button onClick={() => onToggleFavorite(dashboard.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 6, color: isFav ? t.BLUE : t.GREY_700,
            }}>
              <LkrIcon name="star" size={22} fill={isFav ? 1 : 0} />
            </button>
            <button onClick={onShowMenu} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 6, color: t.GREY_700,
            }}>
              <LkrIcon name="more_vert" size={22} />
            </button>
          </div>
        }
      />

      {/* filter bar */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        background: '#fff', borderBottom: `1px solid ${t.HAIRLINE}`,
        overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        <button onClick={onShowFilters} style={{
          background: 'transparent', border: `1px solid ${t.GREY_300}`,
          borderRadius: 999, padding: '6px 10px', display: 'inline-flex',
          alignItems: 'center', gap: 4, color: t.GREY_700, cursor: 'pointer',
          fontFamily: t.FONT_TEXT, fontSize: 13, fontWeight: 500, flex: '0 0 auto',
        }}>
          <LkrIcon name="tune" size={16} />
        </button>
        {filters.map((f) => (
          <LkrChip key={f.id} selected={f.selected} onClick={onShowFilters}>{f.label}</LkrChip>
        ))}
      </div>

      {/* tiles */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* KPI row tile */}
        <LkrDashboardTile title="Headline" footer="Updated 12 min ago">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, rowGap: 14,
          }}>
            <LkrKpi label="Revenue"  value="$1.24M" delta="+12.4%" deltaKind="pos" sub="vs LW" />
            <LkrKpi label="Pipeline" value="$8.92M" delta="−3.1%"  deltaKind="neg" sub="vs LW" />
            <LkrKpi label="Win rate" value="28.6%"  delta="+1.2pp" deltaKind="pos" sub="" />
            <LkrKpi label="ACV"      value="$42.1K" delta="+5.7%"  deltaKind="pos" sub="vs LW" />
          </div>
        </LkrDashboardTile>

        {/* Trend tile */}
        <LkrDashboardTile title="Revenue trend" footer="$ in thousands · daily">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span style={{
              fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 24, color: t.GREY_900,
              letterSpacing: '-0.4px', fontFeatureSettings: '"tnum"',
            }}>$1,238</span>
            <span style={{ fontFamily: t.FONT_BRAND, fontSize: 12, color: '#1E8E3E', fontWeight: 500 }}>
              ▲ +12.4%
            </span>
          </div>
          <LkrSparkline
            values={[42, 58, 51, 64, 70, 65, 78, 82, 76, 88, 92, 86, 105, 118]}
            height={64}
          />
        </LkrDashboardTile>

        {/* Bar chart tile */}
        <LkrDashboardTile title="Pipeline by region" footer="6 regions · $M">
          <LkrBarChart
            values={[2.4, 1.8, 2.9, 1.2, 0.8, 0.6]}
            labels={['NA', 'EU', 'APAC', 'LATAM', 'ME', 'AF']}
            height={110}
          />
        </LkrDashboardTile>

        {/* Top list tile */}
        <LkrDashboardTile title="Top accounts" footer="By ARR · top 5">
          {[
            { name: 'Acme Corp',         val: '$842K', delta: '+18%' },
            { name: 'Globex',            val: '$612K', delta: '+9%'  },
            { name: 'Initech',           val: '$498K', delta: '+4%'  },
            { name: 'Wayne Enterprises', val: '$421K', delta: '−2%'  },
            { name: 'Stark Industries',  val: '$388K', delta: '+15%' },
          ].map((r, i) => {
            const neg = r.delta.startsWith('−');
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderTop: i ? `1px solid ${t.HAIRLINE}` : 'none',
                fontFamily: t.FONT_TEXT,
              }}>
                <div style={{
                  width: 18, fontFamily: t.FONT_BRAND, fontSize: 11, color: t.GREY_600,
                }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 14, color: t.GREY_900 }}>{r.name}</div>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontSize: 14, color: t.GREY_900,
                  fontFeatureSettings: '"tnum"',
                }}>{r.val}</div>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontSize: 12, width: 42, textAlign: 'right',
                  color: neg ? '#D93025' : '#1E8E3E', fontFeatureSettings: '"tnum"',
                }}>{r.delta}</div>
              </div>
            );
          })}
        </LkrDashboardTile>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
