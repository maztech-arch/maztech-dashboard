// Appointments Component
const AppointmentsScreen = () => {
  const [appointments, setAppointments] = React.useState([
    { id: 1, date: '2025-05-14', time: '08:00', customer: 'นายสมชาย กิจการ', service: 'เปลี่ยนน้ำมันและตรวจสภาพ', status: 'ยืนยันแล้ว', phone: '087-123-4567' },
    { id: 2, date: '2025-05-14', time: '09:30', customer: 'นายวิทยา รถดี', service: 'ซ่อมเบรก', status: 'ยืนยันแล้ว', phone: '081-345-6789' },
    { id: 3, date: '2025-05-14', time: '11:00', customer: 'นางสาวลดา อ่อนหวาน', service: 'เปลี่ยนยาง', status: 'รอยืนยัน', phone: '089-234-5678' },
    { id: 4, date: '2025-05-14', time: '14:00', customer: 'นางสาวสวรรค์ การโดยสาร', service: 'เอาเชื้อสาหร่าย', status: 'เสร็จสิ้น', phone: '088-456-7890' },
    { id: 5, date: '2025-05-15', time: '10:00', customer: 'นายสมชาย กิจการ', service: 'ตรวจหลังจากซ่อม', status: 'รอยืนยัน', phone: '087-123-4567' },
  ]);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    customer: '',
    service: '',
    status: 'รอยืนยัน'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ยืนยันแล้ว':
        return '#28a745';
      case 'รอยืนยัน':
        return '#ffc107';
      case 'เสร็จสิ้น':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const handleAddAppointment = () => {
    if (formData.customer && formData.service) {
      const newAppointment = {
        id: appointments.length + 1,
        ...formData,
        phone: ''
      };
      setAppointments([...appointments, newAppointment]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        customer: '',
        service: '',
        status: 'รอยืนยัน'
      });
      setShowAddModal(false);
    }
  };

  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = appointments.filter(a => a.date > new Date().toISOString().split('T')[0]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>ตารางนัดหมาย</h2>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          เพิ่มนัดหมายใหม่
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          📅 วันนี้ ({todayAppointments.length} นัด)
        </h3>
        {todayAppointments.length === 0 ? (
          <p style={{ color: '#999' }}>ไม่มีนัดหมายในวันนี้</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {todayAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  border: '1px solid #ddd',
                  borderLeft: `4px solid ${getStatusColor(apt.status)}`,
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '15px',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                  {apt.time}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{apt.customer}</h4>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>{apt.service}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{apt.phone}</p>
                </div>
                <span style={{
                  padding: '5px 10px',
                  backgroundColor: getStatusColor(apt.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          📌 นัดหมายข้างหน้า ({upcomingAppointments.length} นัด)
        </h3>
        {upcomingAppointments.length === 0 ? (
          <p style={{ color: '#999' }}>ไม่มีนัดหมายข้างหน้า</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {upcomingAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  border: '1px solid #ddd',
                  borderLeft: `4px solid ${getStatusColor(apt.status)}`,
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  display: 'grid',
                  gridTemplateColumns: 'auto 100px 1fr auto',
                  gap: '15px',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {apt.date}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
                  {apt.time}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{apt.customer}</h4>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>{apt.service}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{apt.phone}</p>
                </div>
                <span style={{
                  padding: '5px 10px',
                  backgroundColor: getStatusColor(apt.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>เพิ่มนัดหมายใหม่</h2>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="text"
              placeholder="ชื่อลูกค้า"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="text"
              placeholder="บริการ/ประเภท"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            >
              <option value="รอยืนยัน">รอยืนยัน</option>
              <option value="ยืนยันแล้ว">ยืนยันแล้ว</option>
              <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            </select>
            <button
              onClick={handleAddAppointment}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              บันทึก
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
