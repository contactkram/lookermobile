// FoldersScreen.jsx — third tab, hierarchical folder browser
function FoldersScreen({ onOpenDashboard }) {
  return (
    <div style={{ paddingBottom: 16 }}>
      <window.LkrLargeTitle title="Folders" />

      <window.LkrSection title="Personal">
        <window.LkrListGroup>
          <window.LkrRow icon="folder_shared" title="My folder" sub="12 items" onClick={() => {}} />
          <window.LkrRow icon="schedule" title="Drafts"          sub="3 items"  onClick={() => {}} />
        </window.LkrListGroup>
      </window.LkrSection>

      <window.LkrSection title="Shared with me" action="See all">
        <window.LkrListGroup>
          <window.LkrRow icon="folder" title="Revenue & Sales"  sub="28 items · Aamir Khan" onClick={() => {}} />
          <window.LkrRow icon="folder" title="Marketing"        sub="46 items · Priya Shah" onClick={() => {}} />
          <window.LkrRow icon="folder" title="Product analytics" sub="18 items · Hanna Wei"  onClick={() => {}} />
          <window.LkrRow icon="folder" title="Customer success"  sub="9 items · Diego Reyes" onClick={() => {}} />
        </window.LkrListGroup>
      </window.LkrSection>

      <window.LkrSection title="LookML dashboards">
        <window.LkrListGroup>
          <window.LkrRow icon="code" title="ecommerce" sub="LookML · 7 dashboards" onClick={() => {}} />
          <window.LkrRow icon="code" title="finance"   sub="LookML · 4 dashboards" onClick={() => {}} />
        </window.LkrListGroup>
      </window.LkrSection>
    </div>
  );
}

window.FoldersScreen = FoldersScreen;
