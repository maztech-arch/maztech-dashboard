/* global React, KPI, Panel, Pill, Icon, Sparkline */
const OverviewScreen = () => {
  const bays = [
    { n: 1, plate: "กท 8842", svc: "เปลี่ยนน้ำมัน + ตรวจเบรก", p: 100, status: "done", eta: "เสร็จแล้ว" },
    { n: 2, plate: "ฮต 7711", svc: "ซ่อมเครื่องยนต์", p: 64, status: "", eta: "ETA 16:00" },
    { n: 3, plate: "ขฉ 1124", svc: "ตรวจเช็คระยะ 10,000", p: 38, status: "", eta: "ETA 15:20" },
    { n: 4, plate: "1กม 9024", svc: "รออะไหล่กรองอากาศ", p: 22, status: "warn", eta: "พรุ่งนี้" },
    { n: 5, plate: "—", svc: "ว่าง", p: 0, status: "idle", eta: "พร้อมรับ" },
    { n: 6, plate: "3ขจ 5582", svc: "เกินกำหนด 2 วัน", p: 88, status: "danger", eta: "OVERDUE" },
  ];
  const revData = [42, 58, 51, 67, 73, 62, 84, 78, 92, 88, 96, 110, 102, 118, 124];
  const expData = [32, 38, 41, 45, 48, 52, 56, 54, 60, 64, 68, 70, 72, 78, 82];

  return (
    <div className="col fade-in" style={{ gap: 20 }}>
      <div className="kpi-grid">
        <KPI label="รายได้วันนี้" value="42180" delta="8.2% vs เมื่อวาน" deltaDir="up" live accent="amber" spark={[12,18,15,22,28,24,32,38,42,40,48,52]}/>
        <KPI label="งานในมือ" value="12" unit="คัน" delta="4 เกินกำหนด" deltaDir="down" live accent="cyan" spark={[8,9,10,11,12,11,12,13,12,12,12,12]}/>
        <KPI label="ค้างจ่าย" value="28400" delta="5 บิล" deltaDir="up" accent="amber" spark={[18,22,20,25,28,26,30,28,32,30,28,28]}/>
        <KPI label="ลูกค้าใหม่ทั้งเดือน" value="34" unit="คน" delta="42% MoM" deltaDir="up" accent="success" spark={[3,5,8,10,12,15,18,22,25,28,31,34]}/>
      </div>

      <div className="grid-2">
        <Panel title="รายรับ vs รายจ่าย — 14 วันล่าสุด"
          eyebrow="FINANCE TREND"
          actions={<div className="legend">
            <span className="legend-item"><span className="legend-dot" style={{background:"var(--amber-500)"}}></span>รายรับ</span>
            <span className="legend-item"><span className="legend-dot" style={{background:"var(--cyan-400)"}}></span>รายจ่าย</span>
          </div>}>
          <DualLineChart series={[
            { data: revData, color: "var(--amber-500)", fill: true },
            { data: expData, color: "var(--cyan-400)", fill: false }
          ]}/>
        </Panel>

        <Panel title="ประเภทบริการเดือนนี้" eyebrow="SERVICE MIX">
          <ServiceDonut items={[
            { label: "เปลี่ยนน้ำมัน", v: 38, color: "var(--amber-500)" },
            { label: "ซ่อมเครื่องยนต์", v: 22, color: "var(--cyan-400)" },
            { label: "ตรวจระยะ", v: 18, color: "#A78BFA" },
            { label: "เบรก/ช่วงล่าง", v: 14, color: "var(--success)" },
            { label: "อื่นๆ", v: 8, color: "#F472B6" },
          ]}/>
        </Panel>
      </div>

      <Panel title="ช่องซ่อม · 6 ช่อง" eyebrow="WORKSHOP FLOOR" actions={<button className="btn btn-secondary">ดูทั้งหมด</button>}>
        <div className="bay-grid">
          {bays.map(b => (
            <div key={b.n} className={"bay " + b.status}>
              <div className="bay-num">BAY · 0{b.n}</div>
              <div className="bay-plate">{b.plate}</div>
              <div className="bay-service">{b.svc}</div>
              <div className="bay-progress"><div className="bay-progress-fill" style={{width: b.p + "%"}}></div></div>
              <div className="bay-foot">
                <span className="bay-eta">{b.eta}</span>
                <span className="mono" style={{fontSize: 10, color: "var(--fg-3)"}}>{b.p}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

// ─── Dual line chart ─────────────────────────────────────────
const DualLineChart = ({ series, height = 220 }) => {
  const w = 640, h = height - 40;
  const allValues = series.flatMap(s => s.data);
  const max = Math.max(...allValues) * 1.1, min = 0;
  const range = max - min || 1;
  const n = series[0].data.length;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--amber-500)" stopOpacity="0.30"/>
          <stop offset="1" stopColor="var(--amber-500)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1="0" y1={h * t + 10} x2={w} y2={h * t + 10} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
      {series.map((s, idx) => {
        const pts = s.data.map((d, i) => [(i / (n - 1)) * w, h - ((d - min) / range) * h + 10]);
        const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
        const fillPath = path + ` L ${w} ${h + 10} L 0 ${h + 10} Z`;
        return (
          <g key={idx}>
            {s.fill && <path d={fillPath} fill="url(#rev-fill)"/>}
            <path d={path} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
            {pts.slice(-1).map((p, i) => (
              <g key={i}>
                <circle cx={p[0]} cy={p[1]} r="5" fill={s.color} opacity="0.3"/>
                <circle cx={p[0]} cy={p[1]} r="3" fill={s.color}/>
              </g>
            ))}
          </g>
        );
      })}
      {/* x-axis labels */}
      {["29", "1", "3", "5", "7", "9", "11", "12"].map((l, i) => (
        <text key={i} x={(i / 7) * w} y={h + 28} fontFamily="JetBrains Mono" fontSize="9" fill="var(--fg-3)" textAnchor={i === 0 ? "start" : i === 7 ? "end" : "middle"}>{l}</text>
      ))}
    </svg>
  );
};

// ─── Donut ───────────────────────────────────────────────────
const ServiceDonut = ({ items }) => {
  const total = items.reduce((s, i) => s + i.v, 0);
  let acc = 0;
  const R = 56, C = 2 * Math.PI * R;
  return (
    <div style={{display:"flex", alignItems:"center", gap: 20}}>
      <svg viewBox="0 0 140 140" width="140" height="140" style={{flexShrink: 0}}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-3)" strokeWidth="14"/>
        {items.map((it, i) => {
          const len = (it.v / total) * C;
          const off = -acc;
          acc += len;
          return (
            <circle key={i} cx="70" cy="70" r={R} fill="none"
              stroke={it.color} strokeWidth="14"
              strokeDasharray={`${len} ${C}`}
              strokeDashoffset={off}
              transform="rotate(-90 70 70)"
              strokeLinecap="butt"/>
          );
        })}
        <text x="70" y="68" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="22" fontWeight="600" fill="var(--fg-1)">{total}</text>
        <text x="70" y="86" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--fg-3)" letterSpacing="2">งาน · MTD</text>
      </svg>
      <div style={{flex:1, display:"flex", flexDirection:"column", gap: 6}}>
        {items.map((it, i) => (
          <div key={i} style={{display:"flex", alignItems:"center", gap: 8, fontSize: 12}}>
            <span style={{width: 10, height: 10, borderRadius: 2, background: it.color, flexShrink: 0}}></span>
            <span style={{flex:1, color: "var(--fg-2)"}}>{it.label}</span>
            <span className="metric-mono" style={{color: "var(--fg-1)", fontWeight: 500}}>{it.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { OverviewScreen, DualLineChart, ServiceDonut });
