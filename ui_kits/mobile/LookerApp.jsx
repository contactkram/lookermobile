// LookerApp.jsx — top-level state machine wiring screens, sheets, and tabs
function LookerApp() {
  const t = window.LKR_TOKENS;
  const [tab, setTab] = React.useState('recents');
  const [stack, setStack] = React.useState([]); // navigation stack on top of tab
  const [favorites, setFavorites] = React.useState(new Set(['d1', 'l1', 'd3']));
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);

  const toggleFavorite = (id) => {
    setFavorites((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const push = (screen, item) => {
    setCurrentItem(item);
    setStack((s) => [...s, screen]);
  };
  const pop = () => setStack((s) => s.slice(0, -1));

  const openDashboard = (item) => push('dashboard', item);
  const openLook      = (item) => push('look', item);

  // Tab content
  let tabContent;
  if (tab === 'recents') {
    tabContent = <window.RecentsScreen
      onOpenDashboard={openDashboard} onOpenLook={openLook}
      favorites={favorites} onToggleFavorite={toggleFavorite}
    />;
  } else if (tab === 'favorites') {
    tabContent = <window.FavoritesScreen
      favorites={favorites}
      onOpenDashboard={openDashboard} onOpenLook={openLook}
      onToggleFavorite={toggleFavorite}
    />;
  } else if (tab === 'folders') {
    tabContent = <window.FoldersScreen onOpenDashboard={openDashboard} />;
  } else if (tab === 'boards') {
    tabContent = <window.BoardsScreen />;
  } else if (tab === 'alerts') {
    tabContent = <window.AlertsScreen />;
  }

  // Pushed screen on top
  const top = stack[stack.length - 1];
  let pushedContent = null;
  if (top === 'dashboard') {
    pushedContent = <window.DashboardScreen
      dashboard={currentItem} onBack={pop}
      favorites={favorites} onToggleFavorite={toggleFavorite}
      onShowMenu={() => setMenuOpen(true)}
      onShowFilters={() => setFiltersOpen(true)}
    />;
  } else if (top === 'look') {
    pushedContent = <window.LookScreen
      look={currentItem} onBack={pop}
      favorites={favorites} onToggleFavorite={toggleFavorite}
      onShowMenu={() => setMenuOpen(true)}
    />;
  }

  return (
    <div data-screen-label={`Looker · ${top || tab}`} style={{
      position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
      background: t.GREY_50, overflow: 'hidden',
      paddingTop: 47, /* iOS status bar / dynamic island */
    }}>
      {/* Tab content layer */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {tabContent}
        {/* spacer for nav bar */}
        <div style={{ height: 8 }} />
      </div>

      {/* Bottom tab bar */}
      <window.LkrTabBar active={tab} onChange={(id) => { setStack([]); setTab(id); }} />

      {/* Pushed-screen layer (covers everything) */}
      {pushedContent && (
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0, bottom: 0,
          background: t.GREY_50, zIndex: 10,
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
          animation: 'lkrPushIn 280ms cubic-bezier(0.2, 0, 0, 1)',
        }}>
          {pushedContent}
        </div>
      )}

      {/* Three-dot menu sheet (works for both dashboard + look) */}
      <window.LkrSheet open={menuOpen} onClose={() => setMenuOpen(false)} title={currentItem?.title}>
        <window.LkrRow icon="star"          title={favorites.has(currentItem?.id) ? "Remove from favorites" : "Add to favorites"}
          accessory={null}
          onClick={() => { toggleFavorite(currentItem?.id); setMenuOpen(false); }} />
        <window.LkrRow icon="share"         title="Share"      accessory={null} onClick={() => setMenuOpen(false)} />
        <window.LkrRow icon="link"          title="Copy link"  accessory={null} onClick={() => setMenuOpen(false)} />
        <window.LkrRow icon="notifications" title="Create alert" accessory={null} onClick={() => setMenuOpen(false)} />
        <window.LkrRow icon="info"          title="Get info"   accessory={null} onClick={() => setMenuOpen(false)} />
      </window.LkrSheet>

      {/* Filter sheet */}
      <window.LkrSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Date range',    value: 'Last 90 days',  options: ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'] },
            { label: 'Region',        value: 'All',           options: ['All', 'NA', 'EU', 'APAC', 'LATAM'] },
            { label: 'Channel',       value: 'All',           options: ['All', 'Direct', 'Partner', 'Self-serve'] },
          ].map((f) => (
            <div key={f.label}>
              <div style={{
                fontFamily: t.FONT_BRAND, fontSize: 12, fontWeight: 500, color: t.GREY_700,
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
              }}>{f.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {f.options.map((o) => (
                  <window.LkrChip key={o} selected={o === f.value}>{o}</window.LkrChip>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <window.LkrButton variant="outlined" onClick={() => setFiltersOpen(false)}>Reset</window.LkrButton>
            <div style={{ flex: 1 }}>
              <window.LkrButton variant="filled" full onClick={() => setFiltersOpen(false)}>Apply filters</window.LkrButton>
            </div>
          </div>
        </div>
      </window.LkrSheet>
    </div>
  );
}

window.LookerApp = LookerApp;

// keyframes
const _kf2 = document.createElement('style');
_kf2.textContent = `
  @keyframes lkrPushIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;
document.head.appendChild(_kf2);
