import React, { useState } from 'react';
import './App.css'; 

// รหัสผ่านสำหรับทดสอบ
const VALID_USERNAME = 'user';
const VALID_PASSWORD = 'password';

function App() {
  // สถานะหลัก: 'login' หรือ 'confirmation'
  const [currentPage, setCurrentPage] = useState('login');
  
  // สถานะสำหรับฟอร์มล็อกอิน
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------

  const handleLoginOK = () => {
    // ตรวจสอบ Username และ Password อย่างง่าย
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // ✅ ล็อกอินสำเร็จ: ไปหน้า Confirmation
      setCurrentPage('confirmation'); 
    } else {
      alert('Login Failed: ตรวจสอบ Username/Password');
      setUsername('');
      setPassword('');
    }
  };

  const handleLoginCancel = () => {
    // เมื่อกด Cancel
    setUsername('');
    setPassword('');
    alert('Login Cancelled');
  };

  const handleConfirmationOK = () => {
    alert('Action Confirmed! (ไปต่อหน้าที่ 3)');
  };

  const handleConfirmationBack = () => {
    // ⬅️ กลับไปหน้า Login
    setCurrentPage('login');
    setUsername('');
    setPassword('');
  };

  // -------------------------------------------------------------------
  // Pages / Components
  // -------------------------------------------------------------------

  const renderLoginPage = () => (
    <div className="simple-form-card">
      <h2>Login</h2>
      
      {/* Input Username */}
      <h4>Username</h4>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      
      {/* Input Password */}
      <h4>Password</h4>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />

      <div className="button-group">
        <button onClick={handleLoginOK} className="btn-ok">
          OK
        </button>
        <button onClick={handleLoginCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
      {/* <small style={{ color: '#f38ba8', marginTop: '10px' }}>
          * Username: user / Password: password
      </small> */}
    </div>
  );

  const renderConfirmationPage = () => (
    <div className="simple-form-card">
      <h2>✨ Confirmation</h2>
      <p>คุณล็อกอินสำเร็จแล้ว</p>
      
      <div className="button-group">
        <button onClick={handleConfirmationOK} className="btn-ok">
          OK
        </button>
        <button onClick={handleConfirmationBack} className="btn-cancel">
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* แสดงผลตามสถานะของ currentPage */}
      {currentPage === 'login' ? renderLoginPage() : renderConfirmationPage()}
    </div>
  );
}

export default App;