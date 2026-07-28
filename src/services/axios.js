import axios from 'axios';
import { BASE_URL } from './config';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;