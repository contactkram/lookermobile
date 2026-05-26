// SettingsScreen.jsx — iOS-style settings screen
// Accessed via tapping the avatar / settings icon on the Ask screen.

function SettingsScreen({ prefs, onBack, onResetPrefs, accent }) {
  const t = window.LKR_TOKENS;
  const { LkrTopNav, LkrIcon, LkrRow, LkrListGroup, LkrAvatar } = window;

  // Local UI state for toggles — purely visual, no persistence needed here
  const [biometric,   setBiometric]   = React.useState(true);
  const [pushAlerts,  setPushAlerts]  = React.useState(true);
  const [analytics,   setAnalytics]   = React.useState(false);
  const [darkMode,    setDarkMode]    = React.useState(false);
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  const personality = prefs?.personality || 'staid';
  const role        = prefs?.role        || 'consumer';

  return (
    <div data-screen-label="Settings" style={{
      background: t.GREY_50, minHeight: '100%', paddingBottom: 32,
    }}>
      <LkrTopNav title="Settings" onBack={onBack}
        right={<span style={{
          color: accent, fontFamily: t.FONT_BRAND, fontSize: 15, fontWeight: 500,
          padding: '6px 10px', cursor: 'pointer',
        }} onClick={onBack}>Done</span>}
      />

      {/* Account card */}
      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{
          background: '#fff', border: `1px solid ${t.HAIRLINE}`, borderRadius: 14,
          padding: '14px 14px 14px', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <LkrAvatar initials="HW" color="#7B61FF" size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: t.FONT_BRAND, fontSize: 17, fontWeight: 500, color: t.GREY_900,
              letterSpacing: '-0.1px',
            }}>Hanna Wei</div>
            <div style={{
              fontFamily: t.FONT_TEXT, fontSize: 13, color: t.GREY_600,
              marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>hanna.wei@acme.com</div>
            <div style={{
              fontFamily: t.FONT_TEXT, fontSize: 11, color: t.GREY_600, marginTop: 4,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 999, background: t.GREY_100,
            }}>
              <LkrIcon name="business" size={12} /> Acme · production
            </div>
          </div>
          <LkrIcon name="chevron_right" size={18} color={t.GREY_500} />
        </div>
      </div>

      <SettingsSection title="Workspace">
        <LkrListGroup>
          <LkrRow icon="domain"        title="Looker instance" sub="acme.cloud.looker.com" onClick={() => {}} />
          <LkrRow icon="switch_account" title="Switch account"  onClick={() => {}} />
          <LkrRow icon="logout"        title="Sign out"        accessory={null} onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="You">
        <LkrListGroup>
          <LkrRow icon="badge"   title="Your role" sub={roleLabel(role)} onClick={onResetPrefs} />
          <LkrRow icon="mood"    title="Tone of voice" sub={personalityLabel(personality)} onClick={onResetPrefs} />
          <LkrRow icon="auto_awesome" title="Personalize home" sub="Re-run first-run flow" onClick={onResetPrefs} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <LkrListGroup>
          <ToggleRow icon="fingerprint" title="Biometric sign-in"
            value={biometric} onChange={setBiometric} accent={accent} />
          <ToggleRow icon="notifications" title="Push alerts"
            sub="Triggered tiles, scheduled digests"
            value={pushAlerts} onChange={setPushAlerts} accent={accent} />
          <LkrRow icon="schedule" title="Alert quiet hours" sub="10pm – 7am" onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <LkrListGroup>
          <ToggleRow icon="dark_mode" title="Dark mode"
            sub="Match system"
            value={darkMode} onChange={setDarkMode} accent={accent} />
          <LkrRow icon="format_size"  title="Text size"    sub="Default"      onClick={() => {}} />
          <LkrRow icon="palette"      title="Chart palette" sub="Looker Classic" onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="Data">
        <LkrListGroup>
          <ToggleRow icon="autorenew" title="Auto-refresh dashboards"
            sub="When in foreground" value={autoRefresh}
            onChange={setAutoRefresh} accent={accent} />
          <LkrRow icon="cached"      title="Clear cache"   sub="48.2 MB"     onClick={() => {}} />
          <LkrRow icon="cloud_off"   title="Offline mode"  sub="Off"         onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="Privacy">
        <LkrListGroup>
          <ToggleRow icon="insights" title="Share usage analytics"
            value={analytics} onChange={setAnalytics} accent={accent} />
          <LkrRow icon="policy"     title="Privacy policy"  onClick={() => {}} />
          <LkrRow icon="description" title="Terms of service" onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <SettingsSection title="Support">
        <LkrListGroup>
          <LkrRow icon="help"      title="Help center"    onClick={() => {}} />
          <LkrRow icon="bug_report" title="Report a problem" onClick={() => {}} />
          <LkrRow icon="info"      title="About"          sub="Looker iOS · 2026.5.1 (build 4218)" onClick={() => {}} />
        </LkrListGroup>
      </SettingsSection>

      <div style={{
        textAlign: 'center', padding: '24px 16px 8px',
        fontFamily: t.FONT_TEXT, fontSize: 11, color: t.GREY_600,
      }}>
        Looker · Google Cloud
      </div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function SettingsSection({ title, children }) {
  const t = window.LKR_TOKENS;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        padding: '4px 20px 8px', fontFamily: t.FONT_BRAND, fontSize: 12,
        fontWeight: 500, color: t.GREY_700, textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>{title}</div>
      <div style={{ padding: '0 16px' }}>{children}</div>
    </div>
  );
}

// ─── Toggle row — iOS-style switch inside a LkrRow shell ─────────────────────
function ToggleRow({ icon, title, sub, value, onChange, accent }) {
  const t = window.LKR_TOKENS;
  return (
    <window.LkrRow
      icon={icon}
      title={title}
      sub={sub}
      onClick={() => onChange(!value)}
      accessory={<IOSSwitch value={value} accent={accent} />}
    />
  );
}

function IOSSwitch({ value, accent }) {
  return (
    <div style={{
      width: 44, height: 26, borderRadius: 999, padding: 2, boxSizing: 'border-box',
      background: value ? accent : '#E8EAED',
      transition: 'background 200ms cubic-bezier(0.2,0,0,1)',
      display: 'flex', alignItems: 'center',
      flex: '0 0 44px',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18), 0 1px 1px rgba(0,0,0,0.12)',
        transform: `translateX(${value ? 18 : 0}px)`,
        transition: 'transform 200ms cubic-bezier(0.2,0,0,1)',
      }} />
    </div>
  );
}

function roleLabel(r) {
  return ({
    consumer:  'Data consumer',
    analyst:   'Data analyst',
    exec:      'Executive',
    operator:  'Operator',
  })[r] || r || 'Data consumer';
}
function personalityLabel(p) {
  return ({
    staid:    'Professional',
    friendly: 'Friendly',
    casual:   'Casual',
    playful:  'Playful',
  })[p] || p || 'Professional';
}

window.SettingsScreen = SettingsScreen;
