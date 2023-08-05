import { useCookies } from "vue3-cookies";
import axios from "axios";
import { toast } from "vue3-toastify";

const { cookies } = useCookies();

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response) {
      console.log(response.data , response.request.responseURL);
      return response.data;
    } 
  },
  (error) => {
    if (error?.response?.data) {
      toast.error(error.response?.data?.data?.message?.fa, {
        autoClose: 3000,
      });
    }else{
      toast.error(error.message, {
        autoClose: 3000,
      });
    }
  }
);
