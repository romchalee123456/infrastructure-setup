import axios from 'axios';
import { useCookies } from 'react-cookie'; 
import { useAuthStore } from './stores/auth';  
import { useHistory } from 'react-router-dom';

const getSevenDay = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const authService = {
  isLoggedIn() {
    const authStore = useAuthStore();
    return authStore.isLoggedIn;  
  },

  async login(email, password) {
    try {
      const response = await axios.post('/auth/register', { email, password });

      const data = response.data.data;

      const { setCookie } = useCookies(['accessToken', 'accessRefreshToken']);
      setCookie('accessToken', data.token, { expires: getSevenDay() });
      setCookie('accessRefreshToken', data.refreshToken, { expires: getSevenDay() });

      const authStore = useAuthStore();
      authStore.logout(); 

      return response.data;

    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  logout() {
    const { removeCookie } = useCookies(['accessToken', 'accessRefreshToken']);
    const authStore = useAuthStore();

    removeCookie('accessToken');
    removeCookie('accessRefreshToken');

    authStore.logout(); 

    const history = useHistory();
    history.push('/login'); 
  }
};

export default authService;
