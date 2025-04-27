import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลเข้าสู่ระบบ
    if (email === 'tine123@gmail.com' && password === '123456') {
      // หากถูกต้อง ให้ไปหน้าจัดการเมนูอาหาร
      navigate('/manage');
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง ❌');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/assets/food.svg" alt="Healthy food" className="login-image" />
      </div>

      <div className="login-right">
        <h2>Login</h2>
        <p>เว็บไซต์สำหรับแอดมินเพื่อดูแลระบบ Meal-Master</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}

          <button type="submit">เข้าสู่ระบบ ➤</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
