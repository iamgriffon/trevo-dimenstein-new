import axios from "axios";
import authentication from "./authentication";

export const api = axios.create({
  baseURL: `${authentication.apiUrl()}`,
  headers: {
    Authorization: `Bearer ${authentication.getToken()}`,
  },
});
