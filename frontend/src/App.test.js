// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import dotenv from 'dotenv';

// โหลด environment variables จาก .env
dotenv.config();

// ดึงข้อมูล users จากตัวแปร .env
const validUsers = JSON.parse(process.env.REACT_APP_VALID_USERS_JSON);

const user1 = validUsers[0];
const user2 = validUsers[1];

const pass1 = user1.pass;
const pass2 = user2.pass;

// ฟังก์ชันเช็คล็อกอิน
function checkLogin(username, password, users = validUsers) {
  if (!username && !password) return 'กรุณากรอก username/password';
  if (!username) return 'กรุณากรอก user';
  if (!password) return 'กรุณากรอก password';
  // const found = users.find(u => u.user === username && u.pass === password);
  // return found ? 'เข้าสู่ระบบสำเร็จ' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  return users.some(u => u.user === username && u.pass === password);
}

describe('Login combination tests', () => {
  test('user1 & pass1 ถูกต้อง', () => {
    expect(checkLogin(user1.user, pass1)).toBe(true);
  });

  test('user1 & pass2 ผิด', () => {
    expect(checkLogin(user1.user, pass2)).toBe(false);
  });

  test('user2 & pass1 ผิด', () => {
    expect(checkLogin(user2.user, pass1)).toBe(false);
  });

  test('user2 & pass2 ถูกต้อง', () => {
    expect(checkLogin(user2.user, pass2)).toBe(true);
  });
  // กรอกไม่ครบ
  test('ไม่กรอก username และ password', () => {
    expect(checkLogin('', '')).toBe('กรุณากรอก username/password');
  });

  test('ไม่กรอก username', () => {
    expect(checkLogin('', 'password')).toBe('กรุณากรอก user');
  });

  test('ไม่กรอก password', () => {
    expect(checkLogin('user', '')).toBe('กรุณากรอก password');
  });
});
