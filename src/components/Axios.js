import axios from 'axios';

const instance1 = axios.create({ baseURL: 'http://localhost:3000/api' });
export const instance2 = axios.create({ baseURL: '../public/schema.xml' });
export default instance1;

