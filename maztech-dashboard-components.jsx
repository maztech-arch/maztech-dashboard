/* global React */
// Maztech Dashboard — shared components

const { useState, useEffect, useRef } = React;

// ─── icon set (lucide-style stroke=1.75) ─────────────────────
const Icon = ({ name, size = 18, ...rest }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    money: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    wrench: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    up: <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>,
    down: <><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    more: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    car: <><path d="M14 16H9m10 0h2v-3.15a3 3 0 0 0-.65-1.85L17 6a2 2 0 0 0-1.5-.7H8.5A2 2 0 0 0 7 6L3.65 11A3 3 0 0 0 3 12.85V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></>,
    chevron: <polyline points="9 18 15 12 9 6"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
    wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
    msg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Logo ────────────────────────────────────────────────────
const Logo = ({ compact }) => (
  <div className="logo">
    <img src="assets/logo-badge.png" alt="Maztech Garage" width="36" height="36" style={{borderRadius:"50%", filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.5))"}} />
    {!compact && (<div>
      <div className="logo-name">MAZTECH</div>
      <div className="logo-sub">GARAGE</div>
    </div>)}
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────
const Sidebar = ({ active, onChange }) => {
  const items = [
    { id: "overview", label: "ภาพรวม", icon: "dashboard" },
    { id: "finance", label: "การเงิน", icon: "money" },
    { id: "repair", label: "งานซ่อม", icon: "wrench", badge: 12 },
    { id: "parts", label: "สต็อกอะไหล่", icon: "box", badge: 3, badgeWarn: true },
    { id: "customers", label: "ลูกค้า", icon: "users" },
    { id: "appointments", label: "นัดหมาย", icon: "calendar" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-top"><Logo /></div>
      <nav className="nav">
        <div className="nav-eyebrow">MENU</div>
        {items.map(it => (
          <button key={it.id}
            className={"nav-item" + (active === it.id ? " active" : "")}
            onClick={() => onChange(it.id)}>
            <Icon name={it.icon} size={18}/>
            <span className="nav-label">{it.label}</span>
            {it.badge && (
              <span className={"nav-badge" + (it.badgeWarn ? " warn" : "")}>{it.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="card-mini">
          <div className="card-mini-row">
            <div className="status-dot live"></div>
            <span>เชื่อมต่อสด</span>
          </div>
          <div className="mini-meta">v 2.4 · 14:32</div>
        </div>
        <div className="user-chip">
          <div className="avatar">มซ</div>
          <div>
            <div className="user-name">คุณมาซ</div>
            <div className="user-role">เจ้าของอู่</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── Top Bar ─────────────────────────────────────────────────
const TopBar = ({ title, subtitle, actions }) => (
  <header className="topbar">
    <div className="topbar-title">
      <h1 className="h1">{title}</h1>
      {subtitle && <div className="topbar-sub">{subtitle}</div>}
    </div>
    <div className="topbar-actions">
      <div className="search">
        <Icon name="search" size={14}/>
        <input placeholder="ค้นหาทะเบียน / ลูกค้า / Job #"/>
        <kbd>⌘K</kbd>
      </div>
      <button className="icon-btn" title="แจ้งเตือน">
        <Icon name="bell" size={18}/>
        <span className="dot-pulse"></span>
      </button>
      {actions}
    </div>
  </header>
);

// ─── KPI Card ────────────────────────────────────────────────
const KPI = ({ label, value, unit, delta, deltaDir = "up", live, accent = "amber", spark, suffix }) => {
  return (
    <div className={"kpi accent-" + accent}>
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        {live && <span className="live-pill"><span className="dot"></span>LIVE</span>}
      </div>
      <div className="kpi-value">
        <Counter to={value}/>{unit && <span className="kpi-unit">{unit}</span>}
        {suffix}
      </div>
      <div className="kpi-foot">
        {delta && (
          <span className={"delta " + deltaDir}>
            <Icon name={deltaDir === "up" ? "up" : "down"} size={12}/> {delta}
          </span>
        )}
        {spark && <Sparkline data={spark} color={`var(--${accent === "amber" ? "amber-500" : accent === "cyan" ? "cyan-400" : "success"})`}/>}
      </div>
    </div>
  );
};

// ─── Animated counter ────────────────────────────────────────
const Counter = ({ to, duration = 900, prefix = "", decimals = 0 }) => {
  const [v, setV] = useState(0);
  const target = typeof to === "string" ? parseFloat(to.replace(/[^\d.-]/g, "")) : to;
  const prefixStr = typeof to === "string" ? (to.match(/^[^\d-]+/) || [""])[0] : prefix;
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  const formatted = v.toLocaleString("en-US", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  });
  return <>{prefixStr}{formatted}</>;
};

// ─── Sparkline ───────────────────────────────────────────────
const Sparkline = ({ data, color = "var(--amber-500)", width = 80, height = 28, fill = true }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * width, height - ((d - min) / range) * (height - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const fillPath = path + ` L ${width} ${height} L 0 ${height} Z`;
  const id = "sg-" + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={fillPath} fill={`url(#${id})`}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
};

// ─── Panel ───────────────────────────────────────────────────
const Panel = ({ title, eyebrow, actions, children, className = "" }) => (
  <section className={"panel " + className}>
    <header className="panel-head">
      <div>
        {eyebrow && <div className="panel-eyebrow">{eyebrow}</div>}
        <h3 className="panel-title">{title}</h3>
      </div>
      {actions && <div className="panel-actions">{actions}</div>}
    </header>
    <div className="panel-body">{children}</div>
  </section>
);

// ─── Status pill ─────────────────────────────────────────────
const Pill = ({ children, variant = "default", pulse }) => (
  <span className={"pill pill-" + variant}>
    <span className={"pill-dot" + (pulse ? " pulse" : "")}></span>
    {children}
  </span>
);

// Export everything to window so other Babel scripts can use it
Object.assign(window, {
  Icon, Logo, Sidebar, TopBar, KPI, Counter, Sparkline, Panel, Pill,
});
