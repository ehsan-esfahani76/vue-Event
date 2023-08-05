<template>
  <div class="activity-Type">
    <div class="activity-Type__title">
      <Header title="نوع فعالیت" :back-btn="false" />
    </div>
    <div class="activity-Type__items">
      <div
        class="activity-Type__item"
        v-for="(activityType, index) in activityTypeList"
        :key="index"
      >
        <ActivityTypeCard
          :activityType="{
            id: activityType._id,
            title: activityType.title,
          }"
        />
      </div>
      <template v-if="activityTypeList?.length < 4">
        <div
          class="activity-Type__item"
          v-for="card in 4 - activityTypeList.length"
          :key="card"
        >
          <ActivityTypeCard />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ActivityTypeCard from "@/common/components/card/activityTypeCard/ActivityTypeCard.vue";
import Header from "@/layouts/header/TheHeader.vue";
import { useActivityType } from "@/stores/activityType/activityType";
const activityTypeStore = useActivityType();
const activityTypeList = ref([]);
onMounted(async () => {
  activityTypeList.value = await activityTypeStore.GetActivityType();
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity-Type {
  margin-top: 80px;
  &__items {
    @include main.flex-mixin;
    gap: 15px;
  }
  &__item {
    background-color: main.$background-light-surface;
    border-radius: 24px;
    width: 25%;
    height: 104px;
  }
}
</style>
