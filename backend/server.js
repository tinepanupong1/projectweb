// backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./admin/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/reset-password', async (req, res) => {
  const { email, phone, newPassword, id } = req.body;

  try {
    // 1. ค้นหา user จาก Firestore โดย match ทั้ง email และ phone
    const usersSnapshot = await db.collection('users').get();
    const matchedUser = usersSnapshot.docs.find(doc => {
      const data = doc.data();
      return data.email === email && data.phone === phone;
    });

    if (!matchedUser) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้ที่ตรงกับอีเมลและเบอร์โทร' });
    }

    // 2. ค้นหา user จาก Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);

    // 3. เปลี่ยนรหัสผ่าน
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword
    });

    // 4. ลบคำร้องใน password_requests
    await db.collection('password_requests').doc(id).delete();

    res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดขณะเปลี่ยนรหัสผ่าน' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
