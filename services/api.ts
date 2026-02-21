import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({ baseURL: "http://YOUR_IP:8000" });

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
