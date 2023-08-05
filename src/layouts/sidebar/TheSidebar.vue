<template>
  <div class="sidebar">
    <ul class="sidebar__list">
      <li class="sidebar__item">
        <router-link :to="{ name: 'home' }">
          <base-icon name="home" class="sidebar__icon" />
        </router-link>
      </li>
      <li class="sidebar__item sidebar__item-center">
        <router-link :to="{ name: 'event' }">
          <base-icon name="flash" class="sidebar__icon" />
        </router-link>
      </li>
      <li class="sidebar__item sidebar__item-center">
        <router-link :to="{ name: 'activity' }">
          <base-icon name="note" class="sidebar__icon" />
        </router-link>
      </li>
      <li class="sidebar__item sidebar__profile">
        <router-link :to="{ name: '' }">
          <base-icon name="frame3" class="sidebar__icon" />
        </router-link>
      </li>
    </ul>
    <div class="sidebar__button">
      <FloatButton />
    </div>
  </div>
</template>

<script setup>
import FloatButton from "./floatButton/FloatButton.vue";
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.sidebar {
  height: 100vh;
  @include main.breakpoint(992px) {
    position: fixed;
    bottom: 0;
    height: 64px;
    z-index: 11;
    background-color: transparent;
    background-image: url(../../assets/icons/BG.svg);
    background-size: 112vw 100vw;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
  }
  &__list {
    list-style: none;
    padding: 0;
    padding: 15px;
    @include main.breakpoint(992px) {
      @include main.flex-mixin(space-around);
      height: 100%;
      padding: 0;
    }
  }
  &__item {
    width: 50%;
    margin: 15px auto;
    @include main.breakpoint(992px) {
      width: auto;
      margin: 0;
      &-center {
        padding: 0 35px;
      }
    }
  }
  &__profile{
    display: none;
    @include main.breakpoint(992px) {
    display: block;
  }
  }
  &__icon {
    width: 25px;
    height: 25px;
    fill: #dadce5;
  }
  .router-link-active {
    svg {
      fill: main.$color-primary-600;
    }
  }
}
</style>
