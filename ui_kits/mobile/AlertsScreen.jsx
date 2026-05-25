// AlertsScreen.jsx — alerts tab (push notifications on dashboard tile thresholds)
function AlertsScreen() {
  const t = window.LKR_TOKENS;
  const alerts = [
    { id: 'a1', title: 'Pipeline by region',  msg: 'NA pipeline dropped below $2M',     when: '2 min ago',  kind: 'neg' },
    { id: 'a2', title: 'Sales overview — Q4', msg: 'Revenue passed $1.2M target',       when: '1 hr ago',   kind: 'pos' },
    { id: 'a3', title: 'Onboarding funnel',   msg: 'Activation rate fell below 45%',    when: 'yesterday',  kind: 'neg' },
    { id: 'a4', title: 'Net new logos',       msg: 'Hit monthly goal of 300 logos',      when: '2 days ago', kind: 'pos' },
  ];
  return (
    <div style={{ paddingBottom: 16 }}>
      <window.LkrLargeTitle title="Alerts" subtitle="Triggers from dashboard tiles you follow" />
      <window.LkrChipRow>
        <window.LkrChip selected>All</window.LkrChip>
        <window.LkrChip>Unread</window.LkrChip>
        <window.LkrChip>This week</window.LkrChip>
      </window.LkrChipRow>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.map((a) => (
          <div key={a.id} style={{
            background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 12,
            padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flex: '0 0 32px',
              background: a.kind === 'pos' ? '#E6F4EA' : '#FCE8E6',
              color: a.kind === 'pos' ? '#1E8E3E' : '#D93025',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <window.LkrIcon name={a.kind === 'pos' ? 'trending_up' : 'trending_down'} size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: t.FONT_BRAND, fontSize: 14, fontWeight: 500, color: t.GREY_900,
              }}>{a.title}</div>
              <div style={{
                fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_700, marginTop: 2,
              }}>{a.msg}</div>
              <div style={{
                fontFamily: t.FONT_TEXT, fontSize: 11, color: t.GREY_600, marginTop: 4,
              }}>{a.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.AlertsScreen = AlertsScreen;
