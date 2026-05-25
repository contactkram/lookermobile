// BoardsScreen.jsx — boards tab (collections of dashboards / Looks)
function BoardsScreen() {
  const boards = [
    { id: 'b1', title: 'Exec weekly',         count: 14, color: '#1A73E8', author: 'Hanna Wei' },
    { id: 'b2', title: 'Marketing pulse',     count: 22, color: '#34A853', author: 'Priya Shah' },
    { id: 'b3', title: 'Customer health',     count:  9, color: '#EA4335', author: 'Diego Reyes' },
    { id: 'b4', title: 'Finance — quarterly', count: 11, color: '#FBBC04', author: 'Aamir Khan' },
  ];
  return (
    <div style={{ paddingBottom: 16 }}>
      <window.LkrLargeTitle title="Boards" subtitle="Curated collections you follow" />
      <window.LkrChipRow>
        <window.LkrChip selected>Followed</window.LkrChip>
        <window.LkrChip>All boards</window.LkrChip>
        <window.LkrChip>Created by me</window.LkrChip>
      </window.LkrChipRow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
        {boards.map((b) => (
          <div key={b.id} style={{
            background: '#fff', border: `1px solid ${window.LKR_TOKENS.HAIRLINE}`,
            borderRadius: 12, padding: 12, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 8, minHeight: 124,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: b.color + '22',
              color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <window.LkrIcon name="bookmarks" size={18} fill={1} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: window.LKR_TOKENS.FONT_BRAND, fontSize: 15, fontWeight: 500,
                color: window.LKR_TOKENS.GREY_900, lineHeight: 1.25,
              }}>{b.title}</div>
              <div style={{
                fontFamily: window.LKR_TOKENS.FONT_TEXT, fontSize: 12,
                color: window.LKR_TOKENS.GREY_600, marginTop: 2,
              }}>{b.count} items</div>
            </div>
            <div style={{
              fontFamily: window.LKR_TOKENS.FONT_TEXT, fontSize: 11,
              color: window.LKR_TOKENS.GREY_600,
            }}>by {b.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.BoardsScreen = BoardsScreen;
