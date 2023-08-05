<template>
  <div class="dashboard">
    <div class="dashboard__sidebar">
      <Sidebar />
    </div>
    <div class="dashboard__home">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="dashboard__calendarContainer">
      <div class="dashboard__profile">
        <div class="dashboard__profileInfo">
          <div class="dashboard__profileImage">
            <img :src="ProfileIcon" alt="" />
          </div>
          <div class="dashboard__profileName">
            <h4 class="dashboard__profileName-name" v-if="userInfo">
              {{ userInfo.firstName }} {{ userInfo.lastName }}
            </h4>
            <p class="dashboard__profileName-event">بدون رویداد</p>
          </div>
        </div>
        <div class="dashboard__profileAlert">
          <base-icon name="notification" class="svg" />
        </div>
      </div>
      <div class="dashboard__calendar">
        <Calendar v-model="date" :events="eventList" />
      </div>
      <div class="dashboard__event">
        <h4 class="dashboard__event-title">رویدادهای امروز</h4>
        <base-loading v-if="eventStore.loading"/>
        <template v-else>
          <template v-if="eventList.length">
            <div class="dashboard__eventItem" v-for="event in eventList">
              <EventCardSidebar
                :title="event.tags.title"
                :dueDate="event.tags.dueDate"
                :time="event.data.time"
                :description="event.data.description"
                :image="event.images"
                :userId="event.tags.userId"
              />
            </div>
          </template>
          <div v-else class="dashboard__eventItem">
            <base-card/>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/layouts/sidebar/TheSidebar.vue";
import Calendar from "@/modules/components/calendar/Calendar.vue";
import ProfileIcon from "@/assets/images/Avatar.png";
import EventCardSidebar from "@/common/components/card/eventCardSidebar/EventCardSidebar.vue";
import { onMounted, ref, watch } from "vue";
import moment from "jalali-moment";
import { dateToTimeStamp } from "../common/mixins/mixin";
import { useEvent } from "../stores/event/event";
const eventStore = useEvent();
let userInfo = ref({});
let eventList = ref({});
const date = ref("");
const currentDate = new Date().toLocaleString("en").split(",")[0];
onMounted(() => {
  const info = localStorage.getItem("info");
  userInfo.value = JSON.parse(info);
});

watch(
  date,
  () => {
    eventList.value = eventStore.events.filter((item) => {
      return +item.tags.dueDate === date.value;
    });
  },
  { immediate: true }
);

watch(
  () => eventStore.events,
  () => {
    const timeStamp = dateToTimeStamp(currentDate);
    eventList.value = eventStore.events.filter((item) => {
      return +item.tags.dueDate === timeStamp;
    });
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.dashboard {
  direction: rtl;
  display: grid;
  grid-template-columns: 71px 20fr 6fr;
  height: 100vh;
  @include main.breakpoint(1400px) {
    grid-template-columns: 71px 9fr 5fr;
  }
  @include main.breakpoint(992px) {
    grid-template-columns: 8fr;
  }
  &__sidebar {
    @include main.breakpoint(992px) {
      width: 100%;
    }
  }
  &__home {
    border-radius: 25px;
    background-color: main.$background-light-default;
    padding: 50px 70px;
    height: 100vh;
    overflow-y: auto;
    @include main.breakpoint(1400px) {
      display: grid;
      justify-content: center;
      grid-template-columns: 100%;
      padding: 50px 20px;
    }
    @include main.breakpoint(992px) {
      padding: 0;
      overflow: visible;
    }
  }
  &__calendarContainer {
    background-color: main.$background-light-surface;
    height: 100vh;
    overflow: auto;
    overflow-x: hidden;
    align-items: center;
    @include main.breakpoint(992px) {
      display: none;
    }
  }
  &__calendar {
    width: 90%;
    margin: 0 auto;
    height: 400px;
  }
  &__profile {
    @include main.flex-mixin(space-between);
    margin: 0 auto;
    width: 80%;
    height: 100px;
  }
  &__profileInfo {
    @include main.flex-mixin;
    gap: 10px;
  }
  &__profileImage {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: main.$background-light-default;
  }
  &__profileName {
    &-name {
      font-weight: bold;
    }
    &-event {
      font-size: 14px;
      color: main.$color-gray-500;
    }
  }
  &__profileAlert {
    cursor: pointer;
  }
  &__event {
    @include main.flex-mixin(flex-start, center, column);
    width: 100%;
    padding: 20px 0;
    gap: 12px;
    &-title {
      align-self: start;
      width: 80%;
      margin: 0 auto;
      font-weight: bold;
    }
  }
  &__eventItem {
    width: 80%;
    height: 132px;
    border-radius: 24px;
    background-color: main.$background-light-default;
  }
}
</style>
