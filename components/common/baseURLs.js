import axios from "axios";

const localhostBaseURL = axios.create({
  baseURL: "https://pettogether.herokuapp.com",
});

// baseURL:"http://10.0.2.2:8080"
export { localhostBaseURL };
