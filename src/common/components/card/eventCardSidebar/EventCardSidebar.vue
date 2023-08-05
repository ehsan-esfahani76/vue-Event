<template>
  <base-card>
    <template v-if="title" #card>
      <div class="event-card-sidebar">
        <div class="event-card-sidebar__title">
          {{ title }}
        </div>
        <div class="event-card-sidebar__description">
          <p class="event-card-sidebar__description-text">
            {{ description }}
          </p>
        </div>
        <div class="event-card-sidebar__info">
          <div class="event-card-sidebar__info-item">
            <base-icon name="calendar" />
            <span>{{ data.date }}</span>
          </div>
          <div class="event-card-sidebar__info-item">
            <base-icon name="clock" />
            <span>{{time }}</span>
          </div>
          <div class="event-card-sidebar__avatar">
            <EventAvatarView
              :users="userAvatars"
              @addUser="addUser"
              :hasEditUser="false"
              height="28px"
            />
          </div>
        </div>
      </div>
    </template>
  </base-card>
</template>

<script setup>
import EventAvatarView from "@/modules/components/event/EventAvatarView.vue";
import { convertDate } from "@/common/mixins/mixin";
import { reactive, watch } from "vue";
import { useEvent } from "@/stores/event/event";
const eventStore = useEvent();
const data = reactive({
  date: "",
});
let userAvatars = reactive([]);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  }
});
watch(
  () => [props, eventStore.events],
  () => {
    if (props.dueDate) {
      data.date = convertDate(+props.dueDate, "D MMMM");
      userAvatars = props.image;
    }
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss">
@use "@/assets/sass/main";
.event-card-sidebar {
  padding: 16px;
  background-color: v-bind(backgroundColor);
  border-radius: 24px;
  &__title {
    padding: 0 10px;
  }
  &__description {
    height: 35px;
    &-text {
      width: 100px;
      padding: 0 10px 8px 10px;
      height: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: main.$color-gray-500;
    }
  }
  &__info {
    position: relative;
    display: flex;
    overflow: hidden;
    justify-content: space-around;
    border-top: 1px solid main.$color-gray-200;
    gap: 10px;
    padding-top: 5px;
    &-item {
      font-size: 13px;
      @include main.flex-mixin;
      gap: 5px;
    }
  }
  &__avatar {
    direction: ltr;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
