<template>
  <base-card>
    <template v-if="title" #card>
      <div class="event-card">
        <div class="event-card__title">
          <EventCardTitle
            :title="title"
            :id="id"
            :show-modal="showModal"
            :has-edit-user="editable"
            @activate="activeMenu = !activeMenu"
            @deactive="activeMenu = false"
            @menu-click="handleItemClick"
            @confirm-modal="confirmHandler(props.id)"
            @cancel-modal="cancelHandler"
            :loading="eventStore.loading"
          />
        </div>
        <div class="event-card__discription">
          <p class="event-card__discription-text">{{ description }}</p>
        </div>
        <ul class="event-card__info">
          <li class="event-card__info-item">
            <base-icon name="calendar" />
            <span>{{ data.date }}</span>
          </li>
          <li class="event-card__info-item">
            <base-icon name="clock" />
            <span>{{ time }}</span>
          </li>
          <li class="event-card__info-item">
            <base-icon name="frame" />
            <span>{{ data.userName }}</span>
          </li>
        </ul>
        <div class="event-card__avatar">
          <EventAvatarView
            :users="userAvatars"
            @add-user="addUser"
            @cancel-person-modal="personCancelHandler"
            @confirm-person-modal="personConfirmHandler"
            :has-edit-user="editable"
            height="38px"
            :usersId="users"
          />
        </div>
        <transition name="fade" mode="out-in" class="event-card__modal">
          <base-modal
            v-if="showEventForm"
            :index="12"
            @click="modalClickHandler"
          >
            <EventForm
              :title="title"
              :dueDate="dueDate"
              :time="time"
              :description="description"
              :users="users"
              :image="image"
              :id="id"
              @close-event-form="eventFormCancelHandler"
              :hasEdit="isShowPersonModal"
            />
          </base-modal>
        </transition>
      </div>
    </template>
  </base-card>
</template>

<script setup>
import EventForm from "@/modules/components/eventForm/EventForm.vue";
import EventAvatarView from "@/modules/components/event/EventAvatarView.vue";
import EventCardTitle from "./EventCardTitle.vue";
import { useUsers } from "@/stores/users/users";
import { convertDate } from "@/common/mixins/mixin";
import { computed, reactive, ref, watch } from "vue";
import { useEvent } from "@/stores/event/event";
import { toast } from "vue3-toastify";
const userStore = useUsers();
const eventStore = useEvent();
const showModal = ref(false);
const showEventForm = ref(false);
const activeMenu = ref(false);
const isShowPersonModal = ref(false)
const data = reactive({
  date: "",
  userName: "",
});
let userAvatars = reactive([]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  editable: {
    type: Boolean,
    required: true,
  },
});
watch(
  () => props,
  () => {
    if (props.dueDate) {
      data.date = convertDate(+props.dueDate, "D MMMM");
      userAvatars = props.image;
      const findUser = userStore.users.find((user) => {
        return user._id === props.userId;
      });
      data.userName = findUser?.firstName;
    }
  },
  { immediate: true, deep: true }
);
const backgroundColor = computed(() => {
  return activeMenu.value ? "rgba(0, 0, 0, 0.05)" : "#fff";
});
const handleItemClick = (params) => {
  if (params === "delete") {
    showModal.value = true;
  } else {
    isShowPersonModal.value = false
    showEventForm.value = true;
  }
};
const confirmHandler = async (params) => {
  const response = await eventStore.deleteEvent(params);
  if (response) {
    toast.success("رویداد حذف شد", { autoClose: 3000 });
  } else {
    toast.error("رویداد حذف نشد", { autoClose: 3000 });
  }
  showModal.value = false;
};
const personCancelHandler = ()=>{
  isShowPersonModal.value = false
}
const personConfirmHandler = ()=>{
  isShowPersonModal.value = false
}
const cancelHandler = (params) => {
  showModal.value = false;
};
const addUser = () => {
  showEventForm.value = true;
  isShowPersonModal.value = true
};
const eventFormCancelHandler = () => {
  showEventForm.value = false;
};
const modalClickHandler = (e) => {
  if (e.target.className.includes("event-card__modal"))
    showEventForm.value = false;
};
</script>
<style scoped lang="scss">
@use "@/assets/sass/main";
.event-card {
  padding: 16px;
  background-color: v-bind(backgroundColor);
  border-radius: 24px;
  height: 262px;
  &__title {
    @include main.flex-mixin(space-between);
  }
  &__discription {
    height: 95px;
    &-text {
      padding: 0 15px 8px 15px;
      height: 92px;
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
      color: main.$color-gray-500;
    }
  }
  &__info {
    @include main.flex-mixin(flex-start);
    border-top: 1px solid main.$color-gray-200;
    gap: 30px;
    padding: 0;
    padding-top: 15px;
    &-item {
      @include main.flex-mixin;
      gap: 5px;
    }
  }
  &__avatar {
    direction: ltr;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
