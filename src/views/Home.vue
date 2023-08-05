<template>
  <div class="home">
    <Report />
    <Event />
    <Activity class="home__activity" />
    <ActivityType class="home__activityType" />
  </div>
</template>

<script setup>
import Report from "@/modules/components/report/Report.vue";
import Event from "@/modules/components/event/Event.vue";
import Activity from "@/modules/components/activity/Activity.vue";
import ActivityType from "@/modules/components/activityType/ActivityType.vue";
</script>

<style scoped lang="scss">
.home {
  &__activity {
    margin-top: 80px;
  }
  &__activityType {
    @extend .home__activity;
  }
}
</style>
