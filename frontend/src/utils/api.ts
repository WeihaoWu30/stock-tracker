import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
   baseURL: 'http://localhost:5001', // Backend URL
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

export default api;
