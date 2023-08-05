<template>
  <div class="event-form">
    <div class="event-form__title">
      <base-icon
        name="arrowRight"
        class="event-form__title-icon"
        @click="cancelHandler"
      />
      <h3>ایجاد رویداد</h3>
    </div>
    <div class="event-form__form">
      <Form
        @submit="submit"
        :validation-schema="eventSchema"
        :initial-values="initialFormValue"
        class="event-form__main-form"
      >
        <base-input
          name="title"
          type="text"
          label="نام فعالیت"
          icon="notewhite"
          :value="title"
        />
        <base-input
          name="description"
          as="textarea"
          label="توضیحات"
          icon="document"
          :value="description"
        />
        <div class="event-form__calendar">
          <DateTimePicker
            name="dueDate"
            type="date"
            label="تاریخ"
            v-model="inputDate"
          />
        </div>
        <div>
          <DateTimePicker name="time" type="time" label="از ساعت" />
        </div>
        <div class="event-form__users">
          <EventAvatarView
            :users="avatars"
            @add-user="addPersonClickHandler"
            @confirm-person-modal="handleConfirmPerson"
            @cancel-person-modal="cancelPersonClickHandler"
            :usersId="dataInputs.users"
            :showPersonModal="showPersonModal"
          />
        </div>
        <div class="event-form__button">
          <base-button
            title="تایید"
            color="blue"
            type="submit"
            :loading="eventStore.loading"
          />
          <base-button @click="cancelHandler" title="انصراف" color="white" />
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { Form } from "vee-validate";
import { computed, reactive, ref, watch } from "vue";
import { useEvent } from "@/stores/event/event";
import { useUsers } from "@/stores/users/users";
import { toast } from "vue3-toastify";
import { dateToTimeStamp } from "@/common/mixins/mixin";
import { eventSchema } from "@/plugins/validation/schema";
import EventAvatarView from "../event/EventAvatarView.vue";
import { convertDate } from "../../../common/mixins/mixin";
const inputDate = ref("");
const eventStore = useEvent();
const userStore = useUsers();
let avatarsTemp = [];
const showPersonModal = ref(props.hasEdit ?? false);
let avatars = reactive([]);
const formValue = reactive({});
const dataInputs = reactive({
  dueDate: "",
  id: "",
  users: [],
});
const emit = defineEmits(["closeEventForm"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  dueDate: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  users: {
    type: Array,
    required: false,
  },
  image: {
    type: Array,
    required: false,
  },
  hasEdit: {
    type: Boolean,
    required: false,
  }
});
const dueDate = props.dueDate;
const submit = (values) => {
  const form = { ...values, ...dataInputs };
  eventRequest(form);
};

const eventRequest = (params) => {
  let PostActivityResult = props.title
    ? editRequest(params)
    : postRequest(params);
  if (PostActivityResult) {
    emit("closeEventForm");
    dataInputs.id = "";
  }
};
const editRequest = async (params) => {
  const date = isNaN(+dataInputs.dueDate) ? dueDate : dataInputs.dueDate;
  params.dueDate = date;
  let PostActivityResult = await eventStore.editEvent(params);
  if (PostActivityResult) {
    toast.success("رویداد با موفقیت ویرایش شد", {
      autoClose: 3000,
    });
    return PostActivityResult;
  } else {
    toast.error("رویداد ویرایش نشد", {
      autoClose: 3000,
    });
  }
};
const postRequest = async (params) => {
  params.date = dataInputs.dueDate;
  let PostActivityResult = await eventStore.shareEvent(params);
  if (PostActivityResult) {
    toast.success("رویداد با موفقیت ثبت شد", {
      autoClose: 3000,
    });
    return PostActivityResult;
  } else {
    toast.error("رویداد ثبت نشد", {
      autoClose: 3000,
    });
  }
};
const cancelHandler = () => {
  emit("closeEventForm");
  dataInputs.id = "";
};
watch(inputDate, () => {
  dataInputs.dueDate = new Date(inputDate.value).getTime() + "";
});
watch(
  () => dataInputs.users,
  () => {
    avatarsTemp = [];
    dataInputs.users.forEach((item) => {
      userStore.users.forEach((user) => {
        if (user._id === item) {
          avatarsTemp.push(user.image);
        }
      });
    });
    if (avatars.length === 0) {
      avatars = avatarsTemp;
    }
  },
  { deep: true, immediate: true }
);
const initialFormValue = computed(() => {
  if (props.dueDate) {
    const prop = props;
    dataInputs.dueDate = convertDate(+prop.dueDate, "dddd DD MMMM YYYY");
    dataInputs.users = prop.users;
    dataInputs.id = prop.id;
    formValue.title = props.title;
    formValue.time = props.time;
    formValue.description = props.description;
    formValue.dueDate = convertDate(+props.dueDate, "dddd DD MMMM YYYY");
    return formValue;
  } else {
    avatars = [];
  }
});
const addPersonClickHandler = () => {
  showPersonModal.value = true;
};
const cancelPersonClickHandler = () => {
  showPersonModal.value = false;
};
const handleConfirmPerson = (value) => {
  dataInputs.users = value;
  avatars = avatarsTemp;
  showPersonModal.value = false;
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.event-form {
  background-color: main.$background-light-surface;
  width: 380px;
  height: 632px;
  border-radius: 24px;
  text-align: center;
  @include main.breakpoint(992px) {
    width: 100vw;
    border-radius: 0;
    height: 100vh;
    background-color: main.$background-light-default;
  }
  &__title {
    padding-top: 18px;
    &-icon {
      display: none;
    }
    @include main.breakpoint(992px) {
      display: flex;
      gap: 10px;
      flex-direction: row-reverse;
      text-align: right;
      background-color: main.$background-light-surface;
      padding: 18px;
      &-icon {
        display: block;
      }
    }
  }
  &__form {
    position: relative;
    height: 90%;
    padding: 20px;
  }
  &__main-form {
    position: relative;
  }
  &__clock {
    display: flex;
    flex-direction: row-reverse;
    gap: 20px;
  }

  &__calendar {
    position: relative;
  }

  &__users {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-top: 10px;
    height: 57px;
  }
  &__button {
    display: flex;
    gap: 10px;
    margin-bottom: 40px;
    height: 40px;
    @include main.breakpoint(992px) {
      position: absolute;
      width: 100%;
      right: 0;
      top: 100%;
      margin-top: 15px;
    }
  }
}
</style>
