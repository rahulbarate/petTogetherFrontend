import axios from "axios";

const localhostBaseURL = axios.create({
<<<<<<< HEAD
  baseURL: "http://192.168.0.104:8080",
=======
  baseURL: "http://192.168.0.110:8080",
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
});

// baseURL:"http://10.0.2.2:8080"
export { localhostBaseURL };
