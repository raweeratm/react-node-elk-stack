import axios from 'axios';
import { sendLogToApi } from './App';

// สร้าง mock axios เป็น virtual module (จะไม่เข้า node_modules/axios จริง)
jest.mock('axios', () => {
  const post = jest.fn();
  return {
    __esModule: true,
    default: { post },
    post,
  };
});
const mockedAxios = axios;

describe('sendLogToApi() return value tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ควร return 200 เมื่อ API สำเร็จ', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { status: 'OK' },
    });

    const result = await sendLogToApi({ user: 'test', pass: '1234', eventType: 'login_success' });

    expect(result).toEqual({
      status: 200,
      message: 'Log sent successfully',
    });
  });

  it('ควร return 400 เมื่อ Bad Request', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 400,
      data: { status: 'Bad Request' },
    });

    const result = await sendLogToApi({ user: 'test', pass: 'wrong', eventType: 'login_failed' });

    expect(result).toEqual({
      status: 400,
      message: 'Bad Request / Invalid Data',
    });
  });

  it('ควร return 500 เมื่อ Server Error', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 500,
      data: { status: 'Server Error' },
    });

    const result = await sendLogToApi({ user: 'test', pass: 'pass', eventType: 'server_error' });

    expect(result).toEqual({
      status: 500,
      message: 'Server Error',
    });
  });

  it('ควร return 500 เมื่อ Network Error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    const result = await sendLogToApi({ user: 'test', pass: 'pass', eventType: 'network_fail' });

    expect(result).toEqual({
      status: 500,
      message: 'Network Error',
    });
  });
});
