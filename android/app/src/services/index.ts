
import axios from 'axios';

const baseURL = 'http://10.0.2.2:5000'; // Change this to the correct IP or domain

const AuthService = {
  sendLoginOTP: async (phoneNumber: string, name: string, age: number, gender: string) => {
    try {
      // console.log('Data sent to backend:', {
      //   phoneNumber,
      //   name,
      //   age,
      //   gender,
      // });
      const response = await axios.post(`${baseURL}/send-otp`, {
        phoneNumber,
        name,
        age,
        gender,
      });

      return response.data;
    } catch (error: any) {
      console.error('Axios error:', error.response ? error.response.data : error.message); // Detailed error log
      throw error;
    }
  },

  verifyLoginOTP: async (phoneNumber: string, otp: string) => {
    try {
      const response = await axios.get(`${baseURL}/verify-otp/${phoneNumber}/${otp}`);
      return response.data;
    } catch (error: any) {
      console.error('Axios error:', error.response ? error.response.data : error.message); // Detailed error log
      throw error;
    }
  },
};

export default AuthService;
