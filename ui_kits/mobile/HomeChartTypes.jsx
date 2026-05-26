// HomeChartTypes.jsx — chart kinds + real-looking data + a `pickChart` registry.
// Each chart is a small, mobile-tile-sized Recharts (or custom) visualization.
// All charts accept onDrill({label, value, ...extra}) so data-point taps bubble up.

(function () {
  const R = window.Recharts;
  if (!R) { console.error('Recharts not loaded'); return; }
  const {
    ResponsiveContainer, LineChart, Line, AreaChart, Area,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
    PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis,
    Treemap, Sankey, ComposedChart,
  } = R;

  const FONT = '"Google Sans Text","Roboto",sans-serif';
  const AXIS_TICK = { fontSize: 9, fill: '#80868B', fontFamily: FONT };
  const YAXIS_TICK = { fontSize: 9, fill: '#5F6368', fontFamily: FONT };

  // ── Palette helpers ───────────────────────────────────────────────────
  // Build a coordinated mini-palette around the accent for categorical charts.
  function paletteFrom(accent) {
    return [accent, '#7B61FF', '#34A853', '#FBBC04', '#EA4335', '#46BDC6', '#FF6D01', '#9AA0A6'];
  }
  function fadeAlpha(hex, a) {
    // Cheap hex → rgba (accent always passed as #RRGGBB).
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ── Seed datasets ─────────────────────────────────────────────────────
  const REVENUE_DAILY = [
    32,38,41,35,28,22,24, 36,42,45,40,32,26,28,
    40,46,50,44,38,30,32, 46,52,56,49,42,34,36, 50,58,
  ].map((v, i) => ({ d: `Day ${i+1}`, v }));

  const PIPELINE = [
    { region: 'NA',    v: 3.24 },
    { region: 'EU',    v: 2.18 },
    { region: 'APAC',  v: 1.92 },
    { region: 'LATAM', v: 0.84 },
    { region: 'ME',    v: 0.42 },
    { region: 'AF',    v: 0.32 },
  ];

  const WIN_RATE = [
    24.1, 23.8, 25.0, 26.2, 25.4, 27.1,
    26.8, 27.6, 27.2, 28.1, 28.4, 28.6,
  ].map((v, i) => ({ d: `W${i+1}`, v }));

  const ACTIVATION = [
    { stage: 'Signup',    v: 100 },
    { stage: 'Verified',  v: 87 },
    { stage: 'Onboarded', v: 71 },
    { stage: 'Activated', v: 49 },
  ];

  const CHANNEL_MIX = [
    { name: 'Direct',     v: 42 },
    { name: 'Partner',    v: 28 },
    { name: 'Self-serve', v: 18 },
    { name: 'Marketing',  v: 12 },
  ];

  const TOP_ACCOUNTS = [
    { name: 'Acme',    v: 842 },
    { name: 'Globex',  v: 612 },
    { name: 'Initech', v: 498 },
    { name: 'Wayne',   v: 421 },
    { name: 'Stark',   v: 388 },
  ];

  // New (modern) datasets ─────────────────────────────────────────────────

  // Composed: revenue vs forecast — bars + line
  const REV_VS_FORECAST = [
    { m: 'Jul', actual: 820,  forecast: 800 },
    { m: 'Aug', actual: 892,  forecast: 860 },
    { m: 'Sep', actual: 941,  forecast: 920 },
    { m: 'Oct', actual: 1020, forecast: 980 },
    { m: 'Nov', actual: 1108, forecast: 1060 },
    { m: 'Dec', actual: 1240, forecast: 1150 },
  ];

  // Stacked: revenue by segment, weekly, $K
  const STACKED_SEGMENTS = [
    { w: 'W1', Enterprise: 410, MidMarket: 220, SMB: 90  },
    { w: 'W2', Enterprise: 442, MidMarket: 240, SMB: 95  },
    { w: 'W3', Enterprise: 478, MidMarket: 218, SMB: 102 },
    { w: 'W4', Enterprise: 512, MidMarket: 252, SMB: 108 },
    { w: 'W5', Enterprise: 540, MidMarket: 268, SMB: 114 },
    { w: 'W6', Enterprise: 580, MidMarket: 282, SMB: 122 },
  ];

  // Scatter: top customers — ARR vs renewal probability
  const SCATTER_CUSTOMERS = [
    { name: 'Acme',          arr: 842, prob: 92, segment: 'Enterprise' },
    { name: 'Globex',        arr: 612, prob: 78, segment: 'Enterprise' },
    { name: 'Initech',       arr: 498, prob: 64, segment: 'Mid-market' },
    { name: 'Wayne',         arr: 421, prob: 88, segment: 'Enterprise' },
    { name: 'Stark',         arr: 388, prob: 71, segment: 'Mid-market' },
    { name: 'Soylent',       arr: 312, prob: 42, segment: 'Mid-market' },
    { name: 'Cyberdyne',     arr: 268, prob: 81, segment: 'Mid-market' },
    { name: 'Umbrella',      arr: 224, prob: 58, segment: 'SMB' },
    { name: 'Pied Piper',    arr: 188, prob: 36, segment: 'SMB' },
    { name: 'Tyrell',        arr: 152, prob: 84, segment: 'SMB' },
    { name: 'Aperture',      arr: 144, prob: 70, segment: 'SMB' },
    { name: 'Massive Dyn.',  arr: 132, prob: 28, segment: 'SMB' },
  ];

  // Radial bar: 3 quarterly goals (% of target)
  const RADIAL_GOALS = [
    { name: 'Revenue',  v: 108, fill: '#1A73E8' },
    { name: 'Logos',    v: 92,  fill: '#34A853' },
    { name: 'Activation', v: 81, fill: '#FBBC04' },
  ];

  // Treemap: revenue share by product line
  const TREEMAP_PRODUCTS = [
    { name: 'Analytics',    size: 4200 },
    { name: 'Embed',        size: 2100 },
    { name: 'Studio Pro',   size: 1600 },
    { name: 'Connectors',   size: 980  },
    { name: 'Marketplace',  size: 540  },
    { name: 'Other',        size: 320  },
  ];

  // Sankey: lead → stage → outcome
  const SANKEY = {
    nodes: [
      { name: 'Inbound' },{ name: 'Outbound' },{ name: 'Partner' },
      { name: 'Qualified' },{ name: 'Demo' },
      { name: 'Closed Won' },{ name: 'Closed Lost' },
    ],
    links: [
      { source: 0, target: 3, value: 220 },
      { source: 1, target: 3, value: 140 },
      { source: 2, target: 3, value: 80  },
      { source: 3, target: 4, value: 300 },
      { source: 4, target: 5, value: 140 },
      { source: 4, target: 6, value: 160 },
    ],
  };

  // Radar: feature usage vs benchmark
  const RADAR = [
    { axis: 'Dashboards', you: 92, peers: 70 },
    { axis: 'Looks',      you: 78, peers: 62 },
    { axis: 'Alerts',     you: 65, peers: 48 },
    { axis: 'Embed',      you: 41, peers: 56 },
    { axis: 'Studio Pro', you: 53, peers: 38 },
    { axis: 'API',        you: 84, peers: 52 },
  ];

  // Heatmap: hour-of-day × day-of-week login activity (0-100)
  const HEATMAP = (() => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const cells = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        const workday = d < 5;
        const workhour = h >= 8 && h <= 18;
        let v;
        if (workday && workhour) v = 40 + Math.round(45 * Math.sin((h - 8) / 11 * Math.PI));
        else if (workday) v = 6 + Math.round(Math.random() * 14);
        else if (h >= 10 && h <= 21) v = 12 + Math.round(Math.random() * 22);
        else v = 2 + Math.round(Math.random() * 8);
        cells.push({ d, h, day: days[d], v });
      }
    }
    return cells;
  })();

  // Gauge: NPS (-100..100) — current 42
  const GAUGE_NPS = { value: 42, prev: 36, min: -100, max: 100 };

  // ── CARD REGISTRY ─────────────────────────────────────────────────────
  const CARDS = [
    { id: 'rev-daily',     kind: 'dashboard', sourceId: 'd1', sourceTitle: 'Sales overview — Q4',
      title: 'Daily revenue',   sub: 'last 30 days', kpi: '$58K',  delta: '+16.0%', deltaKind: 'pos',
      chart: 'area-spark',      data: REVENUE_DAILY, views: 142, refreshedMin: 2 },
    { id: 'pipeline-region', kind: 'dashboard', sourceId: 'd3', sourceTitle: 'Pipeline by region',
      title: 'Pipeline by region', sub: 'this quarter', kpi: '$8.92M', delta: '−3.1%', deltaKind: 'neg',
      chart: 'bar-region',      data: PIPELINE, views: 98, refreshedMin: 5 },
    { id: 'win-rate',      kind: 'look',      sourceId: 'l3', sourceTitle: 'Win rate trend',
      title: 'Win rate',        sub: 'weekly · 12 wk', kpi: '28.6%', delta: '+1.2pp', deltaKind: 'pos',
      chart: 'line-spark',      data: WIN_RATE, views: 76, refreshedMin: 8 },
    { id: 'channel-mix',   kind: 'dashboard', sourceId: 'd2', sourceTitle: 'Marketing channel mix',
      title: 'Channel mix',     sub: 'this month',  kpi: 'Direct 42%', delta: '+2pp', deltaKind: 'pos',
      chart: 'donut',           data: CHANNEL_MIX, views: 64, refreshedMin: 12 },
    { id: 'activation',    kind: 'dashboard', sourceId: 'd4', sourceTitle: 'Onboarding funnel',
      title: 'Activation funnel', sub: 'last 30 days', kpi: '49%', delta: '−4pp', deltaKind: 'neg',
      chart: 'funnel-bars',     data: ACTIVATION, views: 58, refreshedMin: 18 },
    { id: 'top-accounts',  kind: 'look',      sourceId: 'l1', sourceTitle: 'Top accounts by ARR',
      title: 'Top accounts',    sub: 'by ARR',      kpi: '$842K', delta: 'Acme #1', deltaKind: 'neutral',
      chart: 'hbar-accounts',   data: TOP_ACCOUNTS, views: 41, refreshedMin: 25 },

    // Newer / advanced chart types ───────────────────────────────────────
    { id: 'rev-vs-forecast', kind: 'dashboard', sourceId: 'd1', sourceTitle: 'Sales overview — Q4',
      title: 'Revenue vs forecast', sub: '6 months · $K', kpi: '$1.24M', delta: '+7.8% vs fcst', deltaKind: 'pos',
      chart: 'composed',        data: REV_VS_FORECAST, views: 39, refreshedMin: 6 },
    { id: 'segment-mix',   kind: 'dashboard', sourceId: 'd1', sourceTitle: 'Sales overview — Q4',
      title: 'Revenue by segment', sub: 'weekly · stacked', kpi: '$984K', delta: '+11%', deltaKind: 'pos',
      chart: 'stacked-bars',    data: STACKED_SEGMENTS, views: 36, refreshedMin: 14 },
    { id: 'customer-arr-prob', kind: 'look', sourceId: 'l4', sourceTitle: 'Customers · ARR vs renewal',
      title: 'ARR vs renewal',   sub: 'top 12 customers', kpi: '8 high', delta: '4 at risk', deltaKind: 'neg',
      chart: 'scatter',         data: SCATTER_CUSTOMERS, views: 28, refreshedMin: 30 },
    { id: 'q-goals',       kind: 'dashboard', sourceId: 'd5', sourceTitle: 'Quarterly goal tracker',
      title: 'Goal progress',   sub: 'quarter to date', kpi: '94% avg', delta: 'on track', deltaKind: 'pos',
      chart: 'radial-bar',      data: RADIAL_GOALS, views: 27, refreshedMin: 4 },
    { id: 'product-mix',   kind: 'dashboard', sourceId: 'd6', sourceTitle: 'Product revenue',
      title: 'Revenue by product', sub: 'YTD', kpi: '$9.74M', delta: '+18%', deltaKind: 'pos',
      chart: 'treemap',         data: TREEMAP_PRODUCTS, views: 24, refreshedMin: 11 },
    { id: 'lead-flow',     kind: 'dashboard', sourceId: 'd7', sourceTitle: 'Lead source → outcome',
      title: 'Lead flow',       sub: 'last 30 days', kpi: '440 leads', delta: '47% won', deltaKind: 'pos',
      chart: 'sankey',          data: SANKEY, views: 22, refreshedMin: 9 },
    { id: 'feature-usage', kind: 'look',      sourceId: 'l5', sourceTitle: 'Feature usage vs peers',
      title: 'Usage vs peers',  sub: 'this month', kpi: '6 of 6', delta: 'above avg', deltaKind: 'pos',
      chart: 'radar',           data: RADAR, views: 19, refreshedMin: 22 },
    { id: 'activity-heat', kind: 'dashboard', sourceId: 'd8', sourceTitle: 'User activity heatmap',
      title: 'Activity',        sub: 'logins · day × hour', kpi: '4.8K', delta: '+12%', deltaKind: 'pos',
      chart: 'heatmap',         data: HEATMAP, views: 17, refreshedMin: 3 },
    { id: 'nps-gauge',     kind: 'look',      sourceId: 'l6', sourceTitle: 'NPS — trailing 90d',
      title: 'NPS',             sub: 'last 90 days', kpi: '42', delta: '+6', deltaKind: 'pos',
      chart: 'gauge',           data: GAUGE_NPS, views: 14, refreshedMin: 60 },
  ];

  // ── Chart components — each accepts {data, color, onDrill?} ───────────

  function AreaSpark({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`g-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
                fill={`url(#g-${color.slice(1)})`} isAnimationActive={false}
                activeDot={{
                  r: 4, stroke: '#fff', strokeWidth: 2, fill: color,
                  onClick: (_, e) => {
                    e.stopPropagation();
                    const i = e?.payload?.index ?? 0;
                    onDrill?.({ label: `Day ${i + 1}`, value: `$${data[i]?.v}K`, kind: 'point' });
                  },
                }}
                dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  function LineSpark({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
                dot={false} isAnimationActive={false}
                activeDot={{
                  r: 4, stroke: '#fff', strokeWidth: 2, fill: color,
                  onClick: (_, e) => {
                    e.stopPropagation();
                    const i = e?.payload?.index ?? 0;
                    onDrill?.({ label: `W${i + 1}`, value: `${data[i]?.v}%`, kind: 'point' });
                  },
                }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  function BarRegion({ data, color, onDrill }) {
    const onCell = (entry) => onDrill?.({ label: entry.region, value: `$${entry.v}M`, kind: 'bar' });
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 14, left: 0 }}>
          <XAxis dataKey="region" axisLine={false} tickLine={false} tick={AXIS_TICK} interval={0} />
          <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} isAnimationActive={false}
               onClick={(_, i, e) => { e?.stopPropagation?.(); onCell(data[i]); }} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function HBarAccounts({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 2, right: 6, bottom: 2, left: 6 }}>
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={42} tick={YAXIS_TICK} />
          <XAxis type="number" hide />
          <Bar dataKey="v" radius={[0, 2, 2, 0]} isAnimationActive={false}
               onClick={(_, i, e) => { e?.stopPropagation?.(); onDrill?.({ label: data[i].name, value: `$${data[i].v}K ARR`, kind: 'account' }); }}>
            {data.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={1 - i * 0.13} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function FunnelBars({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 2, right: 6, bottom: 2, left: 6 }}>
          <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} width={64} tick={YAXIS_TICK} />
          <XAxis type="number" hide domain={[0, 100]} />
          <Bar dataKey="v" radius={[0, 3, 3, 0]} isAnimationActive={false}
               onClick={(_, i, e) => { e?.stopPropagation?.(); onDrill?.({ label: data[i].stage, value: `${data[i].v}%`, kind: 'funnel' }); }}>
            {data.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={1 - i * 0.18} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function Donut({ data, color, onDrill }) {
    const palette = paletteFrom(color);
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="v" innerRadius="55%" outerRadius="92%"
               stroke="#fff" strokeWidth={1.5} isAnimationActive={false}
               onClick={(_, i, e) => { e?.stopPropagation?.(); onDrill?.({ label: data[i].name, value: `${data[i].v}%`, kind: 'segment' }); }}>
            {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  function Composed({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 2, bottom: 14, left: 0 }}>
          <XAxis dataKey="m" axisLine={false} tickLine={false} tick={AXIS_TICK} />
          <YAxis hide />
          <Bar dataKey="actual" fill={color} radius={[2, 2, 0, 0]} isAnimationActive={false}
               onClick={(_, i, e) => { e?.stopPropagation?.(); onDrill?.({ label: data[i].m, value: `$${data[i].actual}K actual`, kind: 'bar' }); }} />
          <Line type="monotone" dataKey="forecast" stroke="#5F6368" strokeWidth={1.4}
                strokeDasharray="3 3" dot={false} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  function StackedBars({ data, color, onDrill }) {
    const palette = paletteFrom(color);
    const keys = ['Enterprise', 'MidMarket', 'SMB'];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 2, bottom: 14, left: 0 }}>
          <XAxis dataKey="w" axisLine={false} tickLine={false} tick={AXIS_TICK} interval={0} />
          <YAxis hide />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="s" fill={palette[i]} isAnimationActive={false}
                 radius={i === keys.length - 1 ? [2, 2, 0, 0] : 0}
                 onClick={(_, idx, e) => { e?.stopPropagation?.(); onDrill?.({ label: `${data[idx].w} · ${k}`, value: `$${data[idx][k]}K`, kind: 'stack' }); }} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function ScatterChartCard({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 4, right: 2, bottom: 14, left: 0 }}>
          <CartesianGrid stroke="rgba(60,64,67,0.08)" />
          <XAxis dataKey="arr"  type="number" name="ARR ($K)"  unit="K" tick={AXIS_TICK} tickLine={false} axisLine={false}
                 domain={[0, 'dataMax + 50']} />
          <YAxis dataKey="prob" type="number" name="Renewal %" unit="%" tick={AXIS_TICK} tickLine={false} axisLine={false}
                 domain={[0, 100]} />
          <ZAxis range={[40, 110]} />
          <Scatter data={data} fill={color} isAnimationActive={false}
                   onClick={(p, _, e) => { e?.stopPropagation?.(); onDrill?.({ label: p.name, value: `$${p.arr}K · ${p.prob}% renew`, kind: 'point' }); }} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  function RadialBars({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart data={data} cx="50%" cy="50%" innerRadius="32%" outerRadius="95%"
                        barSize={6} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="v" background={{ fill: 'rgba(60,64,67,0.07)' }}
                     cornerRadius={3} isAnimationActive={false}
                     onClick={(p, _, e) => { e?.stopPropagation?.(); onDrill?.({ label: p.name, value: `${p.v}% of target`, kind: 'goal' }); }} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }

  function TreemapCard({ data, color, onDrill }) {
    const palette = paletteFrom(color);
    const items = data.map((d, i) => ({ ...d, fill: palette[i % palette.length] }));
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={items} dataKey="size" stroke="#fff" isAnimationActive={false}
                 content={(props) => <TreemapNode {...props} onDrill={onDrill} />} />
      </ResponsiveContainer>
    );
  }
  function TreemapNode(props) {
    const { x, y, width, height, name, value, payload, onDrill } = props;
    if (width < 8 || height < 8) return null;
    const showLabel = width > 44 && height > 22;
    return (
      <g onClick={(e) => { e.stopPropagation(); onDrill?.({ label: name, value: `$${value}K`, kind: 'treemap' }); }}
         style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={width} height={height}
              fill={payload?.fill || '#1A73E8'} stroke="#fff" strokeWidth={1} />
        {showLabel && (
          <text x={x + 6} y={y + 14} fontSize="9" fontFamily={FONT}
                fill="#fff" fontWeight="500">{name}</text>
        )}
      </g>
    );
  }

  function SankeyCard({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Sankey data={data} nodePadding={6} nodeWidth={6}
                link={{ stroke: color, strokeOpacity: 0.35 }}
                node={(props) => <SankeyNode {...props} color={color} onDrill={onDrill} />}
                margin={{ top: 2, right: 16, bottom: 2, left: 4 }}>
        </Sankey>
      </ResponsiveContainer>
    );
  }
  function SankeyNode(props) {
    const { x, y, width, height, index, payload, color, onDrill } = props;
    return (
      <g onClick={(e) => { e.stopPropagation(); onDrill?.({ label: payload.name, value: `${payload.value || 0}`, kind: 'flow' }); }}
         style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.9} />
        <text x={x + width + 3} y={y + height / 2 + 3} fontSize="9" fontFamily={FONT}
              fill="#5F6368">{payload.name}</text>
      </g>
    );
  }

  function RadarCard({ data, color, onDrill }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="82%">
          <PolarGrid stroke="rgba(60,64,67,0.18)" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 8, fill: '#5F6368', fontFamily: FONT }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Peers" dataKey="peers" stroke="#9AA0A6"
                 strokeWidth={1} fill="#9AA0A6" fillOpacity={0.15} isAnimationActive={false} />
          <Radar name="You" dataKey="you" stroke={color}
                 strokeWidth={1.6} fill={color} fillOpacity={0.28} isAnimationActive={false}
                 onClick={() => onDrill?.({ label: 'You', value: 'Above peers in 5 of 6', kind: 'radar' })} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  // ── Heatmap — custom SVG grid (Recharts has no native heatmap) ────────
  function HeatmapCard({ data, color, onDrill }) {
    const cols = 24, rows = 7;
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const max = Math.max(...data.map(d => d.v));
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <svg viewBox={`0 0 ${cols * 4 + 8} ${rows * 4 + 8}`} preserveAspectRatio="none"
             style={{ width: '100%', height: '100%' }}>
          {data.map((c, i) => {
            const a = Math.max(0.08, c.v / max);
            return (
              <rect key={i} x={c.h * 4 + 8} y={c.d * 4 + 1} width={3.4} height={3.4} rx={0.6}
                    fill={color} fillOpacity={a} style={{ cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); onDrill?.({ label: `${days[c.d]} ${String(c.h).padStart(2, '0')}:00`, value: `${c.v} logins`, kind: 'cell' }); }} />
            );
          })}
          {days.map((d, i) => (
            <text key={i} x={0} y={i * 4 + 4} fontSize="3.2" fontFamily={FONT} fill="#80868B">{d}</text>
          ))}
        </svg>
      </div>
    );
  }

  // ── Semi-circle gauge — custom SVG ────────────────────────────────────
  function GaugeCard({ data, color, onDrill }) {
    const { value, min, max } = data;
    // Map value to angle on a 180° arc (left to right).
    const pct = (value - min) / (max - min);
    const angle = -180 + pct * 180;
    const r = 38, cx = 50, cy = 48;
    const toXY = (ang) => [
      cx + r * Math.cos((ang * Math.PI) / 180),
      cy + r * Math.sin((ang * Math.PI) / 180),
    ];
    const [sx, sy] = toXY(-180);
    const [ex, ey] = toXY(0);
    const [vx, vy] = toXY(angle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return (
      <div style={{ width: '100%', height: '100%' }}
           onClick={(e) => { e.stopPropagation(); onDrill?.({ label: 'NPS', value: `${value} (prev ${data.prev})`, kind: 'gauge' }); }}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
          {/* track */}
          <path d={`M ${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`} fill="none" stroke="rgba(60,64,67,0.08)" strokeWidth={6} strokeLinecap="round" />
          {/* progress */}
          <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${vx} ${vy}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
          {/* midpoint tick (zero) */}
          <line x1={50} y1={9} x2={50} y2={13} stroke="#9AA0A6" strokeWidth={1} />
          {/* value label below */}
          <text x={50} y={42} textAnchor="middle" fontSize="14" fontFamily={FONT}
                fontWeight="500" fill="#202124">{value}</text>
          <text x={50} y={54} textAnchor="middle" fontSize="6" fontFamily={FONT}
                fill="#80868B">{min} — {max}</text>
        </svg>
      </div>
    );
  }

  // ── Registry ─────────────────────────────────────────────────────────
  function pickChart(kind, props) {
    switch (kind) {
      case 'area-spark':    return <AreaSpark    {...props} />;
      case 'line-spark':    return <LineSpark    {...props} />;
      case 'bar-region':    return <BarRegion    {...props} />;
      case 'hbar-accounts': return <HBarAccounts {...props} />;
      case 'funnel-bars':   return <FunnelBars   {...props} />;
      case 'donut':         return <Donut        {...props} />;
      case 'composed':      return <Composed     {...props} />;
      case 'stacked-bars':  return <StackedBars  {...props} />;
      case 'scatter':       return <ScatterChartCard {...props} />;
      case 'radial-bar':    return <RadialBars   {...props} />;
      case 'treemap':       return <TreemapCard  {...props} />;
      case 'sankey':        return <SankeyCard   {...props} />;
      case 'radar':         return <RadarCard    {...props} />;
      case 'heatmap':       return <HeatmapCard  {...props} />;
      case 'gauge':         return <GaugeCard    {...props} />;
      default: return null;
    }
  }

  window.LkrPickChart = pickChart;
  window.LkrCardsCatalog = CARDS;
  window.LkrPaletteFrom = paletteFrom;
})();
