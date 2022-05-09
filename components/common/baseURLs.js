import axios from 'axios';

const localhostBaseURL = axios.create({
    baseURL:"http://192.168.0.109:8080"
});

// baseURL:"http://10.0.2.2:8080"
export {localhostBaseURL};