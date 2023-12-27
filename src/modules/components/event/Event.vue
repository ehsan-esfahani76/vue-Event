<template>
  <div class="event">
    <div class="event__title">
      <Header title="رویداد ها" :back-btn="false" />
    </div>
    <div v-if="store.loading" class="event__loading">
      <base-loading />
    </div>
    <ul class="event__list" v-else>
      <template v-if="eventList.length">
        <li class="event__item" v-for="event in eventList" :key="event._id">
          <EventCard
            class="event__item--active"
            :title="event.tags.title"
            :dueDate="event.tags.dueDate"
            :time="event.data.time"
            :description="event.data.description"
            :users="event.data.users"
            :image="event.images"
            :userId="event.tags.userId"
            :editable="event.editable"
            :id="event._id"
          />
        </li>
      </template>
      <template v-if="eventList.length < 3">
        <li class="event__item" v-for="index in emptyCard" :key="index">
          <base-card class="event__item-card" />
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useEvent } from "@/stores/event/event.js";
import Header from "@/layouts/header/TheHeader.vue";
import EventCard from "@/common/components/card/eventCard/EventCard.vue";
let eventList = ref([]);
const store = useEvent();
const emptyCard = ref(0);
onMounted(async () => {
  if (!store.events.length) await store.getEvent();
});
watch(
  () => store.events,
  () => {
    eventList.value = store.events?.slice(-3);
    emptyCard.value = 3 - eventList.value.length;
  },
  { immediate: true, deep: true }
);
navigator.serviceWorker.addEventListener("message", (event) => {
  const { type, isDone, message } = event.data;
  if (type === "event" && isDone) {
    toast.success(message, { autoClose: 3000 });
    store.getEvent();
  } else if (type === "event" && !isDone) {
    toast.error(message, {
      autoClose: 3000,
    });
  }
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.event {
  margin-top: 80px;
  &__loading {
    height: 262px;
    width: 100%;
    @include main.flex-mixin;
  }
  &__list {
    @include main.flex-mixin;
    padding: 0;
    gap: 15px;
  }
  &__item {
    border-radius: 24px;
    height: 262px;
    width: 33%;
    background-color: main.$background-light-surface;
    &-card {
      cursor: pointer;
    }
  }
}
</style>
