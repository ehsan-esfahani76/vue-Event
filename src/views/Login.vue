<template>
  <div class="login">
    <Form @submitForm="onSubmit" title="ورود" schema="login">
      <div class="login__inputContainer">
        <base-input
          type="email"
          name="email"
          label="ایمیل"
          v-model="dataInputs.email"
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
          label="رمز عبور"
          :showPassword="true"
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
      </div>
      <div class="login__button">
        <base-button
          type="submit"
          title="ورود"
          color="blue"
          :loading="loading"
        />
      </div>

      <p class="login__paragraph">
        ثبت نام نکرده اید؟
        <router-link :to="{ name: 'signup' }">ثبت نام</router-link>
      </p>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Form from "@/modules/components/form/Form.vue";
import { useAuthenticate } from "../stores/auth/authenticate";
import { reactive, ref } from "vue";
import { ErrorMessage } from "vee-validate";
const store = useAuthenticate();
const router = useRouter();
const typeInput = ref("password");
const loading = ref(false);
let userData = reactive({});
const dataInputs = reactive({
  email: "",
  password: "",
});

const onSubmit = async(values)=> {
  loading.value = true;
  userData = await store.logIn(dataInputs);
  loading.value = false;
  router.push({ name: "home" });
}

const handleShowPassword=(params)=> {
  if (typeInput.value === "password") {
    typeInput.value = "text";
  } else {
    typeInput.value = "password";
  }
}
</script>

<style scoped lang="scss">
.login {
  &__paragraph {
    margin: 10px 0;
    text-align: center;
  }
  &__inputContainer {
    width: 70%;
    position: relative;
  }
  &__return {
    border: 0;
    background-color: transparent;
    position: absolute;
    right: 20px;
    cursor: pointer;
    z-index: 2;
  }
  &__button {
    width: 70%;
    height: 48px;
    margin-top: 15px;
  }
}
</style>
