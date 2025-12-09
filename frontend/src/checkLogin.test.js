// checkLogin.test.js
import { checkLogin } from './checkLogin.js';
import dotenv from 'dotenv';
dotenv.config();

// describe('ทดสอบ checkLogin ด้วย users จาก .env จริง', () => {
//   const users = JSON.parse(process.env.REACT_APP_VALID_USERS_JSON);
//   const user1 = users[0];
//   const user2 = users[1];
//   const pass1 = user1.pass;
//   const pass2 = user2.pass;

//   test('user1 & pass1 ถูกต้อง', () => {
//     expect(checkLogin(user1.user, pass1, users)).toBe('เข้าสู่ระบบสำเร็จ');
//   });

//   test('user1 & pass2 ผิด', () => {
//     expect(checkLogin(user1.user, pass2, users)).toBe('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
//   });

//   test('user2 & pass1 ผิด', () => {
//     expect(checkLogin(user2.user, pass1, users)).toBe('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
//   });

//   test('user2 & pass2 ถูกต้อง', () => {
//     expect(checkLogin(user2.user, pass2, users)).toBe('เข้าสู่ระบบสำเร็จ');
//   });
// });

describe('ทดสอบ checkLogin ด้วย mock users (จำลอง)', () => {
  // สร้าง users ปลอมขึ้นมาเอง
  const mockUsers = [
    { user: 'user1', pass: 'pass1' },
    { user: 'user2', pass: 'pass2' },
  ];

  test('mock: user1/pass1 ผ่าน', () => {
    expect(checkLogin('user1', 'pass1', mockUsers)).toBe('เข้าสู่ระบบสำเร็จ');
  });

  test('mock: user1/pass2 ไม่ผ่าน', () => {
    expect(checkLogin('user1', 'pass2', mockUsers)).toBe('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  });

  test('mock: user2/pass1 ผ่าน', () => {
    expect(checkLogin('user2', 'pass1', mockUsers)).toBe('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  });

  test('mock: user2/pass2 ไม่ผ่าน', () => {
    expect(checkLogin('user2', 'pass2', mockUsers)).toBe('เข้าสู่ระบบสำเร็จ');
  });

  // กรอกไม่ครบ
  test('mock: ไม่กรอก user', () => {
    expect(checkLogin('', 'pass1', mockUsers)).toBe('กรุณากรอก user');
  });

  test('mock: ไม่กรอก pass', () => {
    expect(checkLogin('user1', '', mockUsers)).toBe('กรุณากรอก password');
  });

  test('mock: ไม่กรอกอะไรเลย', () => {
    expect(checkLogin('', '', mockUsers)).toBe('กรุณากรอก user/password');
  });
});
