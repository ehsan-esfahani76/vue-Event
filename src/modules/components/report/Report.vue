<template>
  <div class="report">
    <div class="report__title">
      <Header title="گزارش ها" :filter="header" :backBtn="false" />
    </div>
    <div class="report__items">
      <div class="report__item report__firstItem">
        <base-card>
          <template #card>
            <div class="report__card">
              <div class="report__icon">
                <base-icon name="report" class="svg" />
                <span>۱</span>
              </div>
              <h5>بدون فعالیت</h5>
            </div>
          </template>
        </base-card>
      </div>
      <div class="report__item report__secondItem">
        <base-card>
          <template #card>
            <div class="report__card">
              <h3 class="report__card-text">بیشترین ها</h3>
              <h5>اولین فعالیت خودت رو بساز</h5>
            </div>
          </template>
        </base-card>
      </div>
      <div class="report__item report__threeItem">
        <base-card>
          <template #card>
            <div class="report__card">
              <h3 class="report__card-text">خلاصه گزارش</h3>
              <h5>اولین فعالیت خودت رو بساز</h5>
            </div>
          </template>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/layouts/header/TheHeader.vue";
import { reactive } from "vue";
const header = reactive([
  { title: "روزانه" },
  { title: " هفتگی" },
  { title: "ماهانه" },
  { title: "سالانه" },
]);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.report {
  @include main.flex-mixin($direction: column);
  width: 100%;
  border-bottom: 5px solid main.$background-light-surface;
  padding-bottom: 50px;
  &__title {
    width: 100%;
  }
  &__items {
    width: 100%;
    margin-top: 20px;
    @include main.flex-mixin;
    gap: 20px;
  }
  &__firstItem {
    flex-grow: 1;
    background-color: main.$background-light-surface;
    border-radius: 24px;
  }
  &__secondItem {
    @extend .report__firstItem;
    flex-grow: 3;
  }
  &__threeItem {
    @extend .report__firstItem;
    flex-grow: 2;
  }
  &__card {
    @include main.flex-mixin($direction: column);
    height: 200px;
    padding: 30px;
    fill: main.$color-gray-200;
    &-text {
      font-weight: bold;
    }
  }
  &__icon {
    position: relative;
    margin-bottom: 6px;
    @include main.flex-mixin;
    span {
      position: absolute;
      font-size: 24px;
      color: main.$background-light-surface;
    }
  }
}
</style>
