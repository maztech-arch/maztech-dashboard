// Customers Component
const CustomersScreen = () => {
  const [customers, setCustomers] = React.useState([
    { id: 1, name: 'นายสมชาย กิจการ', phone: '087-123-4567', email: 'somchai@email.com', visits: 12, lastVisit: '2025-05-10', totalSpent: '45,000' },
    { id: 2, name: 'นางสาวลดา อ่อนหวาน', phone: '089-234-5678', email: 'ladaon@email.com', visits: 8, lastVisit: '2025-05-08', totalSpent: '28,500' },
    { id: 3, name: 'นายวิทยา รถดี', phone: '081-345-6789', email: 'wittaya@email.com', visits: 15, lastVisit: '2025-05-11', totalSpent: '62,000' },
    { id: 4, name: 'นางสาวสวรรค์ การโดยสาร', phone: '088-456-7890', email: 'sawad@email.com', visits: 5, lastVisit: '2025-04-25', totalSpent: '15,000' },
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', phone: '', email: '' });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (formData.name && formData.phone) {
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
        visits: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        totalSpent: '0'
      };
      setCustomers([...customers, newCustomer]);
      setFormData({ name: '', phone: '', email: '' });
      setShowAddModal(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>ลูกค้าทั้งหมด</h2>
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
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      <input
        type="text"
        placeholder="ค้นหาชื่อหรือเบอร์โทร..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
        {filteredCustomers.map(customer => (
          <div
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer',
              backgroundColor: selectedCustomer?.id === customer.id ? '#e3f2fd' : 'white',
              transition: 'all 0.3s'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{customer.name}</h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              📞 {customer.phone}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              📧 {customer.email}
            </p>
            <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <p style={{ margin: '5px 0', fontSize: '12px' }}>
              <strong>เยี่ยม:</strong> {customer.visits} ครั้ง
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>
              <strong>ครั้งล่าสุด:</strong> {customer.lastVisit}
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>
              <strong>รวม:</strong> ฿{customer.totalSpent}
            </p>
          </div>
        ))}
      </div>

      {selectedCustomer && (
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
            <h2>{selectedCustomer.name}</h2>
            <p><strong>เบอร์โทร:</strong> {selectedCustomer.phone}</p>
            <p><strong>อีเมล:</strong> {selectedCustomer.email}</p>
            <p><strong>จำนวนเยี่ยม:</strong> {selectedCustomer.visits} ครั้ง</p>
            <p><strong>เยี่ยมครั้งล่าสุด:</strong> {selectedCustomer.lastVisit}</p>
            <p><strong>ยอดรวมใช้บริการ:</strong> ฿{selectedCustomer.totalSpent}</p>
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

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
            <h2>เพิ่มลูกค้าใหม่</h2>
            <input
              type="text"
              placeholder="ชื่อลูกค้า"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              placeholder="เบอร์โทร"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
              type="email"
              placeholder="อีเมล"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={handleAddCustomer}
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
