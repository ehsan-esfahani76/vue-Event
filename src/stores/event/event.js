import { defineStore } from "pinia";
import {
  postData,
  getData,
  editData,
  deleteData,
  getDataByTag,
} from "../../services/event/service";
import { EVENT_SCHEMA, EVENT_PARAMS } from "../../common/constants";
import { useUsers } from "../users/users";

const setAvatar = () => {
  const image = new URL(
    `../../assets/avatars/Avatar${Math.floor(Math.random() * 6) + 1}.png`,
    import.meta.url
  ).href;
  return image;
};

const userStore = useUsers();
export const useEvent = defineStore("shareEvent", {
  state: () => {
    return { events: [], loading: false };
  },

  actions: {
    async shareEvent({ title, dueDate, description, time, users }) {
      const sharedTag = this.createTags(users);
      const schema = EVENT_SCHEMA(
        { title, dueDate, description, time, users, sharedTag },
        "tags"
      );
      if (navigator.onLine) this.loading = true;
      try {
        const response = await postData(schema);
        if (response) {
          schema._id = response._id;
          this.events.push(schema);
          const images = [];
          schema.data.users.map((item) => {
            images.push(setAvatar());
          });
          schema.images = images;

          return response;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async editEvent({ title, dueDate, description, time, users, id }) {
      const sharedTag = this.createTags(users);
      const schema = EVENT_SCHEMA(
        { title, dueDate, description, time, users, id, sharedTag },
        "newTags"
      );
      if (navigator.onLine) this.loading = true;
      try {
        const response = await editData(schema);
        if (response) {
          this.events.forEach((item) => {
            if (item._id === response._id) {
              item.data = schema.data;
              item.tags = schema.tags;
              const images = [];
              schema.data.users.map((item) => {
                images.push(setAvatar());
              });
              item.images = images;
            }
          });
        }
        return response;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getEvent() {
      this.loading = true;
      try {
        !userStore.users.length && (await userStore.getUsers());
        const response = await getData();
        // const response2 = await getDataByTag(params);
        const data = response.map((event) => {
          const images = [];
          event.data.users.map((item) => {
            images.push(setAvatar());
          });
          event.images = images;
          event.editable = true;
          return event;
        });
        // const data2 = response2.results.map((event) => {
        //   const images = [];
        //   event.data.info.users.map((item) => {
        //     images.push(setAvatar());
        //   });
        //   event.images = images;
        //   event.editable = false;
        //   return event;
        // });
        this.events = [...data];
        this.loading = false;
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteEvent(id) {
      if (navigator.onLine) this.loading = true;
      try {
        const response = await deleteData(id);
        if (response) {
          const filterdData = this.events.filter((item) => {
            return item._id !== id;
          });
          this.events = filterdData ?? []
        }
        this.loading = false;
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    createTags(users) {
      const obj = {};
      users.forEach((user) => {
        obj[user] = "shared";
      });
      return obj;
    },
  },
});
