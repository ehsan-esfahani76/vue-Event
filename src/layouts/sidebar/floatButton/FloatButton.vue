<template>
  <div class="float-button" :class="floatButtonIsOpen && 'float-button--open'">
    <div @click="handleClick" class="float-button__icon">
      <span class="float-button__icon-container">
        <base-icon name="Plus" class="float-button__icon-svg" />
      </span>
    </div>
    <transition name="fade" mode="out-in">
      <base-modal
        v-if="floatButtonIsOpen"
        :index="10"
        class="float-button__modal"
      >
        <ul class="float-button__list">
          <li class="float-button__item item1">
            <button @click="eventHandler" class="float-button__item-button">
              <base-icon name="flash" class="float-button__item-svg" />
            </button>
            <span>رویداد</span>
          </li>
          <li class="float-button__item item2">
            <button class="float-button__item-button">
              <base-icon name="weight" class="float-button__item-svg" />
            </button>
            <span> نوع فعالیت</span>
          </li>
          <li class="float-button__item item3">
            <button @click="activityHandler" class="float-button__item-button">
              <base-icon name="note" class="float-button__item-svg" />
            </button>
            <span>فعالیت</span>
          </li>
        </ul>
      </base-modal>
    </transition>
    <transition name="fade" mode="out-in">
      <base-modal
        v-if="modalStore.activityModal"
        :index="12"
        class="float-button__modal"
      >
        <ActivityForm
          :activity="{
            title: activity.tags?.title,
            description: activity.data?.description,
            date: activity.tags?.date,
            startTime: activity.tags?.startTime,
            endTime: activity.tags?.endTime,
            activityType: activity.data?.activityType,
            id: activity?._id,
            content: activity.data?.content,
          }"
        />
      </base-modal>
    </transition>
    <transition name="fade" mode="out-in" class="float-button__modal">
      <base-modal v-if="showEventForm" :index="12" @click="modalClickHandler">
        <EventForm @close-event-form="eventFormCancelHandler" />
      </base-modal>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useModal } from "@/stores/modal/modal";
import ActivityForm from "@/modules/components/activityForm/ActivityForm.vue";
import { useActivity } from "@/stores/activity/activity";
import EventForm from "@/modules/components/eventForm/EventForm.vue";
const modalStore = useModal();
const floatButtonIsOpen = ref(false);
const activityStore = useActivity();
let activity = reactive([]);
const showEventForm = ref(false);
const handleClick = () => {
  floatButtonIsOpen.value = !floatButtonIsOpen.value;
};
const activityHandler = () => {
  floatButtonIsOpen.value = false;
  modalStore.handleActivityModal();
};
const eventHandler = () => {
  floatButtonIsOpen.value = false;
  showEventForm.value = true;
};
const eventFormCancelHandler = () => {
  showEventForm.value = false;
};
watch(
  () => activityStore.activityProp,
  () => {
    if (activityStore.activityProp) {
      activity = activityStore.activityProp;
    } else {
      activity = [];
    }
  }
);
const modalClickHandler = (e) => {
  if (e.target.className.includes("float-button__modal"))
    showEventForm.value = false;
};
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.float-button {
  width: 100%;
  height: 100%;
  &__icon {
    @include main.flex-mixin;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: main.$color-primary-600;
    cursor: pointer;
    z-index: 11;
    position: absolute;
    bottom: 200px;
    right: 10px;
    @include main.breakpoint(992px) {
      position: absolute;
      right: 50%;
      bottom: 40px;
      transform: translateX(25px);
    }
    &-container {
      transition: 0.4s;
      transform: translate(0px, 5px);
    }

    &-svg {
      width: 28px;
      height: 28px;
      fill: main.$background-light-surface;
    }
  }
  &__list {
    width: 20%;
    height: 300px;
    position: fixed;
    bottom: 5%;
    right: 0px;
    z-index: 4;
    margin: 0;
    @include main.breakpoint(992px) {
      width: 40%;
      padding: 0;
      right: 50%;
      transform: translateX(50%);
    }
    @include main.breakpoint(768px) {
      width: 80%;
      padding: 0;
      right: 50%;
      transform: translateX(50%);
    }
  }

  &__item {
    font-size: 18px;
    font-weight: 600;
    color: main.$background-light-surface;
    position: absolute;
    right: 5px;
    z-index: 6;
    top: 25%;
    transform: scale(0.3);
    transition: 0.4s;
    width: 100px;
    height: 100px;
    @include main.flex-mixin($direction: column);
    @include main.breakpoint(992px) {
      top: 80%;
      right: 35%;
      transform: translateX(50%);
      transform: scale(0.1);
    }
    &-button {
      width: 64px;
      height: 64px;
      border-radius: 24px;
      background-color: main.$background-light-surface;
      border: 0;
      margin-bottom: 10px;
      cursor: pointer;
    }

    &-svg {
      width: 28px;
      height: 28px;
      margin-top: 8px;
    }
  }

  &--open {
    .float-button__icon-container {
      transform: rotate(135deg) translate(0px, 5px);
      color: white;
    }
  }

  &--open {
    .item1 {
      transform: translate(-5px, -150px) scale(1);
      transition-delay: 0.3s;
      fill: #f7953b;
      @include main.breakpoint(992px) {
        position: absolute;
        left: 0;
        top: 130px;
        transform: translate(0) scale(1);
      }
    }

    .item2 {
      transform: translate(-100px, -105px) scale(1);
      transition-delay: 0.2s;
      fill: #1dadfe;
      @include main.breakpoint(992px) {
        position: absolute;
        left: 50%;
        top: 50px;
        transform: translate(-50%) scale(1);
      }
    }

    .item3 {
      transform: translate(-150px, 0px) scale(1);
      bottom: 0.5em;
      fill: #ffbf00;
      @include main.breakpoint(992px) {
        position: absolute;
        right: 0;
        top: 130px;
        transform: translate(0) scale(1);
      }
    }
  }
}
</style>
