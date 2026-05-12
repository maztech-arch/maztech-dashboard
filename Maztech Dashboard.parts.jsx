/* global React, KPI, Panel, Pill, Icon */
const PartsScreen = () => {
  const parts = [
    { sku: "MZP-OIL-5W30", name: "น้ำมันเครื่อง 5W-30 (4L)", brand: "Mobil", qty: 24, min: 10, max: 60, price: 1280, used30: 18, status: "ok" },
    { sku: "MZP-AIR-T01", name: "กรองอากาศ Toyota Corolla", brand: "Toyota OEM", qty: 3, min: 8, max: 40, price: 380, used30: 12, status: "danger" },
    { sku: "MZP-BRK-FRONT", name: "ผ้าเบรกหน้า Honda Civic", brand: "Bendix", qty: 8, min: 6, max: 24, price: 1450, used30: 9, status: "warn" },
    { sku: "MZP-OIL-FIL", name: "ไส้กรองน้ำมัน Universal", brand: "Bosch", qty: 42, min: 20, max: 80, price: 220, used30: 38, status: "ok" },
    { sku: "MZP-WIPER-22", name: "ใบปัดน้ำฝน 22\" Pair", brand: "Bosch", qty: 2, min: 6, max: 20, price: 580, used30: 5, status: "danger" },
    { sku: "MZP-COOL-G", name: "น้ำยาหล่อเย็น Green (4L)", brand: "Caltex", qty: 14, min: 8, max: 30, price: 420, used30: 7, status: "ok" },
    { sku: "MZP-SPARK-IRI", name: "หัวเทียน Iridium (set 4)", brand: "NGK", qty: 5, min: 6, max: 18, price: 1980, used30: 4, status: "warn" },
  ];

  return (
    <div className="col fade-in" style={{gap: 20}}>
      <div className="kpi-grid">
        <KPI label="SKU ทั้งหมด" value="284" unit="รายการ" accent="cyan"/>
        <KPI label="ใกล้หมด (ต่ำกว่า min)" value="12" unit="SKU" delta="สั่งซื้อด่วน" deltaDir="down" accent="amber"/>
        <KPI label="หมดสต็อก" value="3" unit="SKU" delta="เร่งสั่งวันนี้" deltaDir="down" accent="amber"/>
        <KPI label="มูลค่าสต็อก" value="284600" accent="success" spark={[220,232,240,248,255,262,268,275,280,284]}/>
      </div>

      <div className="grid-2">
        <Panel title="สถานะสต็อก — รายการสำคัญ" eyebrow="INVENTORY · TOP MOVERS"
          actions={<>
            <button className="btn btn-ghost"><Icon name="search" size={14}/> ค้นหา SKU</button>
            <button className="btn btn-primary"><Icon name="plus" size={14}/> รับเข้าสต็อก</button>
          </>}>
          <table className="tbl">
            <thead><tr><th>SKU</th><th>ชื่อ / ยี่ห้อ</th><th>คงเหลือ</th><th>ใช้ใน 30 วัน</th><th style={{textAlign:"right"}}>ราคา</th></tr></thead>
            <tbody>
              {parts.map(p => (
                <tr key={p.sku}>
                  <td className="mono" style={{fontSize: 11, color: "var(--fg-3)"}}>{p.sku}</td>
                  <td>
                    <div style={{color:"var(--fg-1)", fontWeight:500, fontSize: 13}}>{p.name}</div>
                    <div style={{fontSize: 11, color: "var(--fg-3)", marginTop:2}}>{p.brand}</div>
                  </td>
                  <td style={{minWidth: 160}}>
                    <div style={{display:"flex", alignItems:"center", gap:8, marginBottom: 4}}>
                      <span className="metric-mono" style={{color: p.status==="danger"?"var(--danger)":p.status==="warn"?"var(--warn)":"var(--fg-1)", fontWeight: 600}}>{p.qty}</span>
                      <span style={{fontSize: 10, color: "var(--fg-4)"}}>/ max {p.max}</span>
                      {p.status === "danger" && <Pill variant="danger" pulse>หมด</Pill>}
                      {p.status === "warn" && <Pill variant="warn">ต่ำ</Pill>}
                    </div>
                    <div className="stock-bar">
                      <div className={"stock-bar-fill " + (p.status==="danger"?"danger":p.status==="warn"?"warn":"")} style={{width: (p.qty/p.max*100) + "%"}}></div>
                    </div>
                  </td>
                  <td className="mono" style={{color:"var(--fg-2)"}}>{p.used30} ชิ้น</td>
                  <td className="num">฿{p.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="ต้องสั่งซื้อด่วน" eyebrow="REORDER ALERTS"
          actions={<button className="btn btn-primary">สร้าง PO ทั้งหมด</button>}>
          <div className="col" style={{gap: 10}}>
            {parts.filter(p => p.status !== "ok").map(p => (
              <div key={p.sku} className="alert-card">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap: 8}}>
                  <div>
                    <div style={{color:"var(--fg-1)", fontWeight:600, fontSize:13}}>{p.name}</div>
                    <div className="mono" style={{fontSize: 11, color: "var(--fg-3)", marginTop: 2}}>{p.sku} · {p.brand}</div>
                  </div>
                  <Pill variant={p.status === "danger" ? "danger" : "warn"} pulse>
                    {p.status === "danger" ? "หมด" : "ต่ำ"}
                  </Pill>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop: 10}}>
                  <span className="mono" style={{fontSize: 11, color: "var(--fg-3)"}}>
                    เหลือ <b style={{color:"var(--fg-1)"}}>{p.qty}</b> / ต้อง <b style={{color:"var(--amber-300)"}}>{p.max - p.qty}</b>
                  </span>
                  <button className="btn btn-secondary" style={{padding:"4px 10px", fontSize: 11}}>สั่งซื้อ</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

Object.assign(window, { PartsScreen });
