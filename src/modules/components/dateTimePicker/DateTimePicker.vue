<template>
  <div class="date-picker">
    <Field :name="name" v-slot="{ field }" type="text">
      <input
        class="date-picker__input"
        required
        :class="{
          datepicker__error: !!errorMessage,
          datepicker__success: meta.valid,
        }"
        v-bind="field"
        ref="input"
        :value="inputValue"
      />
    </Field>
    <label class="date-picker__label"> {{ label }} </label>
    <span class="date-picker__icon">
      <base-icon name="calendarwhite" />
    </span>
    <persian-datepicker
      popover="top-right"
      class="date-time-picker"
      :format="type === 'date' ? 'YYYY/MM/DD' : 'HH:mm'"
      :type="type"
      v-model="date"
      @change="$emit('update:modelValue', date)"
      @click="handleFocus"
      :min="minimum"
      convertNumbers
    />
  </div>
  <ErrorMessage :name="name" v-slot="{ message }">
    <span class="inputMessage"
      >{{ message }}
      <base-icon name="infoCircle" class="inputMessage__svg" />
    </span>
  </ErrorMessage>
</template>

<script setup>
import { useField, Field, ErrorMessage } from "vee-validate";
import { computed, ref, watch } from "vue";
import { convertDate, dateToTimeStamp } from "@/common/mixins/mixin";
const date = ref("");
const timeStamp = ref();
const input = ref("");
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator(value) {
      return ["date", "time"].includes(value);
    },
  },
  label: {
    type: String,
    required: true,
  },
});
const {
  value: inputValue,
  errorMessage,
  meta,
} = useField(props.name, {
  validateOnValueUpdate: true,
});
const minimum = computed(()=>{
  if(props.type === "date") return new Date().toISOString()
})
watch(date, () => {
  if (props.type === "date") {
    timeStamp.value = dateToTimeStamp(date.value);
    inputValue.value = convertDate(timeStamp.value, "dddd DD MMMM YYYY");
  } else {
    inputValue.value = date.value;
  }
});
const handleFocus = () => {
  input.value.focus();
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.date-picker {
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

  &__input {
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

    &:focus ~ label,
    &:valid ~ label {
      transform: translateY(-25px);
      font-size: 12px;
    }
    @include main.breakpoint(992px) {
      background-color: main.$background-light-default;
    }
  }
}
.datepicker__error {
  background-color: main.$color-warning-200 !important;

  &:focus {
    border-color: main.$color-error-main !important;
  }
}

.datepicker__success {
  background-color: main.$color-primary-100 !important;

  &:focus {
    border-color: main.$color-primary-600 !important;
  }
}
</style>
