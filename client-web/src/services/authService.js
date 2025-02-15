import axios from 'axios';
const API_BASE_URL = "http://localhost:5000"; 

const getSevenDay = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const authService = {
  async register(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(username, password, setCookie) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const data = response.data;

      if (setCookie) {
        setCookie('accessToken', data.accessToken, { expires: getSevenDay(), path: '/' });
        setCookie('refreshToken', data.refreshToken, { expires: getSevenDay(), path: '/' });
      }

      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  logout(removeCookie, navigate) {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    navigate('/login'); 
  },

  async refreshToken(cookies, setCookie) {
    try {
      if (!cookies.refreshToken) throw new Error('No refresh token found');

      const response = await axios.post('/api/auth/refresh', { refreshToken: cookies.refreshToken });
      const data = response.data;

      if (setCookie) {
        setCookie('accessToken', data.data.accessToken, { expires: getSevenDay(), path: '/' });
      }

      return data.data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};

export default authService;
