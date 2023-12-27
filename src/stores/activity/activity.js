import { defineStore } from "pinia";
import {
  postData,
  getData,
  deleteData,
  getDataBYId,
  editData,
} from "../../services/activity/service";
import { ACTIVITY_SCHEMA, ACTIVITY_PARAMS } from "../../common/constants";
import { useActivityType } from "@/stores/activityType/activityType.js";
import { useFileStorage } from "../fileStorage/fileStorage";
const activityTypeStore = useActivityType();
const fileStore = useFileStorage();
export const useActivity = defineStore("activity", {
  state: () => {
    return { activity: [], images: [], activityProp: [] };
  },

  actions: {
    async PostActivity({
      title,
      description,
      date,
      startTime,
      endTime,
      activityType,
      content,
      id,
    }) {
      const shema = ACTIVITY_SCHEMA(
        {
          title,
          description,
          date,
          startTime,
          endTime,
          activityType,
          content,
          id,
        },
        "tags"
      );
      try {
        const data = await postData(shema);
        if (data) {
          shema._id = data._id;
          this.activity.push(shema);
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async EditActivity({
      title,
      description,
      date,
      startTime,
      endTime,
      activityType,
      content,
      id,
    }) {
      const shema = ACTIVITY_SCHEMA(
        {
          title,
          description,
          date,
          startTime,
          endTime,
          activityType,
          content,
          id,
        },
        "newTags"
      );

      try {
        const data = await editData(shema);
        if (data) {
          this.activity.forEach((item) => {
            if (item._id === data._id) {
              item.data = shema.data;
              item.tags = shema.tags;
            }
          });
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async getActivity() {
      try {
        await activityTypeStore.GetActivityType();
        const result = await getData();
        const data = result;
        if (data) {
          this.activity = data;
          data.forEach(async (item) => {
            await this.getFileRequest(item.data.content, item._id);
          });
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getActivityById(id) {
      const data = await getDataBYId();
      return data;
    },
    async deleteActivity(id) {
      const data = await deleteData(id);
      this.activity = this.activity.filter((item) => {
        return item._id !== id;
      });
      console.log(this.activity);
      return data;
    },
    async getFileRequest(params, id) {
      let backup = [];
      if (this.images.length > 0) {
        backup = this.images.filter((item) => {
          return item.id !== id;
        });
      }
      this.images = [];
      params.forEach(async (item) => {
        if (item.picture) {
          let result = await fileStore.GetFile(item.picture);
          this.images.push({ result, id });
        }
      });
      this.images.push.apply(this.images,backup);
    },
  },
  getters: {
    getImages() {
      return this.images;
    },
  },
});
