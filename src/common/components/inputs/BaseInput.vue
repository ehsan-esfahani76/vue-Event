<template>
  <div
    class="input"
    :class="{
      input_error: !!errorMessage,
      input_success: meta.valid,
    }"
  >
    <Field
      :type="type"
      :value="inputValue"
      :id="name"
      required
      @input="handleChange"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="handleBlur"
      :name="name"
      :as="as"
      rows="5"
      class="input__field"
      :list="list"
    >
      <slot></slot>
    </Field>
    <span class="input__icon">
      <base-icon :name="icon" />
    </span>
    <span
      v-if="showPassword"
      @click="$emit('handleShow')"
      class="input__showpassword"
    >
      <base-icon name="eyeslash" />
    </span>
    <label class="input__label"> {{ props.label }}</label>
  </div>
  <ErrorMessage :name="name" v-slot="{ message }">
    <span class="inputMessage"
      >{{ message }}
      <base-icon name="infoCircle" class="inputMessage__svg" />
    </span>
  </ErrorMessage>
</template>

<script setup>
import { useField, ErrorMessage } from "vee-validate";
import { Field } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
  },
  value: {
    type: [String, Number],
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  as: {
    type: String,
    default: "input",
  },
  list: {
    type: String,
  },
});
const {
  value: inputValue,
  handleChange,
  handleBlur,
  errorMessage,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
});
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.input {
  position: relative;
  &__label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 40px;
    color: #868686;
    display: inline-block;
    transition: 0.5s;
    pointer-events: none;
  }

  &__icon {
    position: absolute;
    top: 53%;
    transform: translate(-30px, -50%);
  }

  &__showpassword {
    position: absolute;
    left: 10px;
    top: 53%;
    transform: translateY(-50%);
    opacity: 0.4;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      opacity: 1;
    }
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__field {
    margin: 15px 0;
    height: 55px;
    width: 100%;
    padding: 15px 40px 15px 0;
    box-sizing: border-box;
    border-radius: 10px;
    direction: rtl;
    font-size: 15px;
    outline: 0;
    border: 1px solid #ccc;
    &:focus ~ .input__label,
    &:valid ~ .input__label {
      transform: translateY(-25px);
      font-size: 12px;
    }
    @include main.breakpoint(992px) {
      background-color: main.$background-light-default;
    }
  }

  textarea {
    @extend input;
    resize: none;
    height: auto;

    & ~ .input__icon {
      top: 25%;
    }

    & ~ .input__label {
      top: 25%;
    }
  }

  select {
    @extend input;
  }

  &_error {
    input,
    select {
      background-color: main.$color-warning-200;

      &:focus {
        border-color: main.$color-error-main;
      }
    }
  }

  &_success {
    input,
    select {
      background-color: main.$color-primary-100;

      &:focus {
        border-color: main.$color-primary-600;
      }
    }
  }
}
</style>
