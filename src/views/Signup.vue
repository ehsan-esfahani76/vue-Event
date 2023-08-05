<template>
  <div class="signup">
    <Form @submitForm="onSubmit" :title="title" schema="signup">
      <template #returnIcon>
        <router-link
          v-if="!isConfirmed"
          :to="{ name: 'login' }"
          class="signup__return"
        >
          <img src="@/assets/images/arrowright.png" alt="" />
        </router-link>
        <button @click="handleBackClick" class="signup__return" v-else>
          <img src="@/assets/images/arrowright.png" alt="" />
        </button>
      </template>
      <div class="signup__inputContainer" v-show="!isConfirmed">
        <base-input
          type="email"
          name="email"
          label="ایمیل"
          v-model="dataInputs.email"
          :value="dataInputs.email"
          icon="RightIcon"
        />
        <ErrorMessage name="email" v-slot="{ message }">
          <span class="inputMessage"
            >{{ message }}
            <base-icon name="infoCircle" class="inputMessage__svg" />
          </span>
        </ErrorMessage>
        <base-input
          :type="typeInput"
          name="password"
          :showPassword="true"
          label="رمز عبور"
          v-model="dataInputs.password"
          :value="dataInputs.password"
          @handleShow="handleShowPassword"
          icon="lock"
        />
        <ErrorMessage name="password" v-slot="{ message }">
          <span class="inputMessage"
            >{{ message }}
            <base-icon name="infoCircle" class="inputMessage__svg" />
          </span>
        </ErrorMessage>

        <div class="signup__button">
          <base-button
            @click="confirmHandle"
            title="تایید"
            color="blue"
            :loading="loading"
          />
        </div>
      </div>
      <div class="signup__inputContainer" v-show="isConfirmed">
        <base-input
          type="text"
          name="text"
          label="نام و نام خانوادگی"
          v-model="name"
          :value="name"
          icon="RightIcon"
        />
        <ErrorMessage name="text" v-slot="{ message }">
          <span class="inputMessage"
            >{{ message }}
            <base-icon name="infoCircle" class="inputMessage__svg" />
          </span>
        </ErrorMessage>
        <base-input
          type="number"
          name="number"
          label="سن"
          v-model.number="dataInputs.age"
          :value="dataInputs.age"
          icon="calendarwhite"
        />
        <ErrorMessage name="number" v-slot="{ message }">
          <span class="inputMessage"
            >{{ message }}
            <base-icon name="infoCircle" class="inputMessage__svg" />
          </span>
        </ErrorMessage>
        <div class="signup__button">
          <base-button
            type="submit"
            title="ثبت نام"
            color="blue"
            :loading="loading"
          />
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import Form from "@/modules/components/form/Form.vue";
import { useAuthenticate } from "../stores/auth/authenticate";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { ErrorMessage } from "vee-validate";
const router = useRouter();
const store = useAuthenticate();
const showError = ref(false);
const isConfirmed = ref(false);
const name = ref("");
const typeInput = ref("password");
const title = ref("ثبت نام");
const loading = ref(false);
let userData = reactive({});
const dataInputs = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  age: "",
});
const onSubmit = async()=> {
  loading.value = true;
  const splitName = name.value.split(" ");
  dataInputs.firstName = splitName[0];
  dataInputs.lastName = splitName.slice(1).join(" ");
  userData = await store.signup(dataInputs);
    loading.value = false;
    showError.value = true;
    showToast();
}
const confirmHandle=()=> {
  if (
    validateEmailInput(dataInputs.email) === true &&
    validatePasswordInput(dataInputs.password) === true
  ) {
    title.value = "اطلاعات فردی";
    isConfirmed.value = true;
  }
}
const showToast=()=> {
  if (userData.data) {
    toast.success("ثبت نام با موفقیت انجام شد", {
      autoClose: 3000,
    });
    router.push({ name: "login" });
  } else {
    toast.error(userData.message.fa, {
      autoClose: 3000,
    });
  }
}
const handleBackClick=()=> {
  if (showError) showError.value = false;
  isConfirmed.value = false;
  title.value = "ثبت نام";
}

const handleShowPassword =()=> {
  if (typeInput.value === "password") {
    typeInput.value = "text";
  } else {
    typeInput.value = "password";
  }
}
const validateEmailInput =(value)=> {
  if (!value) {
    return "";
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]/i;
  if (!regex.test(value)) {
    return "";
  }
  return true;
}

const validatePasswordInput=(value)=> {
  if (!value) {
    return "";
  }
  const regex = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6}/;
  if (!regex.test(value)) {
    return ` `;
  }
  return true;
}
</script>

<style scoped lang="scss">
.signup {
  &__inputContainer {
    width: 70%;
    position: relative;
  }
  &__return {
    border: 0;
    background-color: transparent;
    position: absolute;
    right: 30px;
    cursor: pointer;
    z-index: 3;
  }
  &__title {
    text-align: center;
    margin: 20px 0;
  }
  &__button {
    margin-top: 15px;
    height: 48px;
  }
}
</style>
