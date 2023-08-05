<template>
  <transition name="fade" mode="out-in">
    <base-modal :index="10">
      <div class="confirm-Modal">
        <h2>{{ title }}</h2>
        <div class="confirm-Modal__buttons">
          <base-button title="تایید" color="red" @click="confirmHandler" :loading="loading"/>
          <base-button title="انصراف" color="white" @click="cancelHandler" />
        </div>
      </div>
    </base-modal>
  </transition>
</template>

<script setup>
const emits = defineEmits(["cofirm", "cancel"]);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  }
});
const confirmHandler = (params) => {
  emits("confirm");
};
const cancelHandler = (params) => {
  emits("cancel");
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.confirm-Modal {
  background-color: main.$background-light-surface;
  width: 400px;
  border-radius: 24px;
  @include main.flex-mixin(space-around, initial, column);
  text-align: center;
  gap: 10px;
  padding: 30px;
  &__buttons {
    display: flex;
    gap: 10px;
    height: 50px;
  }
}
</style>
