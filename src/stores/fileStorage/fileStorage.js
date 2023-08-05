import { defineStore } from "pinia";
import { putData, getData } from "../../services/fileStorage/service";

export const useFileStorage = defineStore("fileStorage", {
  actions: {
    async PutFile(files) {
      const data = await putData(files);
      return data;
    },
    async GetFile(id) {
      const data = await getData(id);
      return data;
    },
  },
});
