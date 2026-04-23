import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// 🔥 THIS IS CRITICAL
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); // DEBUG

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;