// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://api.recipe.futuregenit.com/api/' : 'http://127.0.0.1:8000/api',
   
});

export default instance;
