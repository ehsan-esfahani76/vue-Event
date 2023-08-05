<template>
  <div class="activity">
    <div class="activity__title">
      <Header title="فعالیت ها" :back-btn="false" />
    </div>
    <ul class="activity__list">
      <template v-if="activityList.length > 0">
        <li
          class="activity__item"
          v-for="(activity) in activityList"
          :key="activity._id"
        >
          <ActivityCard
            class="activity__item--active"
            :id="activity._id"
            :data="{
              title: activity.tags.title,
              description: activity.data.description,
              date: activity.tags.date,
              startTime: activity.tags.startTime,
              endTime: activity.tags.endTime,
              activityType: activity.data.activityType,
              content: activity.data.content,
            }"
          />
        </li>
      </template>
      <template v-if="activityList.length < 4">
        <li class="activity__item" v-for="index in emptyCard" :key="index">
          <ActivityCard @click="clickHandler" class="activity__item-card" />
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useActivity } from "@/stores/activity/activity";
import Header from "@/layouts/header/TheHeader.vue";
import ActivityCard from "@/common/components/card/activityCard/ActivityCard.vue";
import { useModal } from "@/stores/modal/modal";
let activityList = ref([]);
const modalStore = useModal();
const store = useActivity();
const emptyCard = ref(0);
const clickHandler = () => {
  modalStore.handleActivityModal();
};
onMounted(async () => {
  if(store.activity.length === 0)
  await store.getActivity();
});
watch(
  () => store.activity,
  () => {
    if (store.activity.length > 0) {
      activityList.value = store.activity.slice(-4)
    }
    emptyCard.value = 4 - activityList.value.length;
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity {
  &__list {
    @include main.flex-mixin;
    gap: 15px;
    padding: 0;
  }
  &__item {
    background-color: main.$background-light-surface;
    border-radius: 24px;
    width: 24%;
    height: 465px;
    &-card {
      cursor: pointer;
    }
  }
}
</style>
