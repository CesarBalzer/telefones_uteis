import Service from './service';

// const API_BASE_URL = 'http://host.docker.internal:8000/';
const API_BASE_URL =
  'https://ad42-2001-1284-f50e-5ec1-40d3-66de-5dd4-56fa.ngrok-free.app';

const api = new Service(API_BASE_URL);

export default api;
