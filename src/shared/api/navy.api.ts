import axios from "axios";

const navyApi = axios.create({
    baseURL: '/api',
});

export { navyApi }