import axios from 'axios';

// Basic axios instance (kept for potential future use)
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export { api };