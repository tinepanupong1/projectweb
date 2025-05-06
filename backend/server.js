const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // ต้องติดตั้ง node-fetch หากยังไม่ได้ติดตั้ง

const app = express();
const PORT = 3001;
const API_KEY = 'AIzaSyC0k8a3W3f6Ey90s4KEH_nrvdlHxrLo0tc'; // ใส่ API Key ที่ได้จาก Firebase Console

// ใช้ CORS และ body-parser
app.use(cors());
app.use(bodyParser.json());

// Endpoint สำหรับการรีเซ็ตรหัสผ่าน
app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body; // รับอีเมลจากคำขอ

  try {
    // URL สำหรับการเรียกใช้ Firebase REST API
    const resetPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET', // ขอตั้งค่าเป็นการรีเซ็ตรหัสผ่าน
        email: email, // อีเมลของผู้ใช้ที่ต้องการรีเซ็ตรหัสผ่าน
      }),
    });

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ success: false, message: result.error.message });
    }

    // ส่งข้อความตอบกลับเมื่อสำเร็จ
    res.json({ success: true, message: 'ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของผู้ใช้' });

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดขณะส่งลิงก์รีเซ็ตรหัสผ่าน' });
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
