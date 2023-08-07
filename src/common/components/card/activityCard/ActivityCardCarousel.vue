<template>
  <Carousel v-bind="settings" class="activity-card-carousel">
    <template v-if="images.length">
      <Slide v-for="(image, index) in images" :key="index">
        <div class="activity-card-carousel__item">
          <img class="activity-card-carousel__img" :src="`data:image/png;base64,${image}`" alt="" />
        </div>
      </Slide>
    </template>
    <template v-else>
      <Slide>
        <div class="activity-card-carousel__emptyItem">
          <img src="@/assets/images/EmptyIllustration.png" alt="" />
        </div>
      </Slide>
    </template>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup>
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";
const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};
const props = defineProps({
  images: {
    type: Array,
    default: [],
  },
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity-card-carousel {
  max-width: 100%;
  height: 180px;
  &:hover {
    .carousel__prev,
    .carousel__next {
      display: block;
    }
  }
  &__item {
    width: 100%;
    height: 180px;
  }
  &__emptyItem {
    width: 100%;
    height: 180px;
    @include main.flex-mixin;
  }
  &__img {
    max-width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 24px;
  }
}
</style>
