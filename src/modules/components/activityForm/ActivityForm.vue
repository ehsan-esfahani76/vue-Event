<template>
  <div class="activity-form">
    <div class="activity-form__title">
      <base-icon
        name="arrowRight"
        class="activity-form__title-icon"
        @click="cancelHandler"
      />
      <h3>ایجاد فعالیت</h3>
    </div>
    <div class="activity-form__slider">
      <FileUploader @selectFile="fileSelect" :id="id" />
    </div>
    <div>
      <Form
        @submit="submit"
        :validation-schema="activitySchema"
        :initial-values="formValue"
        class="activity-form__form"
      >
        <div class="activity-form__form-input">
          <base-input
            type="text"
            name="title"
            label="نام فعالیت"
            icon="notewhite"
          />
        </div>
        <base-input
          as="textarea"
          name="description"
          label="توضیحات"
          icon="document"
        />
        <div class="activity-form__calendar">
          <DateTimePicker
            name="date"
            type="date"
            label="تاریخ"
            v-model="inputDate"
          />
        </div>
        <div class="activity-form__clock">
          <div class="activity-form__clock-item">
            <DateTimePicker
              name="startTime"
              type="time"
              label="از ساعت"
            />
          </div>
          <div class="activity-form__clock-item">
            <DateTimePicker
              name="endTime"
              type="time"
              label="تا  ساعت"
            />
          </div>
        </div>
        <div class="activity-form__form-input">
          <base-input
            as="select"
            name="activityType"
            label="نوع فعالیت"
            icon="weightwhite"
          >
            <option>select</option>
            <option
              v-for="(obj, index) in activityTypes"
              :key="index"
              :value="obj._id"
            >
              {{ obj.title }}
            </option>
          </base-input>
        </div>

        <div class="activity-form__button-container">
          <div class="activity-form__button-container-items">
            <base-button title="تایید" color="blue" type="submit" />
            <base-button @click="cancelHandler" title="انصراف" color="white" />
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { Form, ErrorMessage } from "vee-validate";
import { reactive, ref, watch, computed } from "vue";
import { useActivity } from "@/stores/activity/activity";
import { useActivityType } from "@/stores/activityType/activityType";
import { useModal } from "@/stores/modal/modal";
import { useFileStorage } from "@/stores/fileStorage/fileStorage";
import { activitySchema } from "@/plugins/validation/schema";
import { toast } from "vue3-toastify";
import FileUploader from "./fileUploader/FileUploader.vue";
import { convertDate } from "@/common/mixins/mixin";
const activityStore = useActivity();
const id = ref("");
const tempImages = ref({});
const modalStore = useModal();
const activityTypeStore = useActivityType();
const fileStorage = useFileStorage();
const inputDate = ref("");
const files = ref();
const propsDate = ref("");
let activityTypes = reactive([]);
let dataInputs = reactive({
  date: "",
  content: [],
  id: "",
});
let formValue = reactive({});
const props = defineProps({
  activity: {
    type: Object,
    required: false,
    default: {},
  },
});
const submit = async (value) => {
  if (files.value) {
    await fileStorageRequest();
  }
  const form = {...dataInputs,...value}
  activityRequest(form);
};
const fileSelect = (params) => {
  files.value = params;
};
const fileStorageRequest = async (params) => {
  const putFile = await fileStorage.PutFile(files.value);
  if (putFile.length) {
    putFile.forEach((item) => {
      dataInputs.content.push({
        description: "",
        picture: item.id,
      });
    });
  } else {
    dataInputs.content.push({
      description: "",
      picture: putFile.id,
    });
  }
};
const activityRequest = async (form) => {
  if (form.startTime < form.endTime) {
    const PostActivityResult = await requestActivity(form);
    closeModal(PostActivityResult);
  } else {
    toast.error("فاصله زمانی را درست وارد کنید", {
      autoClose: 3000,
    });
  }
};
const postRequest = async (form) => {
  const data = {...form , date:dataInputs.date}
  const PostActivityResult = await activityStore.PostActivity(data);
  files.value &&
    (tempImages.value = {
      picture: dataInputs.content.slice(),
      id: PostActivityResult._id,
    });
  PostActivityResult &&
    toast.success("فعالیت با موفقیت ثبت شد", {
      autoClose: 3000,
    });
  return PostActivityResult;
};
const editRequest = async (form) => {
  form.date = isNaN(+dataInputs.date) ? propsDate.value : dataInputs.date;  
  const PostActivityResult = await activityStore.EditActivity(form);
  files.value &&
    (tempImages.value = {
      picture: dataInputs.content.slice(),
      id: PostActivityResult._id,
    });
  PostActivityResult &&
    toast.success("فعالیت با موفقیت ویرایش شد", {
      autoClose: 3000,
    });
  return PostActivityResult;
};
const requestActivity = async (form) => {
  let result;
  if (props.activity.title) {
    result = await editRequest(form);
  } else {
    result = await postRequest(form);
  }
  return result;
};
const closeModal = (result) => {
  if (result) {
    modalStore.handleActivityModal();
    activityStore.activityProp = {};
    dataInputs.id = "";
  }
};
const cancelHandler = () => {
  modalStore.handleActivityModal();
  activityStore.activityProp = {};
  dataInputs.id = "";
};
watch(inputDate, () => {
  dataInputs.date = new Date(inputDate.value).getTime() + "";
});
watch(
  () => tempImages.value,
  async () => {
    await activityStore.getFileRequest(
      tempImages.value.picture,
      tempImages.value.id
    );
  },
  {
    deep: true,
  }
);
activityTypes = computed(() => {
  if (props.activity.title) {
    propsDate.value = props.activity.date;
    const date = new Date(+props.activity.date);
    const persianDate = convertDate(date, "dddd DD MMMM YYYY");
    formValue = props.activity
    formValue.date = persianDate;
    dataInputs = props.activity;
    dataInputs.date = persianDate;
    id.value = props.activity.id;
  }
  return activityTypeStore.activityTypes;
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.activity-form {
  background-color: main.$background-light-surface;
  position: relative;
  width: 380px;
  border-radius: 24px;
  text-align: center;
  @include main.breakpoint(992px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
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
  &__slider {
    height: 100px;
  }
  &__form {
    position: relative;
    padding: 20px;
    background-color: main.$background-light-surface;
    border-radius: 24px;
    @include main.breakpoint(992px) {
      height: 100%;
      background-color: main.$background-light-default;
      border-radius: 0;
    }
    &-input{
      position: relative;
    }
  }
  &__clock {
    position: relative;
    gap: 20px;
    @include main.flex-mixin(flex-start, flex-start, row-reverse);
    @include main.breakpoint(992px) {
      @include main.flex-mixin(space-around, flex-start, row-reverse);
    }
    &-item {
      position: relative;
      @include main.breakpoint(992px) {
        width: 100%;
      }
    }
  }

  &__calendar {
    position: relative;
  }

  &__button-container {
    width: 100%;
    @include main.breakpoint(992px) {
      height: 100px;
    }

    &-items {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      height: 40px;
      @include main.breakpoint(992px) {
        position: absolute;
        width: 100%;
        right: 0;
        bottom: 0;
        margin: 30px 0;
      }
    }
  }
}
</style>
