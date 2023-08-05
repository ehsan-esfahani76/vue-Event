<template>
  <div class="modal" :style="{ zIndex: zIndex }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  index: {
    type: Number,
    default: 1,
  },
});
const zIndex = ref(props.index);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.modal {
  @include main.flex-mixin;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  background: main.$color-modal;
  direction: ltr;
  transition: all 0.5s;
  overflow: auto;
  overflow-x: hidden;
}
</style>
