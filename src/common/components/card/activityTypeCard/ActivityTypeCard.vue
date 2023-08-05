<template>
  <base-card>
    <template v-if="activityType" #card>
      <div class="activity-Type-Card">
        <div class="activity-Type-Card__title">
          <h4 class="activity-Type-Card__title-text">
            {{ activityType.title }}
          </h4>
          <base-icon name="more" />
        </div>
        <div class="activity-Type-Card__info">
          <base-icon name="notewhite" />
          <span>{{ activityCounter.length }} فعالیت</span>
        </div>
      </div>
    </template>
  </base-card>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useActivity } from "@/stores/activity/activity";

const activityStore = useActivity();
let activityList = reactive([]);
const activityCounter = ref(0);
const props = defineProps({
  activityType: {
    type: Object,
  },
});

const numberOfActivities = () => {
  activityCounter.value = activityList.filter((item) => {
    return item.data.activityType === props.activityType.id;
  });
};
watch(
  () => [props.activityType , activityStore.activity],
  async () => {
    if (props.activityType) {
      if (activityStore.activity.length > 0) {
        activityList = activityStore.activity;
      }
      numberOfActivities();
    }
  },
  { immediate: true }
);
watch(
  () => activityStore.activity,
  () => {
    numberOfActivities();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.activity-Type-Card {
  padding: 14px 30px;
  &__title {
    @include main.flex-mixin(space-between, flex-start);
    &-text {
      font-weight: bolder;
    }
  }
  &__info {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}
</style>
