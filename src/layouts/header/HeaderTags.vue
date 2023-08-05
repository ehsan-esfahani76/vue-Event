<template>
  <ul class="header-tag">
    <li class="header-tag__item" v-for="(tags, index) in tags">
      <div class="header-tag__span">
        <span>{{ tags }}</span>
        <span class="header-tag-close">
          <base-icon @click="$emit('tagClick', index)" name="close" />
        </span>
      </div>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  tags: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.header-tag {
  @include main.flex-mixin;
  padding: 0;
  gap: 5px;
  &__item {
    @include main.flex-mixin;
    gap: 5px;
    border: 0;
    border-radius: 24px;
    height: 32px;
    padding: 6px 8px;
    font-size: 14px;
    padding-left: 24px;
    background-color: main.$color-primary-200;
    color: main.$color-primary-600;
    position: relative;
    &__span {
      @include main.flex-mixin;
    }
  }
  &-close {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-40%);
  }
}
</style>
