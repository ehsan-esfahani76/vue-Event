<template>
  <div class="file-uploader">
    <Carousel v-bind="settings" class="file-uploader__carousel">
      <Slide v-for="(image, index) in files" :key="index">
        <div class="file-uploader__item">
          <base-card @click="handleClick" class="file-uploader__card">
            <template #card>
              <img class="file-uploader__card-img" :src="image" alt="" />
            </template>
          </base-card>
        </div>
      </Slide>

      <Slide v-for="slide in slides" :key="slide">
        <div class="file-uploader__item">
          <base-card @click="handleClick" class="file-uploader__card" />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
    <input
      id="imgUpload"
      type="file"
      class="file-uploader__input"
      ref="input"
      @change="
        handleChange($event);
        $emit('selectFile', formData);
      "
      accept="image/*"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import { useActivity } from "../../../../stores/activity/activity";
const activityStore = useActivity();
const input = ref();
const files = reactive([]);
const slides = ref(3);
const imageData = ref();
const formData = new FormData();
const settings = {
  itemsToShow: 3,
  snapAlign: "center",
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const handleClick = (e) => {
  if (e.target.src) {
    return;
  }
  input.value.click();
};
const handleChange = (e) => {
  if (input.value.files[0]) {
    let url = URL.createObjectURL(input.value.files[0]);
    imageData.value = url;
  }
  formData.append("image", input.value.files[0], e.target.value);
};
watch(imageData, () => {
  files.push(imageData.value);
  if (files.length >= 3) {
    slides.value = 1;
  } else if (files.length === 2) {
    slides.value = slides.value + 1 - files.length;
  } else {
    slides.value = slides.value - files.length;
  }
});
watch(
  () => props,
  () => {
    activityStore.images.forEach((item) => {
      if (item.id === props.id) {
        files.push(item.reader.result);
      }
    });
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.file-uploader {
  position: relative;
  width: 100%;
  margin: 10px 0;

  &__item {
    background-color: main.$background-light-default;
    min-width: 96px;
    height: 96px;
    border-radius: 24px;
    margin: 0 5px;
    @include main.breakpoint(992px) {
    background-color: main.$background-light-surface;
  }
  }

  &__card {
    cursor: pointer;
    overflow: hidden;

    &-img {
      max-width: 100%;
      height: 96px;
      object-fit: cover;
    }
  }

  &__input {
    position: absolute;
    display: none;
  }
}
</style>
