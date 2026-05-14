/* global React, KPI, Panel, Pill, Icon */
const { useState: useStateR } = React;

const RepairScreen = () => {
  const [filter, setFilter] = useStateR("all");
  const jobs = [
    { id: "MZG-0824", plate: "กท 8842", customer: "คุณวิภา ตันสุข", mech: "ช่างเอก", svc: "เปลี่ยนน้ำมัน + ตรวจเบรก", status: "done", in: "09:14", est: "11:30", price: 8400, p: 100 },
    { id: "MZG-0823", plate: "ฮต 7711", customer: "คุณเสริม ใจดี", mech: "ช่างต้น", svc: "ซ่อมเครื่องยนต์ — น้ำมันรั่ว", status: "progress", in: "10:32", est: "16:00", price: 14800, p: 64 },
    { id: "MZG-0822", plate: "ขฉ 1124", customer: "คุณเอ๋ นันทพร", mech: "ช่างเอก", svc: "ตรวจเช็คระยะ 10,000 km", status: "progress", in: "11:08", est: "15:20", price: 3200, p: 38 },
    { id: "MZG-0821", plate: "1กม 9024", customer: "คุณสมชัย", mech: "ช่างปอ", svc: "เปลี่ยนกรองอากาศ", status: "waitparts", in: "11:42", est: "พรุ่งนี้", price: 1850, p: 22 },
    { id: "MZG-0820", plate: "3ขจ 5582", customer: "บริษัท ABC ขนส่ง", mech: "ช่างต้น", svc: "ซ่อมช่วงล่าง — สั่งซ่อม 5 วันก่อน", status: "overdue", in: "5 d ago", est: "OVERDUE", price: 22000, p: 88 },
    { id: "MZG-0819", plate: "2บก 4471", customer: "คุณนภา", mech: "—", svc: "เคลมประกัน — รอเอกสาร", status: "hold", in: "12:18", est: "—", price: 18500, p: 10 },
  ];
  const statusMap = {
    done: { label: "เสร็จสิ้น", variant: "success" },
    progress: { label: "กำลังซ่อม", variant: "info" },
    waitparts: { label: "รออะไหล่", variant: "warn" },
    overdue: { label: "เกินกำหนด", variant: "danger" },
    hold: { label: "รอเอกสาร", variant: "default" },
  };
  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="col fade-in" style={{gap: 20}}>
      <div className="kpi-grid">
        <KPI label="งานทั้งหมด" value="12" unit="คัน" delta="3 รับใหม่วันนี้" deltaDir="up" live accent="cyan"/>
        <KPI label="กำลังซ่อม" value="6" unit="คัน" accent="amber"/>
        <KPI label="รออะไหล่" value="3" unit="คัน" accent="amber" delta="ETA 1-3 วัน" deltaDir="up"/>
        <KPI label="เกินกำหนด" value="4" unit="คัน" delta="เร่งติดตาม" deltaDir="down" accent="amber"/>
      </div>

      <Panel title="คิวงานวันนี้" eyebrow="JOB QUEUE"
        actions={<>
          <div className="filter-tabs">
            {[
              ["all", "ทั้งหมด"],["progress","กำลังซ่อม"],["waitparts","รออะไหล่"],["overdue","เกินกำหนด"],["done","เสร็จสิ้น"]
            ].map(([k,l]) => (
              <button key={k} className={"ft" + (filter===k?" on":"")} onClick={()=>setFilter(k)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>เปิดงานซ่อมใหม่</button>
        </>}>
        <table className="tbl">
          <thead><tr>
            <th>JOB #</th><th>ทะเบียน</th><th>ลูกค้า</th><th>บริการ</th><th>ช่าง</th>
            <th>เข้า</th><th>ETA</th><th>สถานะ</th><th style={{textAlign:"right"}}>มูลค่า</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id}>
                <td className="mono">#{j.id}</td>
                <td className="plate">{j.plate}</td>
                <td>{j.customer}</td>
                <td>
                  <div style={{color:"var(--fg-1)", fontWeight:500}}>{j.svc}</div>
                  <div className="stock-bar" style={{marginTop:6, width: 140}}>
                    <div className="stock-bar-fill" style={{
                      width: j.p+"%",
                      background: j.status==="overdue"?"var(--danger)":j.status==="waitparts"?"var(--warn)":j.status==="done"?"var(--success)":"linear-gradient(90deg,var(--amber-500),var(--amber-300))"
                    }}></div>
                  </div>
                </td>
                <td className="mono" style={{color: "var(--fg-2)"}}>{j.mech}</td>
                <td className="mono" style={{color: "var(--fg-3)"}}>{j.in}</td>
                <td className="mono" style={{color: j.status==="overdue"?"var(--danger)":"var(--fg-2)"}}>{j.est}</td>
                <td><Pill variant={statusMap[j.status].variant} pulse={j.status==="progress" || j.status==="overdue"}>{statusMap[j.status].label}</Pill></td>
                <td className="num">฿{j.price.toLocaleString()}</td>
                <td><button className="icon-btn" style={{width:28, height:28}}><Icon name="more" size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

Object.assign(window, { RepairScreen });
