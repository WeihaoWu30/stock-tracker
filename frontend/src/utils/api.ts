import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
   // Use the Next.js rewrite proxy in production to solve cross-origin cookie issues
   baseURL: process.env.NODE_ENV === 'production'
      ? '/api/proxy'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'),
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

export default api;
