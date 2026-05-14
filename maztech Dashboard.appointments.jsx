/* global React, KPI, Panel, Pill, Icon */
const AppointmentsScreen = () => {
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"];
  const nums = [11, 12, 13, 14, 15, 16, 17];
  // events: [day(0-6), startHour, durationHours, title, plate, type]
  const events = [
    { d: 0, h: 9, len: 1.5, t: "เปลี่ยนน้ำมัน", p: "กท 8842", v: "amber" },
    { d: 0, h: 13, len: 2, t: "ตรวจระยะ 20k", p: "2บก 4471", v: "cyan" },
    { d: 1, h: 10, len: 2, t: "ซ่อมเครื่อง", p: "ฮต 7711", v: "amber" },
    { d: 1, h: 14, len: 1, t: "เปลี่ยนยาง 4 เส้น", p: "3ขจ 5582", v: "purple" },
    { d: 2, h: 9, len: 1, t: "เช็คเบรก", p: "ขฉ 1124", v: "success" },
    { d: 2, h: 11, len: 2, t: "Fleet · ABC ขนส่ง", p: "× 3 คัน", v: "cyan" },
    { d: 2, h: 15, len: 1.5, t: "เปลี่ยนน้ำมัน", p: "1กม 9024", v: "amber" },
    { d: 3, h: 10, len: 3, t: "Overhaul เครื่อง", p: "9ขก 7754", v: "amber" },
    { d: 3, h: 14, len: 1, t: "ติดฟิล์ม", p: "2มท 1199", v: "purple" },
    { d: 4, h: 9, len: 2, t: "เคลมประกัน", p: "5คล 8821", v: "cyan" },
    { d: 4, h: 13, len: 2, t: "ซ่อมช่วงล่าง", p: "7รย 4422", v: "amber" },
    { d: 5, h: 10, len: 4, t: "Fleet maintenance · 4 คัน", p: "บริษัท ABC", v: "cyan" },
    { d: 6, h: 11, len: 1, t: "VIP — คุณวิภา", p: "Detailing", v: "success" },
  ];

  const todayD = 2; // Wed
  const todayList = events.filter(e => e.d === todayD).sort((a,b)=>a.h-b.h);

  return (
    <div className="col fade-in" style={{gap: 20}}>
      <div className="kpi-grid">
        <KPI label="นัดสัปดาห์นี้" value="38" unit="งาน" delta="6 จากออนไลน์" deltaDir="up" accent="cyan"/>
        <KPI label="วันนี้" value="7" unit="คิว" delta="2 รอยืนยัน" deltaDir="up" live accent="amber"/>
        <KPI label="ช่อง/ชั่วโมงว่าง" value="14" unit="ช่อง" accent="success"/>
        <KPI label="อัตราการมาตามนัด" value="92" unit="%" delta="No-show 3 ครั้ง" deltaDir="up" accent="success"/>
      </div>

      <div className="row" style={{gap: 16, alignItems:"flex-start"}}>
        <Panel title="ตารางสัปดาห์นี้" eyebrow="WEEK · 11 – 17 พ.ค. 2026" className="grow"
          actions={<>
            <div className="filter-tabs">
              <button className="ft">วัน</button>
              <button className="ft on">สัปดาห์</button>
              <button className="ft">เดือน</button>
            </div>
            <button className="btn btn-primary"><Icon name="plus" size={14}/> สร้างนัด</button>
          </>}>
          <div className="cal-grid">
            <div className="cal-header"></div>
            {days.map((d, i) => (
              <div key={i} className="cal-header">
                <div className="cal-day-label">{d}</div>
                <div className="cal-day-num" style={i===todayD?{color:"var(--amber-400)"}:{}}>{nums[i]}</div>
              </div>
            ))}
            {hours.map((h, hi) => (
              <React.Fragment key={hi}>
                <div className="cal-time">{h}</div>
                {days.map((_, di) => {
                  const evs = events.filter(e => e.d === di && Math.floor(e.h) === hi + 9);
                  return (
                    <div key={di} className="cal-cell" style={di===todayD?{background:"rgba(255,138,0,0.03)"}:{}}>
                      {evs.map((e, ei) => (
                        <div key={ei} className={"cal-event " + e.v} style={{
                          top: ((e.h - Math.floor(e.h)) * 56) + 4 + "px",
                          height: (e.len * 56 - 6) + "px"
                        }}>
                          <div className="cal-event-title">{e.t}</div>
                          <div className="cal-event-meta">{e.p}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </Panel>

        <Panel title="คิวพุธ · วันนี้" eyebrow="TODAY · 13 MAY" className="" >
          <div className="col" style={{gap: 10, width: 280}}>
            {todayList.map((e, i) => (
              <div key={i} className="today-row">
                <span className="time-chip">{String(e.h).padStart(2,"0")}:00</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:600, color:"var(--fg-1)"}}>{e.t}</div>
                  <div className="mono" style={{fontSize:11, color:"var(--fg-3)", marginTop:2}}>{e.p}</div>
                </div>
                <span className={"dot-status " + e.v}></span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

Object.assign(window, { AppointmentsScreen });
