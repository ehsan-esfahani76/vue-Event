import { defineStore } from "pinia";

export const useModal = defineStore("modal", {
  state: () => {
    return {
      activityModal: false,
    };
  },
  actions: {
    handleActivityModal() {
      this.activityModal = !this.activityModal;
    },
  },
});
