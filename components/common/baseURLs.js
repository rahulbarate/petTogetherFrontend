import axios from "axios";

const localhostBaseURL = axios.create({
  // baseURL: "https://pettogether.herokuapp.com",
  baseURL:"http://192.168.0.100:8080"
});

// baseURL:"http://localhost:8080"
export { localhostBaseURL };
