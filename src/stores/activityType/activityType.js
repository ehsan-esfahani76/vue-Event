import { defineStore } from "pinia";
import { getData } from "../../services/activityType/service";
import { toast } from "vue3-toastify";
import { ACTIVITY_TYPE_PARAMS } from "../../common/constants";
export const useActivityType = defineStore("activityType", {
  state: () => {
    return { activityTypes: [] };
  },
  actions: {
    async GetActivityType() {
      if (this.activityTypes.length > 0) {
        return this.activityTypes;
      }
      const colors = [
        { backgroundColor: "#FFF2F2", color: "#E35053" },
        { backgroundColor: "#FEE6CF", color: "#E86E00" },
        { backgroundColor: "#FFF5FF", color: "#AE3EC9" },
        { backgroundColor: "#EFF9FF", color: "#58C2FE" },
      ];
      try {
        const result = await getData();
        const data = result;
        if (data) {
          data.forEach((item, index) => {
            item.color = colors[index % 4].color;
            item.backgroundColor = colors[index % 4].backgroundColor;
          });
          this.activityTypes = data;
          return data;
        } else {
          toast.error(data.message, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetActivityTypeById(id) {
      try {
        const data = await getData(id);
        this.activityTypes = data.results;
        return data.results;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
