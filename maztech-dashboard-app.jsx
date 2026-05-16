/* global React, ReactDOM, Sidebar, TopBar, Icon, Store,
   OverviewScreen, FinanceScreen, RepairScreen, PartsScreen, CustomersScreen, AppointmentsScreen,
   NewJobModal, NewCustomerModal, NewAppointmentModal */

// ─── Runtime guard ──────────────────────────────────────────
// Each sibling .jsx file ends with `Object.assign(window, { … })` to publish
// its components across Babel-standalone's per-script scopes. If any file
// fails to load (404, syntax error, runtime throw before its bottom export),
// those globals stay undefined and React silently renders nothing — the
// dreaded "blank pane" symptom. This guard runs BEFORE <App/> is touched and
// fails loudly with a list of exactly what's missing and which file should
// have provided it. Saves you 30 minutes of "why is my main area empty?".
const REQUIRED_GLOBALS = {
  "Maztech Dashboard.store.jsx":        ["Store", "STATUS_MAP", "calcVAT", "uid", "todayISO"],
  "Maztech Dashboard.components.jsx":   ["Icon", "Logo", "Sidebar", "TopBar", "KPI", "Panel", "Pill", "Sparkline", "Counter"],
  "Maztech Dashboard.modals.jsx":       ["Modal", "Confirm", "NewJobModal", "NewCustomerModal", "NewAppointmentModal", "JobStatusMenu", "ChargeModal"],
  "Maztech Dashboard.overview.jsx":     ["OverviewScreen", "DualLineChart", "ServiceDonut"],
  "Maztech Dashboard.finance.jsx":      ["FinanceScreen"],
  "Maztech Dashboard.repair.jsx":       ["RepairScreen"],
  "Maztech Dashboard.parts.jsx":        ["PartsScreen"],
  "Maztech Dashboard.customers.jsx":    ["CustomersScreen"],
  "Maztech Dashboard.appointments.jsx": ["AppointmentsScreen"],
};

(() => {
  const missing = [];
  for (const [file, names] of Object.entries(REQUIRED_GLOBALS)) {
    for (const n of names) {
      if (typeof window[n] === "undefined") missing.push({ file, name: n });
    }
  }
  if (!missing.length) return;

  const rootEl = document.getElementById("root");
  const byFile = missing.reduce((acc, m) => {
    (acc[m.file] = acc[m.file] || []).push(m.name);
    return acc;
  }, {});
  const rows = Object.entries(byFile).map(([file, names]) =>
    `<div style="padding:10px 14px;background:#1a0708;border-left:3px solid #ff5252;margin:6px 0;border-radius:4px">
       <div style="color:#ffd180;font-size:12px;margin-bottom:4px">${file}</div>
       <div style="color:#ff8a80;font-size:13px">missing: ${names.join(", ")}</div>
     </div>`
  ).join("");

  rootEl.innerHTML = `
    <div style="font:14px/1.5 ui-monospace,SF Mono,monospace;color:#ffcaca;background:#0a0405;padding:32px;min-height:100vh">
      <div style="max-width:780px;margin:40px auto;background:#2a1215;padding:24px 28px;border:1px solid #5c2b2e;border-radius:10px">
        <div style="font-size:11px;letter-spacing:0.18em;color:#ff5252;margin-bottom:14px;font-weight:700">⚠  DASHBOARD FAILED TO BOOT — MISSING GLOBALS</div>
        <div style="color:#ffcaca;margin-bottom:18px;font-size:13px;line-height:1.6">
          ${missing.length} component(s) did not register on <code style="color:#ffd180">window</code> before <code style="color:#ffd180">app.jsx</code> ran.
          Most likely cause: one of the script tags failed to load (404, network), or that file threw an error before reaching its <code style="color:#ffd180">Object.assign(window, …)</code> at the bottom.
          Open DevTools → Console + Network tabs and check the listed files.
        </div>
        ${rows}
        <div style="margin-top:16px;font-size:12px;color:#8a6a6a">
          Script load order matters — see &lt;script type="text/babel"&gt; tags in <code style="color:#ffd180">Maztech Dashboard.html</code>.
        </div>
      </div>
    </div>`;
  throw new Error("[Maztech] Missing globals — see #root for details. Missing: " + missing.map(m => m.name).join(", "));
})();

