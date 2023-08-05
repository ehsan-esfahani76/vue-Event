<template>
  <component :is="RequireComponents" />
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const RequireComponents = defineAsyncComponent(() => {
  return import(`../../../assets/icons/${props.name}.svg`);
});
</script>
