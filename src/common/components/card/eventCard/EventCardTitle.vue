<template>
  <div class="event-card-title">
    <h4 class="event-card-title__name">{{ title }}</h4>
    <more-menu
      :id="id"
      @activate="$emit('activate')"
      @deactive="$emit('deactive')"
      @clickItem="menuClick"
      v-if="hasEditUser"
    />
    <confirm-modal
      v-if="showModal"
      @confirm="$emit('confirmModal')"
      @cancel="$emit('cancelModal')"
      title="حذف شود؟"
      :loading="loading"
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
  hasEditUser:{
    type:Boolean,
    required:false,
    default:true
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  }
});
function menuClick(params) {
  emit("menuClick", params);
}
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.event-card-title {
  width: 100%;
  @include main.flex-mixin(space-between, flex-start);
  margin-top: 10px;
  padding: 0 20px;
  &__name {
    font-weight: bolder;
  }
}
</style>
