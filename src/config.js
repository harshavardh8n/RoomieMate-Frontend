// Spring Boot backend runs on port 3001 by default
export const backendPath =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_BACKEND_URL) ||
  'http://localhost:3001/';
