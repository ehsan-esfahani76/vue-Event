<template>
  <transition name="fade" mode="out-in">
    <base-modal :index="11">
      <div class="filter">
        <div class="filter__modal-title">
          <base-icon
            name="arrowRight"
            class="filter__modal-title-icon"
            @click="cancelHandler"
          />
          <h3>فیلترها</h3>
        </div>
        <div class="filter__inputs">
          <ul class="filter__list">
            <li v-for="filter in filters" class="filter__item">
              <div
                class="filter__title"
                @click="$emit('clickFilter', filter.title)"
              >
                <div>{{ filter.title }}</div>
                <base-icon name="arrowLeft" />
                <persian-datepicker
                  v-if="filter.name === 'date'"
                  popover="top-right"
                  class="date-time-picker filter__date"
                  format="YYYY/MM/DD"
                  type="date"
                  v-model="date"
                  @change="$emit('update:modelValue', date)"
                  convertNumbers
                  range
                />
              </div>
              <div class="filter__filterItems">
                <span
                  class="filter__filterItems-span"
                  v-for="(item, index) in filtersTags[filter.name]"
                >
                  {{ item.title ?? item.firstName }}
                  <base-icon
                    class="filter__filterItems-icon"
                    name="close"
                    @click="tagClickHandler(index, filter.name)"
                /></span>
              </div>
            </li>
            <li class="filter__item">
              <div class="filter__title">
                <div>تاریخ</div>
                <base-icon name="arrowLeft" />
                <persian-datepicker
                  popover="top-right"
                  class="date-time-picker filter__date"
                  format="YYYY/MM/DD"
                  type="date"
                  v-model="date"
                  @change="$emit('update:modelValue', date)"
                  convertNumbers
                  range
                />
              </div>
              <div v-if="filtersTags.date.date" class="filter__filterItems">
                <span class="filter__filterItems-span">
                  {{ filtersTags.date.date }}
                  <base-icon
                    class="filter__filterItems-icon"
                    name="close"
                    @click="tagClickHandler(index, 'date')"
                /></span>
              </div>
            </li>
          </ul>
        </div>
        <div class="filter__buttons">
          <base-button title="لغو" color="white" @click="cancelHandler" />
          <base-button
            title="اعمال فیلتر"
            color="blue"
            @click="confirmHandler"
          />
        </div>
      </div>
    </base-modal>
  </transition>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
let filtersTags = reactive({
  activityType: props.activityTypes,
  date: props.date.date,
  users: props.users,
});
const emits = defineEmits([
  "confirm",
  "cancel",
  "userTagsClick",
  "dateTagsClick",
  "activityTypeTagsClick",
]);
const date = ref();
const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
  activityTypes: {
    type: Array,
    required: false,
    default: [],
  },
  users: {
    type: Array,
    required: false,
    default: [],
  },
  date: {
    type: Object,
    required: false,
    default: {},
  },
});
console.log(filtersTags);
const confirmHandler = (params) => {
  emits("confirm");
};
const cancelHandler = (params) => {
  emits("cancel");
};
const removeActivityTypeTags = (params) => {
  const FilterdActivityType = props.activityTypes.filter((tag, index) => {
    return index !== params;
  });
  return FilterdActivityType;
};
const removeUsersTags = (params) => {
  const FilterdUsers = props.users.filter((tag, index) => {
    return index !== params;
  });
  return FilterdUsers;
};
const tagClickHandler = (params, tag) => {
  let filterTag;
  if (tag === "activityType") {
    filterTag = removeActivityTypeTags(params);
    emits("activityTypeTagsClick", filterTag);
  } else if (tag === "date") {
    emits("dateTagsClick", "");
  } else {
    filterTag = removeUsersTags(params);
    emits("userTagsClick", filterTag);
  }
};
watch(
  () => props,
  () => {
    filtersTags.activityType = props.activityTypes;
    filtersTags.date = props.date;
    filtersTags.users = props.users;
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.filter {
  background-color: main.$background-light-surface;
  width: 400px;
  border-radius: 24px;
  position: relative;
  @include main.flex-mixin(space-around, initial, column);
  text-align: center;
  gap: 10px;
  direction: rtl;
  @include main.breakpoint(992px) {
    @include main.flex-mixin(initial, initial, column);
    height: 100vh;
    width: 100vw;
    border-radius: 0;
    background-color: main.$background-light-default;
  }
  &__modal-title {
    padding-top: 18px;
    &-icon {
      display: none;
    }
    @include main.breakpoint(992px) {
      display: flex;
      gap: 10px;
      text-align: right;
      background-color: main.$background-light-surface;
      padding: 18px;
      &-icon {
        display: block;
      }
    }
  }
  &__list {
    padding: 30px;
    margin: 0;
  }
  &__item {
    position: relative;
    border-bottom: 1px solid main.$color-gray-200;
    padding-bottom: 10px;
    margin: 30px 0;
  }
  &__title {
    @include main.flex-mixin(space-between, flex-start);
    cursor: pointer;
  }
  &__date {
    top: -10px;
  }
  &__filterItems {
    display: flex;
    flex-wrap: wrap;
    &-span {
      @include main.flex-mixin(flex-start, center);
      background-color: main.$color-primary-200;
      color: main.$color-primary-600;
      margin: 5px;
      padding: 5px;
      border-radius: 24px;
    }
    &-icon {
      margin-right: 5px;
      cursor: pointer;
    }
  }
  &__buttons {
    display: flex;
    height: 40px;
    gap: 10px;
    margin: 0 20px 20px 20px;
    @include main.breakpoint(992px) {
      margin: 0;
      position: absolute;
      width: 100%;
      right: 0;
      bottom: 20px;
    }
  }
}
</style>
