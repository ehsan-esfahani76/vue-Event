<template>
  <Transition name="fade" mode="out-in">
    <base-modal :index="15">
      <div class="form-Filter">
        <h3>{{ title }}</h3>

        <div class="form-Filter__form">
          <base-input
            type="search"
            class="form-Filter__input"
            list="search"
            label="نوع فعالیت"
            icon="search"
            name="activityType"
            v-model="inputValue"
          />
          <datalist id="search">
            <option
              v-for="activityType in activityTypeList"
              :value="activityType.tags.title"
            ></option>
          </datalist>

          <base-icon
            class="form-Filter__icon"
            name="add"
            @click="$emit('add', inputValue), resetForm()"
          />
        </div>

        <div class="form-Filter__tag">
          <span class="form-Filter__tag-span" v-for="tag in tags">{{
            tag.title
          }}</span>
        </div>
        <div class="form-Filter__buttons">
          <base-button
            title="اعمال فیلتر"
            color="blue"
            @click="confirmHandler"
          />
          <base-button title="لغو" color="white" @click="cancelHandler" />
        </div>
      </div>
    </base-modal>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
import { useForm } from "vee-validate";
const { resetForm } = useForm();
const emits = defineEmits(["cofirm", "cancel"]);
const inputValue = ref("");
const props = defineProps({
  title: {
    type: String,
  },
  activityTypeList: {
    type: Array,
  },
  tags: {
    type: Array,
    default: [],
  },
});
const confirmHandler = (params) => {
  emits("confirm", props.title);
};
const cancelHandler = (params) => {
  emits("cancel");
};
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.form-Filter {
  background-color: main.$background-light-surface;
  width: 400px;
  border-radius: 24px;
  @include main.flex-mixin(space-between, initial, column);
  text-align: center;
  gap: 10px;
  padding: 30px;
  &__form {
    @include main.flex-mixin(space-around, center, row-reverse);
    gap: 10px;
  }
  &__input {
    width: 90%;
  }
  &__icon {
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background-color: main.$background-light-default;
    }
  }
  &__tag {
    direction: rtl;
    display: flex;
    gap: 10px;
    &-span {
      padding: 5px 10px;
      background-color: main.$color-primary-200;
      color: main.$color-primary-600;
      border-radius: 16px;
    }
  }
  &__buttons {
    display: flex;
    height: 40px;
    gap: 10px;
  }
}
</style>
