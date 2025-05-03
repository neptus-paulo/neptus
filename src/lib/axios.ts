import axios from "axios";

const instance = axios.create({
  baseURL: "http://neptus.publicvm.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
