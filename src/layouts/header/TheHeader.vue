<template>
  <div class="header">
    <div class="header__title">
      <router-link v-if="backBtn" :to="{ name: 'home' }"
        ><base-icon name="arrowRight" class="header__title-svg"
      /></router-link>
      <h3 class="header__title-text">{{ title }}</h3>
    </div>
    <ul class="header__filter" v-if="filter">
      <li
        v-for="(data, index) in filter"
        :key="index"
        @click="$emit('handleClick', index)"
      >
        <button
          class="header__filter-button"
          :class="numberOfTags > 0 && 'header__filter-button--active'"
        >
          <base-icon
            v-if="data.icon"
            :name="data.icon"
            class="header__filter-svg"
          />
          {{ data.title }}
          <span v-if="numberOfTags > 0">({{ numberOfTags }})</span>
        </button>
      </li>
      <li v-if="filtersTag.activityTypeFilter.length">
        <HeaderTags
          :tags="filtersTag.activityTypeFilter"
          @tag-click="activityTypeFilterHandler"
        />
      </li>
      <li v-if="filtersTag.usersFilter.length">
        <HeaderTags
          :tags="filtersTag.usersFilter"
          @tag-click="usersFilterHandler"
        />
      </li>
      <li v-if="filtersTag.dateFilter.length" class="header__tags">
        <HeaderTags
          :tags="filtersTag.dateFilter"
          @tag-click="dateFilterHandler"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import HeaderTags from "./HeaderTags.vue";
const emit = defineEmits([
  "clicked",
  "userTagsClick",
  "dateTagsClick",
  "activityTypeTagsClick",
]);
let numberOfTags = ref(0);
let filtersTag = ref({
  activityTypeFilter: [],
  dateFilter: [],
  usersFilter: [],
});
const props = defineProps({
  filter: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
  },
  backBtn: {
    type: Boolean,
    default: false,
  },
  users: {
    type: Array,
    required: false,
    default: [],
  },
  activityTypes: {
    type: Array,
    required: false,
    default: [],
  },
  date: {
    type: String,
    required: false,
    default: "",
  },
  applyFilter: {
    type: Boolean,
    required: false,
    default:false
  },
});
watch(
  () => props.applyFilter,
  () => {
    if (props.applyFilter) {
      filtersTag.value.activityTypeFilter = [];
      filtersTag.value.dateFilter = [];
      filtersTag.value.usersFilter = [];
      addActivityTypeFilterTag();
      addDateFilterTag();
      addUsersFilterTag();
      updateFilterList();
    }
  }
);
const updateFilterList = () => {
  const hasDateFilter = props.date ? 1 : 0;
  numberOfTags.value =
    props.activityTypes.length || props.users.length + hasDateFilter;
};
const addDateFilterTag = () => {
  if (props.date) {
    filtersTag.value.dateFilter.push(props.date.date);
  }
};
const addActivityTypeFilterTag = () => {
  props.activityTypes.forEach((item) => {
    if (item.title) {
      filtersTag.value.activityTypeFilter.push(item.title);
    }
  });
};
const addUsersFilterTag = () => {
  props.users.forEach((item) => {
    if (item) {
      filtersTag.value.usersFilter.push(item.firstName);
    }
  });
};
const removeUsersFilterTag = (params) => {
  filtersTag.value.usersFilter = filtersTag.value.usersFilter.filter(
    (item, index) => {
      return index !== params;
    }
  );
};
const usersFilterHandler = (params) => {
  removeUsersFilterTag(params);
  removeUsers(params);
  emit("clicked");
  updateFilterList();
};
const removeUsers = (params) => {
  const fileStoreRemove = props.users.filter((item, index) => {
    return index !== params;
  });
  emit("userTagsClick", fileStoreRemove);
};

const removeActivityTypeTags = (params) => {
  filtersTag.value.activityTypeFilter =
    filtersTag.value.activityTypeFilter.filter((item, index) => {
      return index !== params;
    });
};
const removeActivityType = (params) => {
  const fileStoreRemove = props.activityTypes.filter((item, index) => {
    return index !== params;
  });
  emit("activityTypeTagsClick", fileStoreRemove);
};
const activityTypeFilterHandler = (params) => {
  removeActivityTypeTags(params);
  removeActivityType(params);
  updateFilterList();
};

const removeDateFilterTag = (params) => {
  const filterDate = filtersTag.value.dateFilter.filter((item, index) => {
    return index !== params;
  });
  return filterDate;
};
const dateFilterHandler = (params) => {
  filtersTag.value.dateFilter = removeDateFilterTag(params);
  emit("dateTagsClick", "");
  updateFilterList();
};

watch(
  () => filtersTag.value,
  () => {
    updateFilterList();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.header {
  @include main.flex-mixin(space-between, flex-start);
  @include main.breakpoint(992px) {
    @include main.flex-mixin(space-between, flex-start, column);
  }
  &__filter {
    display: flex;
    gap: 10px;
    &-button {
      @include main.flex-mixin;
      gap: 5px;
      border: 0;
      border-radius: 24px;
      height: 32px;
      padding: 6px 8px;
      cursor: pointer;
      background-color: main.$background-light-surface;
      font-size: 14px;
      &--active {
        background-color: main.$color-primary-200;
        color: main.$color-primary-600;
      }
    }
    &-svg {
      width: 16px;
      height: 16px;
    }
    @include main.breakpoint(992px) {
      padding: 0 30px;
      margin: 20px 0;
    }
  }
  &__title {
    display: flex;
    gap: 10px;
    &-text {
      font-weight: bolder;
    }
    &-svg {
      cursor: pointer;
    }
    @include main.breakpoint(992px) {
      width: 100%;
      padding: 15px 30px;
      background-color: main.$background-light-surface;
    }
  }
}
</style>
