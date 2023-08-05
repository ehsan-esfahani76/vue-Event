<template>
  <Transition name="fade" mode="out-in">
    <base-modal :index="13" @click="modalClickHandler">
      <div class="eventModal">
        <h3>{{ title }}</h3>
        <div class="eventModal__users">
          <base-input
            type="search"
            name="search"
            label="جستجوی دوستان"
            icon="search"
            v-model.trim="search"
          ></base-input>
          <ul class="eventModal__list" v-if="usersList.length">
            <li
              class="eventModal__list-item"
              v-for="(user, index) in usersList"
            >
              <EventAvatar
                v-if="user.firstName"
                :is-active="isActive(user._id)"
                @deactive="removeUser(user._id)"
                @activate="addUser(user._id)"
                :image="user.image"
              />
              {{ user.firstName }}
            </li>
          </ul>
        </div>
        <div class="eventModal__buttons">
          <base-button title="تایید" color="blue" @click="confirmHandler" />
          <base-button title="لغو" color="white" @click="cancelHandler" />
        </div>
      </div>
    </base-modal>
  </Transition>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useUsers } from "@/stores/users/users";
import { storeToRefs } from "pinia";
import EventAvatar from "@/modules/components/event/EventAvatar.vue";
const emits = defineEmits(["confirm", "cancel"]);
const {users } = storeToRefs(useUsers());
const search = ref("");
let usersList = reactive(users.value);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  usersId: {
    type: Array,
    required: false,
    default: [],
  },
});
let selectedUsers = reactive(props.usersId);

const confirmHandler = () => {
  emits("confirm", selectedUsers);
};
const cancelHandler = () => {
  emits("cancel");
};
const isActive = (params) => {
  const findUser = selectedUsers.find((item) => {
    return item === params;
  });
  return findUser;
};
const addUser = (id) => {
  selectedUsers.push(id);
};
const removeUser = (id) => {
  const index = selectedUsers.findIndex((item) => item === id);
  selectedUsers.splice(index, 1);
};
const modalClickHandler = (e) => {
  if (e.target.className.includes("modal")) cancelHandler();
};
console.log(selectedUsers);
watch(
  () => search.value,
  () => {
    usersList = users.value.filter((item) => {
      return item.firstName?.includes(search.value);
    });
  }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.eventModal {
  background-color: main.$background-light-surface;
  width: 380px;
  border-radius: 24px;
  @include main.flex-mixin(space-between, initial, column);
  text-align: center;
  gap: 10px;
  padding: 30px;
  &__list {
    max-height: 360px;
    direction: rtl;
    @include main.flex-mixin(initial, center);
    flex-wrap: wrap;
    gap: 20px;
    padding: 0;
    overflow-y: auto;
    &-item {
      width: 20%;
    }
  }
  &__buttons {
    display: flex;
    height: 40px;
    gap: 10px;
  }
}
</style>
