// frontend/src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Point to your Backend URL
});

export default api;