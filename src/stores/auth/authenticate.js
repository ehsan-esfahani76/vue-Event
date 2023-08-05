import { defineStore } from "pinia";
import {
  loginRequest,
  signupRequest,
} from "../../services/userManager/service";
import cookies from "../../plugins/cookie";
export const useAuthenticate = defineStore("data", {
  state: () => {
    return { data: [] };
  },

  actions: {
    async logIn(params) {
      try {
        const data = await loginRequest(params);
        console.log(data);
        if (data) {
          const { firstName, lastName, _id , token } = data;
          cookies.set("token" , token)
          localStorage.setItem(
            "info",
            JSON.stringify({ firstName, lastName, _id })
          );
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async signup(params) {
      try {
        return await signupRequest(params);
      } catch (error) {
        
      }
    },
  },
});
