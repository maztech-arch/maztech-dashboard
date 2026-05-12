/* global React, ReactDOM, Sidebar, TopBar, Icon,
   OverviewScreen, FinanceScreen, RepairScreen, PartsScreen, CustomersScreen, AppointmentsScreen */
const { useState, useEffect } = React;

const SCREENS = {
  overview:     { title: "ภาพรวมอู่",    sub: "Live · Maztech Garage · " , Comp: OverviewScreen },
  finance:      { title: "การเงิน",       sub: "พฤษภาคม 2026 · MTD",        Comp: FinanceScreen },
  repair:       { title: "งานซ่อม",       sub: "คิวงานวันนี้",             Comp: RepairScreen },
  parts:        { title: "สต็อกอะไหล่",   sub: "284 SKU · 3 alert",         Comp: PartsScreen },
  customers:    { title: "ลูกค้า",        sub: "284 ราย · 42 VIP",          Comp: CustomersScreen },
  appointments: { title: "ตารางนัดหมาย",  sub: "สัปดาห์ที่ 19 · 2026",      Comp: AppointmentsScreen },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "slate",
  "accent": "amber",
  "glow": true,
  "density": "balanced"
}/*EDITMODE-END*/;

const App = () => {
  const [screen, setScreen] = useState("overview");
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode")   setEditMode(true);
      if (e.data.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Theme on body
  useEffect(() => {
    document.body.setAttribute("data-theme", tweaks.theme);
    document.body.setAttribute("data-accent", tweaks.accent);
  }, [tweaks.theme, tweaks.accent]);

  const setTweak = (k, v) => {
    const next = typeof k === "object" ? { ...tweaks, ...k } : { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({
      type: "__edit_mode_set_keys",
      edits: typeof k === "object" ? k : { [k]: v }
    }, "*");
  };

  const { title, sub, Comp } = SCREENS[screen];
  const timeStr = now.toLocaleTimeString("th-TH", { hour12: false });
  const dateStr = now.toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="app">
      <Sidebar active={screen} onChange={setScreen}/>
      <main className="main">
        <TopBar title={title} subtitle={sub + (screen === "overview" ? timeStr : "") + " · " + dateStr}
          actions={<>
            <button className="btn btn-secondary"><Icon name="download" size={14}/>ส่งออก</button>
            <button className="btn btn-primary"><Icon name="plus" size={14}/>เปิดงานซ่อม</button>
          </>}/>
        <div className="screen"><Comp/></div>
      </main>

      {editMode && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => {
        setEditMode(false);
        window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
      }}/>}
    </div>
  );
};

// ─── Tweaks panel ────────────────────────────────────────────
const TweaksPanel = ({ tweaks, setTweak, onClose }) => (
  <div className="tweaks-panel">
    <div className="tweaks-head">
      <span>Tweaks</span>
      <button onClick={onClose} className="tweaks-close">×</button>
    </div>
    <div className="tweaks-body">
      <div className="tweak-section">
        <div className="tweak-label">Theme</div>
        <div className="tweak-segs">
          {["slate", "light"].map(v => (
            <button key={v} className={"ts" + (tweaks.theme===v?" on":"")} onClick={()=>setTweak("theme", v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweak-section">
        <div className="tweak-label">Glow effects</div>
        <button className={"switch " + (tweaks.glow?"on":"")} onClick={()=>setTweak("glow", !tweaks.glow)}>
          <span className="switch-knob"></span>
        </button>
      </div>
      <div className="tweak-section">
        <div className="tweak-label">Density</div>
        <div className="tweak-segs">
          {["spacious", "balanced", "dense"].map(v => (
            <button key={v} className={"ts" + (tweaks.density===v?" on":"")} onClick={()=>setTweak("density", v)}>{v}</button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
