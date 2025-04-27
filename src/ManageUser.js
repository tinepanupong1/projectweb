import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './CSS/ManageUser.css';

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);

  // ดึงคำร้องขอเปลี่ยนรหัสผ่านจาก Firestore
  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, 'password_requests'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
  };

  // ส่ง request ไปยัง backend เพื่อเปลี่ยนรหัสผ่าน
  const handleChangePassword = async (email, newPassword, phone, id) => {
    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword, phone, id })
      });

      const result = await response.json();

      if (result.success) {
        alert('เปลี่ยนรหัสผ่านสำเร็จ');
        fetchRequests(); // รีโหลดรายการใหม่
      } else {
        alert(`ไม่สามารถเปลี่ยนรหัสผ่านได้: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดขณะติดต่อเซิร์ฟเวอร์');
    }
  };

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
            <th>รหัสใหม่</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.email}</td>
              <td>{req.phone}</td>
              <td>{req.newPassword}</td>
              <td>
                <button
                  className="reset-btn"
                  onClick={() =>
                    handleChangePassword(req.email, req.newPassword, req.phone, req.id)
                  }
                >
                  เปลี่ยนรหัส
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