const { useState, useEffect, useRef } = React;

const SCREENS = {
  overview:     { title: "ภาพรวมอู่",    sub: "Live · ",                    Comp: OverviewScreen },
  finance:      { title: "การเงิน",       sub: "พฤษภาคม 2026 · MTD",          Comp: FinanceScreen },
  repair:       { title: "งานซ่อม",       sub: "คิวงาน",                       Comp: RepairScreen },
  parts:        { title: "สต็อกอะไหล่",   sub: "",                             Comp: PartsScreen },
  customers:    { title: "ลูกค้า",        sub: "",                             Comp: CustomersScreen },
  appointments: { title: "ตารางนัดหมาย",  sub: "สัปดาห์ที่ 19 · 2026",         Comp: AppointmentsScreen },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "slate",
  "accent": "amber",
  "glow": true,
  "density": "balanced"
}/*EDITMODE-END*/;

const App = () => {
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem("maztech-screen") || "overview";
  });
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [now, setNow] = useState(new Date());
  const [newJob, setNewJob] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const [newAppt, setNewAppt] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const meta = Store.useStore(s => s.meta);
  const counts = Store.useStore(s => ({
    repair: s.jobs.filter(j => j.status !== "done").length,
    overdue: s.jobs.filter(j => j.status === "overdue").length,
    parts: s.parts.filter(p => p.qty < p.min).length,
    customers: s.customers.length,
    appts: s.appointments.filter(a => a.status !== "cancelled" && a.status !== "converted").length,
  }));

  // Persist active screen
  useEffect(() => { localStorage.setItem("maztech-screen", screen); }, [screen]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Tweaks protocol — register handlers BEFORE announcing
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

  // Cmd+K to focus search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".topbar .search input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Theme on body
  useEffect(() => {
    document.body.setAttribute("data-theme", tweaks.theme);
    document.body.setAttribute("data-accent", tweaks.accent);
    document.body.classList.toggle("no-glow", !tweaks.glow);
    document.body.setAttribute("data-density", tweaks.density);
  }, [tweaks.theme, tweaks.accent, tweaks.glow, tweaks.density]);

  const setTweak = (k, v) => {
    const next = typeof k === "object" ? { ...tweaks, ...k } : { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({
      type: "__edit_mode_set_keys",
      edits: typeof k === "object" ? k : { [k]: v }
    }, "*");
  };

  const showToast = (msg, kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2800);
  };

  const onExport = () => { Store.exportJSON(); showToast("ดาวน์โหลดสำรองข้อมูลสำเร็จ"); };
  const onImport = () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "application/json,.json";
    inp.onchange = () => {
      const f = inp.files?.[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const r = Store.importJSON(e.target.result);
        if (r.ok) showToast("นำเข้าข้อมูลสำเร็จ");
        else showToast("นำเข้าล้มเหลว · " + r.error, "err");
      };
      reader.readAsText(f);
    };
    inp.click();
  };
  const onReset = () => {
    if (!confirm("รีเซ็ตข้อมูลกลับเป็นชุด demo ทั้งหมด?\n(ข้อมูลปัจจุบันจะหายหมด)")) return;
    Store.resetDemo();
    showToast("รีเซ็ตเป็นข้อมูล demo แล้ว");
  };
  const onClear = () => {
    if (!confirm("ลบข้อมูลทั้งหมด?\nเริ่มต้นใหม่ทั้งหมด (ใช้สำหรับเปิดอู่จริง)")) return;
    Store.clearAll();
    showToast("ล้างข้อมูลทั้งหมดแล้ว");
  };

  // Search — basic global search
  const searchResults = (() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    const state = Store.getState();
    const c = state.customers.filter(c => c.name.toLowerCase().includes(q) || (c.phone || "").includes(search)).slice(0, 5);
    const v = state.vehicles.filter(v => v.plate.toLowerCase().includes(q) || (v.model || "").toLowerCase().includes(q)).slice(0, 5);
    const j = state.jobs.filter(j => j.id.toLowerCase().includes(q) || j.svc.toLowerCase().includes(q)).slice(0, 5);
    return { c, v, j };
  })();

  const { title, sub, Comp } = SCREENS[screen];
  const timeStr = now.toLocaleTimeString("th-TH", { hour12: false });
  const dateStr = now.toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Subtitle for each screen with live counts
  const dynSub = (() => {
    if (screen === "overview")  return meta.shopName + " · " + timeStr + " · " + dateStr;
    if (screen === "parts")     return `${Store.getState().parts.length} SKU · ${counts.parts} alert`;
    if (screen === "customers") return `${counts.customers} ราย`;
    if (screen === "repair")    return `${counts.repair} งาน · ${counts.overdue} เกินกำหนด`;
    if (screen === "appointments") return `${counts.appts} นัด · สัปดาห์ที่ 19 · 2026`;
    return sub + " · " + dateStr;
  })();

  return (
    <div className="app">
      <Sidebar active={screen} onChange={setScreen} counts={counts}/>
      <main className="main">
        <TopBar title={title} subtitle={dynSub}
          search={search}
          onSearch={setSearch}
          onSearchFocus={() => setSearchFocus(true)}
          onSearchBlur={() => setTimeout(() => setSearchFocus(false), 200)}
          searchResults={searchFocus && searchResults}
          onSearchPick={(kind, item) => {
            setSearch("");
            setSearchFocus(false);
            if (kind === "customer")  setScreen("customers");
            if (kind === "vehicle")   setScreen("customers");
            if (kind === "job")       setScreen("repair");
          }}
          actions={<>
            <button className="btn btn-secondary" onClick={onExport} title="สำรอง JSON"><Icon name="download" size={14}/>ส่งออก</button>
            <button className="btn btn-primary" onClick={() => setNewJob(true)}><Icon name="plus" size={14}/>เปิดงานซ่อม</button>
          </>}/>
        <div className="screen"><Comp/></div>
      </main>

      {newJob && <NewJobModal onClose={() => setNewJob(false)} onCreated={() => { setScreen("repair"); showToast("เปิดงานซ่อมใหม่สำเร็จ"); }} />}
      {newCustomer && <NewCustomerModal onClose={() => setNewCustomer(false)} onCreated={() => showToast("เพิ่มลูกค้าสำเร็จ")} />}
      {newAppt && <NewAppointmentModal onClose={() => setNewAppt(false)} onCreated={() => { setScreen("appointments"); showToast("สร้างนัดสำเร็จ"); }} />}

      {editMode && (
        <TweaksPanel
          tweaks={tweaks} setTweak={setTweak} meta={meta}
          setMeta={Store.setMeta}
          onExport={onExport} onImport={onImport} onReset={onReset} onClear={onClear}
          onNewJob={() => setNewJob(true)}
          onNewCustomer={() => setNewCustomer(true)}
          onNewAppointment={() => setNewAppt(true)}
          onClose={() => {
            setEditMode(false);
            window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
          }}/>
      )}

      {toast && (
        <div className="toast-finance" style={{ background: toast.kind === "err" ? "linear-gradient(180deg, rgba(239,68,68,0.18), rgba(239,68,68,0.08))" : undefined }}>
          <span className={"toast-dot " + (toast.kind === "err" ? "out" : "in")}></span>
          <div style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
};

// ─── Tweaks panel ────────────────────────────────────────────
const TweaksPanel = ({ tweaks, setTweak, meta, setMeta, onExport, onImport, onReset, onClear, onNewJob, onNewCustomer, onNewAppointment, onClose }) => (
  <div className="tweaks-panel" style={{ width: 300 }}>
    <div className="tweaks-head">
      <span>การตั้งค่า · Tweaks</span>
      <button onClick={onClose} className="tweaks-close">×</button>
    </div>
    <div className="tweaks-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>

      <div className="tweak-section">
        <div className="tweak-label">ลัด · ทางลัด</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
          <button className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={onNewJob}>
            <Icon name="wrench" size={12}/> เปิดงานซ่อมใหม่
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={onNewCustomer}>
            <Icon name="users" size={12}/> เพิ่มลูกค้า
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: "center" }} onClick={onNewAppointment}>
            <Icon name="calendar" size={12}/> สร้างนัด
          </button>
        </div>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">ข้อมูลอู่</div>
        <input className="text-input" style={{ fontSize: 12 }} value={meta.shopName} onChange={e => setMeta({ shopName: e.target.value })} placeholder="ชื่ออู่"/>
        <input className="text-input" style={{ fontSize: 12 }} value={meta.shopPhone} onChange={e => setMeta({ shopPhone: e.target.value })} placeholder="เบอร์โทร"/>
        <input className="text-input" style={{ fontSize: 12 }} value={meta.shopAddress} onChange={e => setMeta({ shopAddress: e.target.value })} placeholder="ที่อยู่"/>
        <input className="text-input" style={{ fontSize: 12 }} value={meta.owner} onChange={e => setMeta({ owner: e.target.value })} placeholder="ชื่อเจ้าของ"/>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">VAT</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--fg-2)" }}>คิด VAT</span>
          <button className={"switch " + (meta.vatEnabled ? "on" : "")} onClick={() => setMeta({ vatEnabled: !meta.vatEnabled })}>
            <span className="switch-knob"></span>
          </button>
        </div>
        {meta.vatEnabled && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="number" className="text-input" style={{ fontSize: 12, width: 60 }}
              value={meta.vatPercent} onChange={e => setMeta({ vatPercent: Number(e.target.value) })}/>
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>% (รวมในยอดรับ)</span>
          </div>
        )}
      </div>

      <div className="tweak-section">
        <div className="tweak-label">ธีม</div>
        <div className="tweak-segs">
          {["slate", "light"].map(v => (
            <button key={v} className={"ts" + (tweaks.theme===v?" on":"")} onClick={()=>setTweak("theme", v)}>{v === "slate" ? "เข้ม" : "สว่าง"}</button>
          ))}
        </div>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">เอฟเฟกต์เรืองแสง</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--fg-2)" }}>Glow</span>
          <button className={"switch " + (tweaks.glow?"on":"")} onClick={()=>setTweak("glow", !tweaks.glow)}>
            <span className="switch-knob"></span>
          </button>
        </div>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">ความหนาแน่น</div>
        <div className="tweak-segs">
          {[["spacious","กว้าง"],["balanced","ปกติ"],["dense","แน่น"]].map(([v,l]) => (
            <button key={v} className={"ts" + (tweaks.density===v?" on":"")} onClick={()=>setTweak("density", v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">ข้อมูล · สำรอง</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button className="btn btn-secondary" style={{ justifyContent: "center", fontSize: 11 }} onClick={onExport}>
            <Icon name="download" size={12}/> ส่งออก
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: "center", fontSize: 11 }} onClick={onImport}>
            <Icon name="upload" size={12}/> นำเข้า
          </button>
        </div>
      </div>

      <div className="tweak-section">
        <div className="tweak-label">รีเซ็ต</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
          <button className="btn btn-ghost" style={{ justifyContent: "center", fontSize: 11 }} onClick={onReset}>
            กลับเป็น demo
          </button>
          <button className="btn btn-ghost btn-danger-text" style={{ justifyContent: "center", fontSize: 11 }} onClick={onClear}>
            ล้างข้อมูลทั้งหมด
          </button>
        </div>
      </div>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
