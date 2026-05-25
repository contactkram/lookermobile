// LookScreen.jsx — single-visualization view
function LookScreen({ look, onBack, favorites, onToggleFavorite, onShowMenu }) {
  const t = window.LKR_TOKENS;
  const { LkrTopNav, LkrIcon, LkrSparkline } = window;
  const isFav = favorites.has(look.id);

  // sample data — a line viz over 12 months
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const values = [120, 142, 158, 175, 168, 198, 210, 232, 251, 248, 282, 318];

  return (
    <div style={{ background: t.GREY_50, minHeight: '100%' }}>
      <LkrTopNav
        title={look.title || 'Look'}
        onBack={onBack}
        right={
          <div style={{ display: 'flex' }}>
            <button onClick={() => onToggleFavorite(look.id)} style={{
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

      <div style={{
        background: '#fff', borderBottom: `1px solid ${t.HAIRLINE}`,
        padding: '16px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{
          fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 22,
          letterSpacing: '-0.3px', color: t.GREY_900,
        }}>{look.title}</div>
        <div style={{ fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_600 }}>
          Net new logos · last 12 months · refreshed 1 hour ago
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <div style={{
          background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 12,
          padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div>
            <div style={{
              fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 36, color: t.GREY_900,
              letterSpacing: '-1px', lineHeight: 1, fontFeatureSettings: '"tnum"',
            }}>318</div>
            <div style={{
              fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 13, color: '#1E8E3E',
              marginTop: 4,
            }}>▲ +12.8% vs prior month</div>
          </div>
          <div style={{ position: 'relative', height: 180 }}>
            <LkrSparkline values={values} height={180} />
            {/* x-axis */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 6, fontFamily: t.FONT_TEXT, fontSize: 10, color: t.GREY_600,
            }}>
              {months.map((m, i) => <div key={i} style={{ flex: 1, textAlign: 'center' }}>{m}</div>)}
            </div>
          </div>
          <div style={{
            display: 'flex', gap: 12, paddingTop: 12, borderTop: `1px solid ${t.HAIRLINE}`,
          }}>
            {[
              { l: 'Min', v: '120' },
              { l: 'Avg', v: '209' },
              { l: 'Max', v: '318' },
            ].map((s) => (
              <div key={s.l} style={{ flex: 1 }}>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontSize: 11, color: t.GREY_700,
                  textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500,
                }}>{s.l}</div>
                <div style={{
                  fontFamily: t.FONT_BRAND, fontWeight: 500, fontSize: 18,
                  color: t.GREY_900, fontFeatureSettings: '"tnum"',
                }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        padding: '6px 16px 24px', fontFamily: t.FONT_TEXT, fontSize: 12,
        color: t.GREY_600, textAlign: 'center',
      }}>
        Rotate device for landscape view
      </div>
    </div>
  );
}

window.LookScreen = LookScreen;
