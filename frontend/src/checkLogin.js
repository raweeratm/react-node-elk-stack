import dotenv from 'dotenv';
dotenv.config();

// โหลด users จาก .env
const realUsers = JSON.parse(process.env.REACT_APP_VALID_USERS_JSON);

/**
 * ฟังก์ชันเช็ก user/pass
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} password - รหัสผ่าน
 * @param {Array} users - mock users สำหรับเทสต์
 */
export function checkLogin(username, password, users = realUsers) {
  if (!username && !password) return 'กรุณากรอก user/password';
  if (!username) return 'กรุณากรอก user';
  if (!password) return 'กรุณากรอก password';

  const found = users.find(u => u.user === username && u.pass === password);
  return found ? 'เข้าสู่ระบบสำเร็จ' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
}
