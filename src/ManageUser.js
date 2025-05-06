import React, { useEffect, useState } from 'react'; 
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';  // ตรวจสอบว่า db เชื่อมต่ออย่างถูกต้อง
import './CSS/ManageUser.css';

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);

  // ดึงคำร้องขอเปลี่ยนรหัสผ่านจาก Firestore
  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, 'password_requests'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRequests(data);  // อัพเดต state ของ React
  };

  // ส่ง request ไปยัง backend เพื่อรีเซ็ตรหัสผ่าน
  const handleResetPassword = async (email, id) => {
    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, id })
      });

      const result = await response.json();

      if (result.success) {
        alert('ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของผู้ใช้');
        
        // อัพเดตสถานะคำร้องใน Firestore เป็น "sent"
        await updateDoc(doc(db, 'password_requests', id), {
          status: 'sent',  // เปลี่ยนสถานะคำร้องเป็น "sent"
        });

        // รีโหลดคำร้องจาก Firestore เพื่อให้ UI อัพเดต
        fetchRequests(); // รีโหลดคำร้องใหม่จาก Firestore
      } else {
        alert(`ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดขณะติดต่อเซิร์ฟเวอร์');
    }
  };

  // ฟังก์ชันปฏิเสธคำร้อง
  const handleRejectRequest = async (id) => {
    try {
      // อัพเดตสถานะคำร้องเป็น "rejected"
      await updateDoc(doc(db, 'password_requests', id), {
        status: 'rejected'  // เปลี่ยนสถานะคำร้องเป็น "rejected"
      });
      alert('คำร้องถูกปฏิเสธ');
      fetchRequests(); // รีโหลดคำร้องใหม่จาก Firestore
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดขณะปฏิเสธคำร้อง');
    }
  };

  // ฟังก์ชันลบคำร้อง
  const handleDeleteRequest = async (id) => {
    try {
      // ลบคำร้องจาก Firestore
      await deleteDoc(doc(db, 'password_requests', id));
      alert('คำร้องถูกลบแล้ว');
      fetchRequests(); // รีโหลดคำร้องใหม่จาก Firestore
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดขณะลบคำร้อง');
    }
  };

  // เรียกใช้งาน fetchRequests เมื่อ component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="manage-users-container">
      <div className="navbar">
        <div className="brand">Meal-Master</div>
        <div className="nav-menu">
          <a href="/manage">จัดการเมนูอาหาร</a>
          <a href="/add">เพิ่มเมนูอาหาร</a>
          <a href="/users">จัดการบัญชีผู้ใช้</a>
        </div>
        <div className="profile-icon">👤</div>
      </div>

      <h2 className="page-title">คำร้องขอเปลี่ยนรหัสผ่าน</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>เบอร์โทร</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.email}</td>
              <td>{req.phone}</td>
              <td>{req.status || 'รอการดำเนินการ'}</td>
              <td>
                <button
                  className="reset-btn"
                  onClick={() => handleResetPassword(req.email, req.id)}
                  disabled={req.status === 'sent'} // ปิดปุ่มเมื่อสถานะเป็น "sent"
                >
                  ส่งลิงก์รีเซ็ตรหัส
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleRejectRequest(req.id)}
                  disabled={req.status === 'rejected'} // ปิดปุ่มเมื่อสถานะเป็น "rejected"
                >
                  ปฏิเสธ
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRequest(req.id)}
                >
                  ลบคำร้อง
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
