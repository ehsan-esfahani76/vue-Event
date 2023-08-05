<script>
</script>

<template>
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
</template>

<style lang="scss">
@use "@/assets/sass/main";
</style>
