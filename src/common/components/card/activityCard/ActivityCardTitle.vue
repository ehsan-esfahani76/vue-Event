<template>
  <div class="activity-card-title">
    <h4 class="activity-card-title__name">{{ title }}</h4>
    <more-menu
      :id="id"
      @activate="$emit('activate')"
      @deactive="$emit('deactive')"
      @click-item="menuClick"
    />
    <confirm-modal
      v-if="showModal"
      @confirm="$emit('confirmModal')"
      @cancel="$emit('cancelModal')"
      title="حذف شود؟"
    />
  </div>
</template>

<script setup>
const emit = defineEmits();
import ConfirmModal from "../../modal/ConfirmModal.vue";
const props = defineProps({
  title: {
    type: String,
  },
  showModal: {
    type: Boolean
  },
  id: {
    type: String,
  },
});
function menuClick(params) {
  emit("menuClick", params);
}
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity-card-title {
  width: 100%;
  @include main.flex-mixin(space-between, flex-start);
  margin-top: 10px;
  padding: 0 20px;
  &__name {
    font-weight: bolder;
  }
}
</style>
