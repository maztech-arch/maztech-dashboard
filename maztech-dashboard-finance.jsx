/* global React, KPI, Panel, Pill, Icon, Sparkline, DualLineChart */
const { useState } = React;

const FinanceScreen = () => {
  const seed = [
    { id: "TXN-2841", t: "14:32", type: "in",  label: "ชำระเงินสด · กท 8842",          svc: "เปลี่ยนน้ำมัน + ตรวจเบรก",  amt: 8400, method: "เงินสด", cat: "บริการซ่อม" },
    { id: "TXN-2840", t: "13:58", type: "out", label: "ซื้ออะไหล่ · กรองอากาศ ×8",     svc: "Supplier #4",                amt: 2480, method: "โอน",    cat: "อะไหล่" },
    { id: "TXN-2839", t: "13:12", type: "in",  label: "ชำระบางส่วน · ฮต 7711",         svc: "ซ่อมเครื่องยนต์",            amt: 6000, method: "QR",     cat: "บริการซ่อม" },
    { id: "TXN-2838", t: "11:44", type: "out", label: "ค่าแรง · ช่างซ่อม 3 คน",        svc: "Payroll · ทีม",              amt: 4500, method: "โอน",    cat: "ค่าแรง" },
    { id: "TXN-2837", t: "10:21", type: "in",  label: "ชำระเงิน · ขฉ 1124",            svc: "ตรวจระยะ 10,000",            amt: 3200, method: "โอน",    cat: "บริการซ่อม" },
  ];

  const [txns, setTxns] = useState(seed);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewSlip, setViewSlip] = useState(null);
  const [dividendPct, setDividendPct] = useState(60);

  // Live totals
  const totals = txns.reduce((a, t) => ({
    in:  a.in  + (t.type === "in"  ? t.amt : 0),
    out: a.out + (t.type === "out" ? t.amt : 0),
  }), { in: 0, out: 0 });
  const profit = totals.in - totals.out;

  // KPIs — base monthly values + today's entries
  const monthIn  = 833910 + totals.in  - seed.filter(t=>t.type==="in").reduce((a,t)=>a+t.amt,0);
  const monthOut = 405100 + totals.out - seed.filter(t=>t.type==="out").reduce((a,t)=>a+t.amt,0);

  const addTxn = (data) => {
    const num = 2842 + (txns.length - seed.length);
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    const newTxn = {
      id: `TXN-${num}`,
      t,
      type: data.type,
      label: data.label,
      svc: data.note || (data.type === "in" ? "รายรับ" : "รายจ่าย"),
      amt: Number(data.amt),
      method: data.method,
      cat: data.cat,
      slip: data.slip || null,
      slipName: data.slipName || null,
    };
    setTxns([newTxn, ...txns]);
    setOpen(false);
    setToast({ type: data.type, amt: data.amt, id: newTxn.id });
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="col fade-in" style={{ gap: 20 }}>
      <div className="kpi-grid">
        <KPI label="รายรับเดือนนี้"  value={monthIn.toLocaleString()}  delta="12.4% MoM" deltaDir="up"   accent="amber"   spark={[42,48,51,55,62,68,72,78,85,84]}/>
        <KPI label="รายจ่ายเดือนนี้" value={monthOut.toLocaleString()} delta="6.8% MoM"  deltaDir="up"   accent="cyan"    spark={[28,32,35,38,40,42,44,40,38,41]}/>
        <KPI label="กำไรสุทธิ"       value={(monthIn - monthOut).toLocaleString()} delta="18.2% MoM" deltaDir="up" accent="success" spark={[14,16,16,17,22,26,28,38,46,43]}/>
        <KPI label="ค้างรับ"         value="28,400" unit="฿" delta="5 บิล" deltaDir="down" accent="amber"/>
      </div>

      <div className="grid-2">
        <Panel title="กระแสเงินสด — 30 วัน" eyebrow="CASH FLOW"
          actions={<div className="legend">
            <span className="legend-item"><span className="legend-dot" style={{background:"var(--amber-500)"}}></span>รายรับ</span>
            <span className="legend-item"><span className="legend-dot" style={{background:"var(--cyan-400)"}}></span>รายจ่าย</span>
          </div>}>
          <DualLineChart series={[
            { data: [38,42,46,52,58,55,62,68,72,68,78,82,86,92,88,94,98,102,108,112,115,118,122,128,132,128,135,142,148,152], color: "var(--amber-500)", fill: true },
            { data: [22,24,28,32,35,38,42,40,42,45,48,52,55,58,60,62,64,66,68,72,74,76,78,80,82,84,86,88,90,92], color: "var(--cyan-400)", fill: false },
          ]}/>
        </Panel>

        <Panel title="สรุปวันนี้" eyebrow="TODAY · LIVE LEDGER">
          <div className="ledger-summary">
            <div className="ledger-row in">
              <div>
                <div className="ledger-eyebrow">รายรับวันนี้</div>
                <div className="ledger-amt up">+฿{totals.in.toLocaleString()}</div>
              </div>
              <div className="ledger-count">{txns.filter(t=>t.type==="in").length} รายการ</div>
            </div>
            <div className="ledger-row out">
              <div>
                <div className="ledger-eyebrow">รายจ่ายวันนี้</div>
                <div className="ledger-amt down">−฿{totals.out.toLocaleString()}</div>
              </div>
              <div className="ledger-count">{txns.filter(t=>t.type==="out").length} รายการ</div>
            </div>
            <div className="ledger-row net">
              <div>
                <div className="ledger-eyebrow">กำไรสุทธิวันนี้</div>
                <div className="ledger-amt" style={{color: profit >= 0 ? "var(--success)" : "var(--danger)"}}>
                  ฿{profit.toLocaleString()}
                </div>
              </div>
              <Pill variant={profit >= 0 ? "success" : "danger"}>{profit >= 0 ? "▲ กำไร" : "▼ ขาดทุน"}</Pill>
            </div>
          </div>
          <div className="divider" style={{margin:"14px 0"}}></div>
          <button className="btn btn-primary" style={{width:"100%", justifyContent:"center"}} onClick={() => setOpen(true)}>
            <Icon name="plus" size={14}/> บันทึกรายรับ / รายจ่าย
          </button>
        </Panel>
      </div>

      {/* ─── P&L + Bank Accounts ─────────────────────────── */}
      <div className="grid-pl">
        <Panel title="งบกำไรขาดทุน" eyebrow="P&L STATEMENT · MTD พฤษภาคม 2026"
          actions={<button className="btn btn-secondary"><Icon name="download" size={14}/> ส่งออก PDF</button>}>
          {(() => {
            const rev = 842310;
            const cogs = 218600;
            const gross = rev - cogs;
            const salaries = 45000;
            const rent = 35000;
            const utils = 3000;
            const fixed = salaries + rent + utils;
            const variable = 156480;
            const net = gross - fixed - variable;
            const margin = ((net / rev) * 100).toFixed(1);
            const max = rev;
            const Row = ({ label, val, type, indent }) => (
              <div className={"pl-row " + type} style={indent ? {paddingLeft: 20} : {}}>
                <div className="pl-label">{label}</div>
                <div className="pl-bar-wrap">
                  <div className={"pl-bar " + type} style={{width: (Math.abs(val) / max * 100) + "%"}}></div>
                </div>
                <div className={"pl-val " + (val < 0 ? "neg" : "pos")}>
                  {val < 0 ? "−" : ""}฿{Math.abs(val).toLocaleString()}
                </div>
              </div>
            );
            return (
              <div className="pl-table">
                <Row label="รายได้รวม" val={rev} type="rev" />
                <Row label="ต้นทุนอะไหล่ / วัสดุ (COGS)" val={-cogs} type="cogs" indent />
                <div className="pl-divider"></div>
                <Row label="กำไรขั้นต้น (Gross Profit)" val={gross} type="gross" />
                <div className="pl-sub">รายจ่ายคงที่</div>
                <Row label="เงินเดือนช่าง" val={-salaries} type="fixed" indent />
                <Row label="ค่าเช่าอู่" val={-rent} type="fixed" indent />
                <Row label="ค่าน้ำ-ไฟ-เน็ต" val={-utils} type="fixed" indent />
                <Row label="ค่าใช้จ่ายผันแปร (โฆษณา/อื่นๆ)" val={-variable} type="var" indent />
                <div className="pl-divider"></div>
                <div className="pl-net">
                  <div>
                    <div className="ledger-eyebrow">กำไรสุทธิ · Net Profit</div>
                    <div style={{display:"flex", alignItems:"baseline", gap:10, marginTop:6}}>
                      <span className="metric-mono" style={{fontSize: 30, fontWeight:600, color: "var(--success)"}}>
                        ฿{net.toLocaleString()}
                      </span>
                      <Pill variant="success">▲ {margin}% margin</Pill>
                    </div>
                  </div>
                  <div className="pl-net-ring" style={{"--p": margin}}>
                    <div className="pl-net-ring-val">{margin}%</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Panel>

        <Panel title="ยอดเงินคงเหลือในบัญชี" eyebrow="BANK ACCOUNTS · 3 ACTIVE">
          {(() => {
            const banks = [
              { name: "ไทยพาณิชย์", code: "SCB", acct: "xxx-x-2841-x", bal: 524380, trend: [320,340,360,380,420,460,480,500,520,524], color: "#4E1B7B" },
              { name: "กสิกรไทย", code: "KBANK", acct: "xxx-x-7714-x", bal: 312200, trend: [220,240,250,260,280,290,300,305,310,312], color: "#0C7C45" },
              { name: "กรุงเทพ", code: "BBL", acct: "xxx-x-9924-x", bal: 86420, trend: [60,68,72,78,80,82,85,86,86,86], color: "#1E3A8A" },
            ];
            const total = banks.reduce((a,b) => a + b.bal, 0);
            return (
              <div className="col" style={{gap: 12}}>
                <div className="bank-total">
                  <div>
                    <div className="ledger-eyebrow">รวมทุกบัญชี</div>
                    <div className="metric-mono" style={{fontSize: 26, fontWeight:600, color:"var(--amber-300)", marginTop:4}}>
                      ฿{total.toLocaleString()}
                    </div>
                  </div>
                  <Pill variant="success">▲ +฿82,400 7 วัน</Pill>
                </div>
                {banks.map((b, i) => (
                  <div key={i} className="bank-card">
                    <div className="bank-badge" style={{background: b.color}}>{b.code}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>{b.name}</div>
                      <div className="mono" style={{fontSize:11, color:"var(--fg-3)", marginTop:2}}>{b.acct}</div>
                    </div>
                    <Sparkline data={b.trend} color={b.color === "#1E3A8A" ? "var(--cyan-400)" : b.color} width={56} height={24}/>
                    <div className="metric-mono" style={{fontSize: 15, fontWeight:600, color:"var(--fg-1)", minWidth:96, textAlign:"right"}}>
                      ฿{b.bal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Panel>
      </div>

      {/* ─── Fixed Expenses + Dividend Distribution ──────── */}
      <div className="grid-pl">
        <Panel title="รายจ่ายคงที่ประจำเดือน" eyebrow="FIXED MONTHLY COSTS"
          actions={<Pill variant="default">หักทุกวันที่ 1</Pill>}>
          {(() => {
            const fx = [
              { label: "เงินเดือนช่าง", sub: "ช่างซ่อม 3 คน · ผู้ช่วย 1 คน", amt: 45000, icon: "wrench", color: "var(--amber-500)" },
              { label: "ค่าเช่าอู่", sub: "สัญญา 3 ปี · หมดอายุ มี.ค. 2027", amt: 35000, icon: "home", color: "var(--cyan-400)" },
              { label: "ค่าน้ำ-ไฟ-เน็ต", sub: "ค่าเฉลี่ย 3 เดือนล่าสุด", amt: 3000, icon: "bolt", color: "#A78BFA" },
            ];
            const total = fx.reduce((a,b)=>a+b.amt,0);
            const max = Math.max(...fx.map(f=>f.amt));
            return (
              <div className="col" style={{gap: 10}}>
                {fx.map((f, i) => (
                  <div key={i} className="fixed-row">
                    <div className="fixed-ico" style={{color: f.color, borderColor: f.color}}>
                      <Icon name={f.icon} size={18}/>
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>{f.label}</div>
                      <div style={{fontSize:11, color:"var(--fg-3)", marginTop:2}}>{f.sub}</div>
                      <div className="fixed-bar"><div className="fixed-bar-fill" style={{width: (f.amt/max*100)+"%", background: f.color}}></div></div>
                    </div>
                    <div className="metric-mono" style={{fontSize:16, fontWeight:600, color:"var(--fg-1)", minWidth:96, textAlign:"right"}}>
                      ฿{f.amt.toLocaleString()}
                    </div>
                  </div>
                ))}
                <div className="divider" style={{margin:"6px 0"}}></div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span style={{fontFamily:"var(--font-sans)", fontSize:12, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--fg-3)"}}>รวม / เดือน</span>
                  <span className="metric-mono" style={{fontSize:22, fontWeight:600, color:"var(--danger)"}}>−฿{total.toLocaleString()}</span>
                </div>
              </div>
            );
          })()}
        </Panel>

        <Panel title="ส่วนแบ่งเงินปันผล" eyebrow="DIVIDEND DISTRIBUTION · 4 PARTNERS"
          actions={<button className="btn btn-primary"><Icon name="check" size={14}/> จ่ายปันผล</button>}>
          {(() => {
            const net = 842310 - 218600 - 83000 - 156480; // mirrors P&L
            const dividendPool = Math.round(net * dividendPct / 100);
            const partners = [
              { name: "ออย",        role: "Managing Partner", share: 25, init: "อย", color: "var(--amber-500)" },
              { name: "กาย",        role: "Operations",       share: 25, init: "กย", color: "var(--cyan-400)" },
              { name: "พงษ์",       role: "Finance",          share: 25, init: "พง", color: "#A78BFA" },
              { name: "โอ้ (เบียร์)", role: "Workshop Lead",    share: 25, init: "อ้", color: "var(--success)" },
            ];
            return (
              <div className="col" style={{gap: 14}}>
                <div className="dividend-hero">
                  <div>
                    <div className="ledger-eyebrow">ปันผลที่จะแจก ({dividendPct}% ของกำไรสุทธิ)</div>
                    <div className="metric-mono" style={{fontSize: 26, fontWeight:600, color: "var(--amber-300)", marginTop:4}}>
                      ฿{dividendPool.toLocaleString()}
                    </div>
                  </div>
                  <div className="dividend-pie">
                    <svg viewBox="0 0 100 100" width="76" height="76">
                      {(() => {
                        let a = -90;
                        return partners.map((p, i) => {
                          const sweep = p.share * 3.6;
                          const x1 = 50 + 40 * Math.cos((a) * Math.PI/180);
                          const y1 = 50 + 40 * Math.sin((a) * Math.PI/180);
                          const x2 = 50 + 40 * Math.cos((a + sweep) * Math.PI/180);
                          const y2 = 50 + 40 * Math.sin((a + sweep) * Math.PI/180);
                          const large = sweep > 180 ? 1 : 0;
                          const d = `M50,50 L${x1},${y1} A40,40 0 ${large},1 ${x2},${y2} Z`;
                          a += sweep;
                          return <path key={i} d={d} fill={p.color} opacity={0.92}/>;
                        });
                      })()}
                      <circle cx="50" cy="50" r="22" fill="var(--bg-2)"/>
                    </svg>
                  </div>
                </div>

                {/* Dividend % selector */}
                <div className="div-pct">
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                    <span style={{fontFamily:"var(--font-sans)", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--fg-3)", fontWeight:600}}>สัดส่วนจ่ายปันผล</span>
                    <span className="metric-mono" style={{fontSize:14, fontWeight:600, color:"var(--amber-300)"}}>{dividendPct}%</span>
                  </div>
                  <div className="chip-row">
                    {[30, 40, 50, 60, 70, 80, 100].map(p => (
                      <button key={p} type="button" className={"chip" + (dividendPct === p ? " on" : "")} onClick={() => setDividendPct(p)}>{p}%</button>
                    ))}
                  </div>
                  <input type="range" min="0" max="100" step="5" value={dividendPct}
                    onChange={e => setDividendPct(Number(e.target.value))}
                    className="div-slider" style={{marginTop:10}}/>
                </div>
                {partners.map((p, i) => {
                  const payout = Math.round(dividendPool * p.share / 100);
                  return (
                    <div key={i} className="partner-row">
                      <div className="partner-avatar" style={{background: p.color}}>{p.init}</div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap"}}>
                          <span style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>{p.name}</span>
                          <span className="mono" style={{fontSize:11, color:p.color, fontWeight:600}}>{p.share}%</span>
                        </div>
                        <div style={{fontSize:11, color:"var(--fg-3)", marginTop:2}}>{p.role}</div>
                        <div className="partner-bar"><div className="partner-bar-fill" style={{width: p.share*2.5 + "%", background: p.color, boxShadow:`0 0 6px ${p.color}`}}></div></div>
                      </div>
                      <div style={{textAlign:"right", minWidth:100}}>
                        <div className="metric-mono" style={{fontSize:15, fontWeight:600, color:"var(--success)"}}>
                          +฿{payout.toLocaleString()}
                        </div>
                        <div className="mono" style={{fontSize:10, color:"var(--fg-3)", marginTop:2}}>รอจ่าย</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </Panel>
      </div>

      <Panel title="ธุรกรรมล่าสุด" eyebrow={`TRANSACTIONS · ${txns.length} ENTRIES TODAY`}
        actions={<>
          <button className="btn btn-ghost"><Icon name="filter" size={14}/> กรอง</button>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> ส่งออก</button>
          <button className="btn btn-primary" onClick={() => setOpen(true)}><Icon name="plus" size={14}/> บันทึกรายการ</button>
        </>}>
        <table className="tbl">
          <thead><tr>
            <th>TIME</th><th>TXN #</th><th>รายการ</th><th>หมวด</th><th>วิธีชำระ</th><th>สลิป</th>
            <th style={{textAlign:"right"}}>ยอด</th>
          </tr></thead>
          <tbody>
            {txns.map((t, i) => (
              <tr key={t.id} className={i === 0 && txns.length > seed.length ? "row-new" : ""}>
                <td className="mono" style={{color: "var(--fg-3)"}}>{t.t}</td>
                <td className="mono">{t.id}</td>
                <td>
                  <div style={{color: "var(--fg-1)", fontWeight: 500}}>{t.label}</div>
                  <div style={{fontSize: 11, color: "var(--fg-3)", marginTop: 2}}>{t.svc}</div>
                </td>
                <td><span style={{fontSize: 11, color: "var(--fg-2)"}}>{t.cat}</span></td>
                <td><Pill variant={t.method === "QR" ? "info" : t.method === "เงินสด" ? "brand" : "default"}>{t.method}</Pill></td>
                <td>
                  {t.slip ? (
                    <button type="button" className="slip-thumb" onClick={() => setViewSlip(t)} title={t.slipName}>
                      <img src={t.slip} alt=""/>
                      <span className="slip-thumb-badge"><Icon name="image" size={9}/></span>
                    </button>
                  ) : (
                    <span style={{fontFamily:"var(--font-mono)", fontSize:11, color:"var(--fg-4)"}}>—</span>
                  )}
                </td>
                <td className="num" style={{color: t.type === "in" ? "var(--success)" : "var(--danger)", fontWeight: 600}}>
                  {t.type === "in" ? "+" : "−"}฿{t.amt.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && <TxnModal onClose={() => setOpen(false)} onSave={addTxn}/>}
      {viewSlip && <SlipViewer txn={viewSlip} onClose={() => setViewSlip(null)}/>}
      {toast && (
        <div className="toast-finance">
          <span className={"toast-dot " + (toast.type === "in" ? "in" : "out")}></span>
          <div>
            <div style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>
              บันทึก{toast.type === "in" ? "รายรับ" : "รายจ่าย"}สำเร็จ
            </div>
            <div className="mono" style={{fontSize:11, color:"var(--fg-3)", marginTop:2}}>
              {toast.id} · {toast.type === "in" ? "+" : "−"}฿{Number(toast.amt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Transaction modal ────────────────────────────────────────────
const TxnModal = ({ onClose, onSave }) => {
  const [type, setType] = useState("in");
  const [amt, setAmt] = useState("");
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("เงินสด");
  const [cat, setCat] = useState("บริการซ่อม");
  const [slip, setSlip] = useState(null);
  const [slipName, setSlipName] = useState(null);
  const [drag, setDrag] = useState(false);
  const fileRef = React.useRef(null);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => { setSlip(e.target.result); setSlipName(file.name); };
    r.readAsDataURL(file);
  };
  const onPick = (e) => readFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    readFile(e.dataTransfer.files?.[0]);
  };
  const onPaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith("image/"));
    if (item) readFile(item.getAsFile());
  };
  React.useEffect(() => {
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const catsIn  = ["บริการซ่อม", "ขายอะไหล่", "ค่าตรวจสภาพ", "อื่นๆ"];
  const catsOut = ["อะไหล่", "ค่าแรง", "ค่าน้ำ-ไฟ", "ค่าเช่า", "อุปกรณ์", "อื่นๆ"];
  const cats = type === "in" ? catsIn : catsOut;
  const methods = ["เงินสด", "โอน", "QR", "บัตรเครดิต"];

  const canSave = label.trim() && Number(amt) > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ type, amt, label: label.trim(), note: note.trim(), method, cat, slip, slipName });
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{fontSize:10}}>NEW TRANSACTION</div>
            <div className="h3" style={{marginTop:4}}>บันทึกรายรับ / รายจ่าย</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Type toggle */}
          <div className="form-row">
            <label className="form-label">ประเภท</label>
            <div className="type-toggle">
              <button type="button" className={"tt in"  + (type === "in"  ? " on" : "")} onClick={() => { setType("in");  setCat(catsIn[0]); }}>
                <span className="tt-icon">+</span> รายรับ
              </button>
              <button type="button" className={"tt out" + (type === "out" ? " on" : "")} onClick={() => { setType("out"); setCat(catsOut[0]); }}>
                <span className="tt-icon">−</span> รายจ่าย
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-row">
            <label className="form-label">จำนวนเงิน (฿)</label>
            <div className="amt-wrap">
              <span className="amt-currency">฿</span>
              <input type="number" inputMode="decimal" min="0" step="1"
                className={"amt-input " + type} value={amt}
                onChange={e => setAmt(e.target.value)} placeholder="0" autoFocus />
            </div>
            <div className="quick-amts">
              {[500, 1000, 2000, 5000, 10000].map(q => (
                <button key={q} type="button" className="qa" onClick={() => setAmt(String(q))}>+{q.toLocaleString()}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-row">
            <label className="form-label">รายการ</label>
            <input type="text" className="text-input" value={label} onChange={e=>setLabel(e.target.value)}
              placeholder={type === "in" ? "เช่น ชำระเงินสด · กท 8842" : "เช่น ซื้อกรองอากาศ ×4"} />
          </div>

          {/* Category */}
          <div className="form-row">
            <label className="form-label">หมวด</label>
            <div className="chip-row">
              {cats.map(c => (
                <button key={c} type="button" className={"chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Method */}
          <div className="form-row">
            <label className="form-label">วิธีชำระ</label>
            <div className="chip-row">
              {methods.map(m => (
                <button key={m} type="button" className={"chip" + (method === m ? " on" : "")} onClick={() => setMethod(m)}>{m}</button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="form-row">
            <label className="form-label">หมายเหตุ <span style={{color:"var(--fg-4)", fontWeight:400}}>(ไม่บังคับ)</span></label>
            <input type="text" className="text-input" value={note} onChange={e=>setNote(e.target.value)}
              placeholder="เพิ่มรายละเอียด…" />
          </div>

          {/* Slip / Receipt upload */}
          <div className="form-row">
            <label className="form-label">สลิป / ใบเสร็จ <span style={{color:"var(--fg-4)", fontWeight:400}}>(ไม่บังคับ · ลากหรือวางไฟล์)</span></label>
            {!slip ? (
              <div
                className={"dropzone" + (drag ? " drag" : "")}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}>
                <Icon name="upload" size={24}/>
                <div className="dz-title">ลากไฟล์มาวาง · คลิกเพื่อเลือก · หรือวาง (⌘V)</div>
                <div className="dz-sub">JPG / PNG / WEBP · สูงสุด 5MB</div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick}/>
              </div>
            ) : (
              <div className="slip-preview">
                <img src={slip} alt={slipName}/>
                <div className="slip-meta">
                  <Icon name="image" size={16}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="slip-name">{slipName}</div>
                    <div className="slip-sub">แนบสำเร็จ · พร้อมยืนยัน</div>
                  </div>
                  <button type="button" className="slip-remove" onClick={() => { setSlip(null); setSlipName(null); }}>
                    <Icon name="x" size={14}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-foot">
          <div className="modal-preview">
            <span className="mono" style={{fontSize:11, color:"var(--fg-3)"}}>PREVIEW</span>
            <span className={"preview-amt " + type}>
              {type === "in" ? "+" : "−"}฿{Number(amt || 0).toLocaleString()}
            </span>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary" disabled={!canSave} style={!canSave ? {opacity:0.4, pointerEvents:"none"} : {}}>
              <Icon name="check" size={14}/> บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// ─── Slip viewer (lightbox) ──────────────────────────────────
const SlipViewer = ({ txn, onClose }) => (
  <div className="slip-viewer-scrim" onClick={onClose}>
    <div className="slip-viewer" onClick={e => e.stopPropagation()}>
      <div className="slip-viewer-head">
        <div>
          <div className="eyebrow" style={{fontSize:10}}>SLIP / RECEIPT</div>
          <div style={{fontFamily:"var(--font-display)", fontWeight:600, fontSize:16, marginTop:4, color:"var(--fg-1)"}}>
            {txn.id} · {txn.label}
          </div>
          <div className="mono" style={{fontSize:11, color:"var(--fg-3)", marginTop:4}}>
            {txn.t} · {txn.cat} · <span style={{color: txn.type === "in" ? "var(--success)" : "var(--danger)"}}>
              {txn.type === "in" ? "+" : "−"}฿{txn.amt.toLocaleString()}
            </span>
          </div>
        </div>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="slip-viewer-body">
        <img src={txn.slip} alt={txn.slipName}/>
      </div>
      <div className="slip-viewer-foot">
        <span className="mono" style={{fontSize:11, color:"var(--fg-3)"}}>{txn.slipName}</span>
        <a href={txn.slip} download={txn.slipName} className="btn btn-secondary">
          <Icon name="download" size={14}/> ดาวน์โหลด
        </a>
      </div>
    </div>
  </div>
);

Object.assign(window, { FinanceScreen });
