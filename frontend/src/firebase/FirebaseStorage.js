import axios from 'axios';
import { auth } from '../firebase/FirebaseHandler';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Attach the Firebase ID token automatically
API.interceptors.request.use(async (cfg) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export function generateImg2Img(formData) {
  return API.post('/api/img2img', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function generateText2Img(payload) {
  return API.post('/api/text2img', payload);
}

export function uploadImageToBackend(imageBlob, prompt) {
  const fd = new FormData();
  fd.append('image', imageBlob);
  fd.append('prompt', prompt);
  return API.post('/api/upload-image', fd);
}

export function fetchAllImages() {
  return API.get('/api/images');
}

export function fetchUserImages() {
  return API.get('/api/images/user');
}
