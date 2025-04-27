const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // โหลดจาก Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emailToReset = 'tine111@gmail.com';
const newPassword = '0123456789';

admin.auth().getUserByEmail(emailToReset)
  .then(userRecord => {
    return admin.auth().updateUser(userRecord.uid, {
      password: newPassword
    });
  })
  .then(() => {
    console.log('✅ เปลี่ยนรหัสผ่านสำเร็จ');
  })
  .catch(error => {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  });
