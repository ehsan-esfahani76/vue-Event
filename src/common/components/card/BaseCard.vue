<template>
  <div class="card">
    <base-icon name="Plus" class="card__svg" v-if="!$slots.card" />
    <slot name="card"></slot>
  </div>
</template>


<style scoped lang="scss">
@use "@/assets/sass/main";
.card {
  background-color: transparent;
  height: 100%;
  border-radius: 24px;
  position: relative;
  &__svg {
    position: absolute;
    fill: main.$color-gray-200;
    width: 25px;
    height: 25px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>