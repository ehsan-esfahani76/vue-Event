<template>
  <div class="more-menu">
    <div
      v-if="activeMenu"
      class="more-menu__overlay"
      @click="overlayClickHandler"
    ></div>
    <base-icon class="more-menu__icon" name="more" @click="clickHandler" />
    <div
      class="more-menu__menu"
      :class="activeMenu && 'more-menu__menu--active'"
    >
      <ul class="more-menu__menu-list">
        <li
          class="more-menu__menu-item"
          @click="$emit('clickItem', 'edit'), overlayClickHandler()"
        >
          <base-icon name="edit" />
          <p>ویرایش</p>
        </li>
        <li
          class="more-menu__menu-item"
          @click="$emit('clickItem', 'delete'), overlayClickHandler()"
        >
          <base-icon name="trash" />
          <p>حذف</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const activeMenu = ref(false);
const emits = defineEmits(["activate", "deactive","clickItem"]);
const clickHandler = () => {
  activeMenu.value = !activeMenu.value;
  emits("activate");
};
const overlayClickHandler = () => {
  activeMenu.value = false;
  emits("deactive");
};
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.more-menu {
  position: relative;
  &__icon {
    cursor: pointer;
  }
  &__overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    top: 0;
    right: 0;
    background-color: transparent;
  }
  &__menu {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    z-index: 12;
    left: 20px;
    top: 20px;
    transition: 0.2s;
    &-list {
      border-radius: 16px;
      border-top-left-radius: 0;
      background-color: main.$background-light-surface;
      padding: 5px 10px;
    }
    &-item {
      display: flex;
      gap: 10px;
      margin: 5px 0;
      cursor: pointer;
    }
    &--active {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
