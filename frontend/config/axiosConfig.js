// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://api.moon-nest.com/api/' : 'http://127.0.0.1:8000/api',
   
});

export default instance;
