import { defineStore } from "pinia";
import { getUsers } from "@/services/userManager/service";

const setAvatar = () => {
  const image = new URL(
    `../../assets/avatars/Avatar${Math.floor(Math.random() * 6) + 1}.png`,
    import.meta.url
  ).href;
  return image;
};
export const useUsers = defineStore("users", {
  state: () => {
    return { users: []};
  },

  actions: {
    async getUsers() {
      try {
        const data = await getUsers();
        data.forEach((user) => {
          user.image = setAvatar();
        });
        this.users = data
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
