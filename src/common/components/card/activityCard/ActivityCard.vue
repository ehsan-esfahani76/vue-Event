<template>
  <base-card>
    <template #card v-if="data">
      <div class="activity-card">
        <div class="activity-card__slider">
          <activity-card-carousel :images="images" />
        </div>
        <div class="activity-card__title">
          <activity-card-title
            @activate="activeMenu = !activeMenu"
            @deactive="activeMenu = false"
            @menuClick="handleItemClick"
            @confirmModal="confirmHandler(props.id)"
            @cancelModal="cancelHandler"
            :showModal="showModal"
            :id="id"
            :title="data.title"
          />
        </div>
        <div class="activity-card__description">
          <p class="activity-card__description-text">{{ data.description }}</p>
        </div>
        <div class="activity-card__info">
          <div class="activity-card__info-item">
            <base-icon name="calendar" />
            <span>{{ persianDate }}</span>
          </div>
          <div class="activity-card__info-item">
            <base-icon name="clock" />
            <span>{{ data.startTime }} تا {{ data.endTime }}</span>
          </div>
        </div>
        <div
          class="activity-card__tag"
          :style="{
            color: activityType.color,
            backgroundColor: activityType.backgroundColor,
          }"
        >
          {{ activityType.title }}
        </div>
      </div>
    </template>
  </base-card>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";
import ActivityCardCarousel from "./ActivityCardCarousel.vue";
import { ref, watch, onMounted, reactive } from "vue";
import { useFileStorage } from "@/stores/fileStorage/fileStorage";
import { useActivityType } from "@/stores/activityType/activityType";
import { computed } from "@vue/reactivity";
import { useActivity } from "@/stores/activity/activity";
import { toast } from "vue3-toastify";
import { useModal } from "@/stores/modal/modal";
import ActivityCardTitle from "./ActivityCardTitle.vue";
import { convertDate } from "@/common/mixins/mixin.js";
import { storeToRefs } from "pinia";
const fileStore = useFileStorage();
const activityTypeStore = useActivityType();
let images = ref([]);
const activityType = ref({
  title: "",
  color: "",
  backgroundColor: "",
});
const persianDate = ref("");
const showModal = ref(false);
const activeMenu = ref(false);
const activityStore = useActivity();
const modalStore = useModal();
const props = defineProps({
  data: {
    type: Object,
  },
  id: {
    type: String,
  },
});
const getData = (params) => {
  const activityTypeId = props.data.activityType;
  activityType.value.title = activityTypeStore.activityTypes.find((item) => {
    return item._id === activityTypeId;
  });
  activityType.value.backgroundColor = activityType.value.title.backgroundColor;
  activityType.value.color = activityType.value.title.color;
  activityType.value.title = activityType.value.title?.title;
  console.log(activityType.value);
  const date = new Date(+props.data.date);
  persianDate.value = convertDate(date, "D MMMM");
};
const imagesList = storeToRefs(useActivity()).images;
const getFileRequest = (params) => {
  imagesList.value.map((element, index) => {
    if (element.id === props.id) {
      images.value.push(element.result.file.data);
    }
  });
};
const findActivityById = () => {
  const activity = activityStore.activity.find((item) => {
    return item._id === props.id;
  });
  return activity;
};
const handleItemClick = (params) => {
  if (params === "delete") {
    showModal.value = true;
    console.log(params , showModal.value);
  } else {
    const activity = findActivityById();
    modalStore.handleActivityModal();
    activityStore.activityProp = activity;
  }
};
const confirmHandler = async (params) => {
  const response = await activityStore.deleteActivity(params);
  response.status && toast.success("فعالیت حذف شد", { autoClose: 3000 });
  showModal.value = false;
};
const cancelHandler = (params) => {
  showModal.value = false;
};
const backgroundColor = computed(() => {
  return activeMenu.value ? "rgba(0, 0, 0, 0.05)" : "#fff";
});
watch(
  () => imagesList.value,
  () => {
    images.value = [];
    getFileRequest();
  },
  { deep: true, immediate: true }
);
watch(
  () => props,
  () => {
    if (props.data) {
      getData();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity-card {
  width: 100%;
  padding: 10px;
  position: relative;
  background-color: v-bind(backgroundColor);
  border-radius: 24px;
  overflow: hidden;
  &__slider {
    width: 100%;
    height: 180px;
    margin: 0 auto;
    position: relative;
  }
  &__description {
    width: 100%;
    margin-top: 10px;
    color: main.$color-gray-500;
    padding: 0 20px;
    &-text{
      height: 140px;
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
    }
  }
  &__info {
    width: 100%;
    display: flex;
    gap: 10px;
    margin-top: -10px;
    padding: 0 20px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 90%;
      height: 1px;
      background-color: main.$color-gray-200;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
    }
    &-item {
      display: flex;
      gap: 5px;
    }
  }
  &__tag {
    display: inline-block;
    margin: 5px 20px;
    padding: 5px 10px;
    border-radius: 24px;
  }
}
</style>
