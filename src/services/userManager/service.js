import { SERVICES_URL } from "@/common/constants";
import { axiosInstance } from "../config";
const loginRequest = (params)=> {
    return axiosInstance.post(`${SERVICES_URL.USER}/login`, params);
}

const signupRequest =async(params)=> {
    return axiosInstance.post(`${SERVICES_URL.USER}/signup`, params);
}

async function getUsers(params) {
    return axiosInstance.get("http://localhost:3000/user")
}
export { loginRequest, signupRequest  ,getUsers};
