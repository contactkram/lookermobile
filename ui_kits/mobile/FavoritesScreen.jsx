// FavoritesScreen.jsx — second tab, list of favorites
function FavoritesScreen({ favorites, onOpenDashboard, onOpenLook, onToggleFavorite }) {
  const allItems = {
    d1: { id: 'd1', kind: 'dashboard', title: 'Sales overview — Q4',    sub: 'Updated 12 min ago' },
    l1: { id: 'l1', kind: 'look',      title: 'Top accounts by ARR',    sub: 'Updated 1 hr ago' },
    d2: { id: 'd2', kind: 'dashboard', title: 'Marketing channel mix',  sub: 'Updated 3 hrs ago' },
    d3: { id: 'd3', kind: 'dashboard', title: 'Pipeline by region',     sub: 'Updated yesterday' },
    l2: { id: 'l2', kind: 'look',      title: 'Net new logos by month', sub: 'Updated 2 days ago' },
    d4: { id: 'd4', kind: 'dashboard', title: 'Onboarding funnel',      sub: 'Updated 4 days ago' },
  };

  const items = [...favorites].map(id => allItems[id]).filter(Boolean);

  const onOpen = (item) => {
    if (item.kind === 'dashboard') onOpenDashboard(item);
    else if (item.kind === 'look') onOpenLook(item);
  };

  return (
    <div style={{ paddingBottom: 16 }}>
      <window.LkrLargeTitle
        title="Favorites"
        right={<window.LkrAvatar initials="HW" color="#7B61FF" size={32} />}
      />
      <window.LkrChipRow>
        <window.LkrChip selected icon="sort">Recently favorited</window.LkrChip>
        <window.LkrChip icon="filter_list">All types</window.LkrChip>
      </window.LkrChipRow>

      {items.length === 0 ? (
        <window.LkrEmptyState
          icon="star"
          title="Nothing here yet"
          body="Tap the star on any dashboard or Look to keep it handy on this screen."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
          {items.map((item) => (
            <window.LkrContentCard
              key={item.id}
              kind={item.kind}
              title={item.title}
              sub={item.sub}
              onClick={() => onOpen(item)}
              favorited
              onFavorite={() => onToggleFavorite(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

window.FavoritesScreen = FavoritesScreen;
