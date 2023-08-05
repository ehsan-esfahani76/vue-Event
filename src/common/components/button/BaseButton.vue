<template>
  <button class="button" :type="props.type" :class="buttonClass">
    <div v-if="props.loading">
      <base-loading />
    </div>
    <div v-else>
      {{ props.title }}
    </div>
  </button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "button",
    validator(value) {
      return ["submit", "button"].includes(value);
    },
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    validator(value) {
      return ["blue", "red", "white"].includes(value);
    },
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const buttonClass = ref(`button_${props.color}`);
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.button {
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: center;
  border-radius: 16px;
  border: 0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  &_blue {
    background-color: main.$color-primary-600;
    color: main.$background-light-surface;
    &:hover {
      background-color: main.$color-primary-800;
    }
  }
  &_red {
    background-color: main.$color-error-main;
    color: main.$background-light-surface;
  }
  &_white {
    background-color: main.$background-light-surface;
    color: main.$color-primary-600;
    border: 1px solid main.$color-primary-600;
    &:hover {
      background-color: main.$color-primary-100;
    }
  }
}
</style>
