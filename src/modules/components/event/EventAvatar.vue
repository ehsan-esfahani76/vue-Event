<template>
  <div class="event-avatar">
    <img
      class="event-avatar__image"
      :class="isActive && 'event-avatar__image--active'"
      @click="clickHandler"
      :src="image"
      alt=""
    />
    <base-icon v-if="isActive" class="event-avatar__icon" name="tick" />
  </div>
</template>

<script setup>
const emit = defineEmits(["deactivate", "activate"]);
const props = defineProps({
  isActive: {
    type: [Boolean, String],
    default: false,
  },
  image: {
    type: String,
  },
  AvatarHeight:{
    type:String,
    default:"48px"
  }
});
const clickHandler = () => {
  props.isActive ? emit("deactive") : emit("activate")
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.event-avatar {
  position: relative;
  &__image {
    height: v-bind(AvatarHeight);
    background-color: main.$color-gray-200;
    border-radius: 50%;
    &--active {
      border: 4px solid main.$color-primary-500;
    }
  }
  &__icon {
    position: absolute;
    bottom: 10px;
    left: 5px;
  }
}
</style>
