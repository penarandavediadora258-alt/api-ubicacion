import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API = axios.create({
  baseURL: 'http://192.168.0.25:3000/api'
});

// agregar token automáticamente
API.interceptors.request.use((req) => {
  // aquí luego pondremos AsyncStorage
  return req;
});

export default API;
API.interceptors.request.use((req) => {
  req.headers.Authorization = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTFjNTk0NmIwMmM0NWZmZGFmNTMyMSIsInJvbCI6ImNvbmR1Y3RvciIsImlhdCI6MTc3NjQwMzk3OCwiZXhwIjoxNzc3MDA4Nzc4fQ.qVDaMjn53GBNgh-x83qZgRFqm8k3n4lqHMr_8gTSu4I

  return req;
});
export default API;