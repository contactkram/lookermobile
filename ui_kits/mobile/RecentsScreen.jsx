// RecentsScreen.jsx — default landing screen of Looker mobile app.
// Mirrors the docs: Recently viewed list of dashboards, Looks, boards.

function RecentsScreen({ onOpenDashboard, onOpenLook, onOpenSearch, favorites, onToggleFavorite }) {
  const { GREY_700, FONT_BRAND, FONT_TEXT, BLUE } = window.LKR_TOKENS;
  const [query, setQuery] = React.useState('');

  const items = [
    { id: 'd1', kind: 'dashboard', title: 'Sales overview — Q4',     sub: 'Viewed 12 minutes ago · Hanna Wei' },
    { id: 'l1', kind: 'look',      title: 'Top accounts by ARR',     sub: 'Viewed 1 hour ago' },
    { id: 'd2', kind: 'dashboard', title: 'Marketing channel mix',   sub: 'Viewed 3 hours ago · Aamir Khan' },
    { id: 'b1', kind: 'board',     title: 'Exec weekly',             sub: 'Board · 14 items · yesterday' },
    { id: 'd3', kind: 'dashboard', title: 'Pipeline by region',      sub: 'Viewed yesterday · Hanna Wei' },
    { id: 'l2', kind: 'look',      title: 'Net new logos by month',  sub: 'Viewed 2 days ago' },
    { id: 'd4', kind: 'dashboard', title: 'Onboarding funnel',       sub: 'Viewed 4 days ago · Priya Shah' },
  ];

  const filtered = query
    ? items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
    : items;

  const onOpen = (item) => {
    if (item.kind === 'dashboard') onOpenDashboard(item);
    else if (item.kind === 'look') onOpenLook(item);
  };

  return (
    <div style={{ paddingBottom: 16 }}>
      <window.LkrLargeTitle
        title="Recently viewed"
        right={<window.LkrAvatar initials="HW" color="#7B61FF" size={32} />}
      />
      <window.LkrSearch
        placeholder="Search dashboards, Looks, boards"
        value={query}
        onChange={setQuery}
      />
      <window.LkrChipRow>
        <window.LkrChip selected icon="sort">Last opened by me</window.LkrChip>
        <window.LkrChip icon="filter_list">All types</window.LkrChip>
        <window.LkrChip icon="group">Anyone</window.LkrChip>
      </window.LkrChipRow>

      <div style={{ padding: '0 0 16px' }}>
        {filtered.length === 0 ? (
          <window.LkrEmptyState
            icon="search_off"
            title="No matches"
            body={`Nothing matches "${query}". Try a different term, or browse Folders.`}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
            {filtered.map((item) => (
              <window.LkrContentCard
                key={item.id}
                kind={item.kind}
                title={item.title}
                sub={item.sub}
                onClick={() => onOpen(item)}
                favorited={favorites.has(item.id)}
                onFavorite={() => onToggleFavorite(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.RecentsScreen = RecentsScreen;
