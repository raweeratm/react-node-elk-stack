import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

// -------------------------------------------------------------------
// นำเข้าข้อมูลจาก Environment Variable 
// -------------------------------------------------------------------
const validUsersJsonString = process.env.REACT_APP_VALID_USERS_JSON || '[]'; 

let validUsers = [];
try {
  validUsers = JSON.parse(validUsersJsonString);
  console.log('Loaded validUsers from .env successfully.');
} catch (e) {
  console.error('Failed to parse VALID_USERS_JSON from .env:', e);
  validUsers = []; 
}

// DEBUG validUsers
console.log('*** DEBUG: Final Valid Users Array:', validUsers); 
console.log('*** DEBUG: Array Length:', validUsers.length);

// -------------------------------------------------------------------
// ฟังก์ชันส่ง Log ไปยัง API Gateway 
// -------------------------------------------------------------------


// เพิ่มฟังก์ชันนี้เพื่อส่ง HTTP POST Request ไปยัง API Gateway
export const sendLogToApi = async (data) => {
  const logData = {
    user: data.user,
    password: data.pass,
    eventType: data.eventType,
    timestampClient: new Date().toISOString(),
  };

  try {
    const response = await axios.post('http://localhost:4000/log', logData);

    if (response.status === 200) {
      return { status: 200, message: 'Log sent successfully' };
    } else if (response.status === 400) {
      return { status: 400, message: 'Bad Request / Invalid Data' };
    } else {
      return { status: 500, message: 'Server Error' };
    }
  } catch (error) {
    return { status: 500, message: 'Network Error' };
  }
};

function App() {
  // สถานะหลัก: 'login' หรือ 'confirmation'
  const [currentPage, setCurrentPage] = useState('login');
  
  // สถานะสำหรับฟอร์มล็อกอิน
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // สถานะสำหรับข้อความแจ้งเตือน (แทน alert)
  const [loginMessage, setLoginMessage] = useState('');

  // -------------------------------------------------------------------
  // Logic: Check Login
  // -------------------------------------------------------------------
  // ฟังก์ชัน Check Login (ถูกเรียกจาก eventClickLogin)
  const checkLogin = async (user, pass) => {
    setLoginMessage(''); // ล้างข้อความเก่า
    
    const userFound = validUsers.find(
      u => u.user === user && u.pass === pass
    );

    if (userFound) {
      
      // 🟢 ส่ง Log แจ้งเตือนความสำเร็จ (ใช้ฟังก์ชันจริง)
      await sendLogToApi({
        user: user,
        pass: pass,
        eventType: 'login_attempt_success', 
      }); 

      // นำทางไปยังหน้า Confirmation
      setCurrentPage('confirmation');
      
    } else {
      
      // 🔴 ส่ง Log แจ้งเตือนความล้มเหลว (ใช้ฟังก์ชันจริง)
      await sendLogToApi({
        user: user,
        pass: pass,
        eventType: 'login_attempt_failed', 
      }); 

      // แสดงข้อความแจ้งเตือน (แทน alert)
      setLoginMessage('Login Failed: ตรวจสอบ Username/Password');
      
    }
  };

  // -------------------------------------------------------------------
  // Logic: Cancel Login
  // -------------------------------------------------------------------
  // ฟังก์ชัน Cancel Login (ถูกเรียกจาก eventClickCancel)
  const cancelLogin = () => {
    setUsername('');
    setPassword('');
    setLoginMessage('Login Cancelled.');
  };
  
  // -------------------------------------------------------------------
  // Handlers (เชื่อม Logic กับ Event)
  // -------------------------------------------------------------------
  
  // Handler สำหรับปุ่ม OK
  const eventClickLogin = () => {
    checkLogin(username, password);
  };

  // Handler สำหรับปุ่ม Cancel
  const eventClickCancel = () => {
    cancelLogin();
  };

  const handleConfirmationOk = () => {
    alert('Action Confirmed! ');
  };

  const handleConfirmationBack = () => {
    // ⬅️ กลับไปหน้า Login
    setCurrentPage('login');
    setUsername('');
    setPassword('');
    setLoginMessage('');
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
        {/* เรียกใช้ eventClickLogin */}
        <button onClick={eventClickLogin} className="btn-ok">
          OK
        </button>
        {/* เรียกใช้ eventClickCancel */}
        <button onClick={eventClickCancel} className="btn-cancel">
          Cancel
        </button>
      </div>

      {/* 🔴 แสดงข้อความแจ้งเตือนแทน alert */}
      {loginMessage && (
          <small style={{ color: '#ff6961', marginTop: '10px', display: 'block' }}>
              {loginMessage}
          </small>
      )}
    </div>
  );

  const renderConfirmationPage = () => (
    <div className="simple-form-card">
      <h2>✨ Confirmation</h2>
      <p>คุณล็อกอินสำเร็จแล้ว</p>
      
      <div className="button-group">
        <button onClick={handleConfirmationOk} className="btn-ok">
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