<template>
  <div class="event-avatar-view">
    <ul class="event-avatar-view__list">
      <li
        class="event-avatar-view__item"
        v-for="(user, index) in users?.slice(-5)"
      >
        <EventAvatar :image="user" :AvatarHeight="height" />
      </li>
      <li
        v-if="users?.length > 5"
        class="event-avatar-view__item event-avatar-view__usersLength"
      >
        +{{ new Intl.NumberFormat("fa-IR").format(users?.length - 5) }}
      </li>
    </ul>
    <button
      class="event-avatar-view__button"
      @click="$emit('addUser')"
      type="button"
      v-if="hasEditUser"
    >
      <base-icon class="event-avatar-view__button-svg" name="Plus" />
      <p>اضافه کردن</p>
    </button>
    <PersonModal
      v-if="showPersonModal"
      title="اشتراک گذاری رویداد"
      @cancel="$emit('cancelPersonModal')"
      @confirm="confirmModal"
      :usersId="props.usersId"
    />
  </div>
</template>

<script setup>
import EventAvatar from "../event/EventAvatar.vue";
import PersonModal from "@/common/components/modal/PersonModal.vue";

const emit = defineEmits(["addUser", "confirmPersonModal",'cancelPersonModal']);
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  hasEditUser: {
    type: Boolean,
    required: false,
    default: true,
  },
  height: {
    type: String,
    default: "48px",
  },
  usersId: {
    type: Array,
    required: false,
  },
  showPersonModal:{
    type:Boolean,
    default : false
  }
});

const confirmModal = (value) => {
  emit("confirmPersonModal", value);
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.event-avatar-view {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  &__list {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding: 0;
    max-width: 60%;
  }
  &__item {
    position: relative;
    right: 10px;
    margin-right: -15px;
  }
  &__usersLength {
    @include main.flex-mixin;
    min-width: v-bind(height);
    height: v-bind(height);
    border-radius: 50%;
    background-color: main.$color-secondary-main;
    font-weight: bold;
    font-size: 18px;
    bottom: 3px;
  }
  &__button {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 8px;
    color: main.$color-primary-600;
    border: 0;
    background-color: main.$color-primary-100;
    border-radius: 24px;
    font-size: 16px;
    margin-right: 10px;
    cursor: pointer;
    padding: 10px;
    &-svg {
      width: 13px;
      height: 13px;
      fill: main.$color-primary-600;
    }
  }
}
</style>
