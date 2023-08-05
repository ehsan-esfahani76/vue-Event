<template>
  <div class="container">
    <div class="form">
      <slot name="returnIcon"></slot>
      <div class="form__logo">
        <img src="@/assets/images/Image.png" alt="" />
        <img src="@/assets/images/vector.png" alt="" />
      </div>
      <Form
        @submit="$emit('submitForm')"
        :validation-schema="schema === 'login' ? loginSchema : signupSchema"
        class="form__form"
      >
        <h2 class="form__title">{{ props.title }}</h2>
        <slot></slot>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { Form } from "vee-validate";
import { loginSchema, signupSchema } from "@/plugins/validation/schema";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  schema: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.container {
  height: 100vh;
  @include main.flex-mixin(center, center, column);
}
.form {
  background-color: main.$background-light-surface;
  padding: 20px 50px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  &__form {
    @include main.flex-mixin(flex-start, center, column);
    width: 100%;
    position: relative;
    top: -20px;
  }
  &__title {
    text-align: center;
    margin: 10px 0;
  }
  &__logo {
    position: relative;
    & :nth-child(1) {
      position: relative;
      z-index: 2;
    }
    & :nth-child(2) {
      position: absolute;
      top: -50px;
      right: 0;
      z-index: 0;
      opacity: 0.6;
    }
  }
}
</style>
