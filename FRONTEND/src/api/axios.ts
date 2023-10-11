import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_REACT_JAVA_SERVER_URL;
const DJANGO_URL = import.meta.env.VITE_REACT_DJANGO_SERVER_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //  },
  // withCredentials: true,
});

export const axiosDJ = axios.create({
  baseURL: DJANGO_URL,
});
