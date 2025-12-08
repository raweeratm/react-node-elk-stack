import React, { useState } from 'react';
import './App.css'; 

// รหัสผ่านสำหรับทดสอบ
const VALID_USERNAME = 'user';
const VALID_PASSWORD = 'password';
const API_ENDPOINT = 'http://localhost:4000/log'; 
// URL ชี้ไปที่ Backend API Gateway (Port 4000)

function App() {
  // สถานะหลัก: 'login' หรือ 'confirmation'
  const [currentPage, setCurrentPage] = useState('login');
  
  // สถานะสำหรับฟอร์มล็อกอิน
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------------------------------------------
  // งก์ชันสำหรับส่ง Log ไปหา Backend API (Port 4000)
  // -------------------------------------------------------------------

  const sendLogToApi = async (data) => {
    const logData = {
        ...data,
        timestamp_client: new Date().toISOString(), // เวลาปัจจุบันของ Client
        // เราจะให้ Backend API จับ IP ที่แท้จริงให้
        client_ip_hint: 'CLIENT_IP_FROM_BACKEND', 
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        console.log(`Log sent successfully: ${logData.event_type}`);
      } else {
        console.error('Failed to send log:', response.status);
      }
    } catch (error) {
      console.error('Network Error: Could not connect to API Gateway (Port 4000)', error);
    }
  };

  // -------------------------------------------------------------------
  // Handler หลักสำหรับการล็อกอิน (async function)
  // -------------------------------------------------------------------

  const handleLoginOK = async () => {
    // 1. ตรวจสอบ Username และ Password
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      
      // 2. ส่ง Log แจ้งเตือนความสำเร็จ (Success) ก่อนนำทาง
      await sendLogToApi({
        user: username,
        password: password,
        event_type: 'login_attempt_success',
      }); 

      // 3. นำทางไปยังหน้า Confirmation
      setCurrentPage('confirmation');
      
    } else {
      
      // 2. ส่ง Log แจ้งเตือนความล้มเหลว (Failed)
      await sendLogToApi({
        user: username,
        password: password,
        event_type: 'login_attempt_failed',
      }); 

      // 3. แจ้งเตือนผู้ใช้และล้างฟอร์ม
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
    // กลับไปหน้า Login
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