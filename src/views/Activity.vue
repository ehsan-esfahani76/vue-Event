<template>
  <div class="activity-Page">
    <Header
      title="فعالیت ها"
      :filter="header"
      :backBtn="true"
      @handleClick="headerItemsClickHandler"
      @clicked="setFilter"
      @date-tags-click="dateTagsClickHandler"
      @activityType-tags-click="activityTypesTagsClickHandler"
      :date="filters.date"
      :apply-filter="applyFilter"
      :activityTypes="filters.activityTypes"
    />
    <div class="activity-Page__main">
      <div v-if="activityList.length === 0" class="activity-Page__empty">
        <img src="@/assets/images/EmptyIllustration.png" alt="" />
        <h2>فعالیتی ندارید</h2>
        <p class="activity-Page__empty-paragraph">
          برای ایجاد فعالیت جدید، آیکون + را بزن
        </p>
      </div>
      <div v-else class="activity-Page__list row">
        <div
          class="activity-Page__item col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3"
          v-for="(activity, index) in activityList"
          :key="activity._id"
        >
          <ActivityCard
            class="activity-Page__item--active"
            :id="activity._id"
            :data="{
              title: activity.tags.title,
              description: activity.data.description,
              date: activity.tags.date,
              startTime: activity.tags.startTime,
              endTime: activity.tags.endTime,
              activityType: activity.data.activityType,
              content: activity.data.content,
            }"
          />
        </div>
      </div>
    </div>
    <FilterModal
      @cancel="closeFilterModal"
      @confirm="confirmFilterModal"
      @clickFilter="filterClickHandler"
      v-model="date"
      v-if="showFilterModal"
      @date-tags-click="dateTagsClickHandler"
      @activityType-tags-click="activityTypesTagsClickHandler"
      :date="filters.date"
      :activityTypes="filters.activityTypes"
      :filters="filtersList"
    />
    <FormFilterModal
      :tags="tags.activityTypes"
      :activityTypeList="activityTypes"
      :title="title"
      @add="addTag"
      @confirm="confirmFilter"
      @cancel="closeFormFilterModal"
      v-if="showFormFilterModal"
    />
  </div>
</template>

<script setup>
import { watch, ref, reactive } from "vue";
import { useActivity } from "@/stores/activity/activity";
import Header from "@/layouts/header/TheHeader.vue";
import ActivityCard from "@/common/components/card/activityCard/ActivityCard.vue";
import FilterModal from "@/common/components/modal/FilterModal.vue";
import FormFilterModal from "@/common/components/modal/FormFilterModal.vue";
import { convertDate, dateToTimeStamp } from "@/common/mixins/mixin";
import { useActivityType } from "@/stores/activityType/activityType";
let activityList = ref([]);
let activityListBackUp = ref([]);
let activityTypeStore = useActivityType();
const activityTypes = ref([]);
const title = ref("");
const date = ref([]);
const store = useActivity();
const headerTitleClicked = ref("");
const headerTitles = [];
const applyFilter = ref(false);
const showFilterModal = ref(false);
const showFormFilterModal = ref(false);
let tags = reactive({
  activityTypes: [],
  date: {
    timeStamp: {},
    date: "",
  },
});
const filters = reactive({
  activityTypes: [],
  date: "",
});
let header = reactive([
  { title: "فیلترها", icon: "filter" },
  { title: "نوع فعالیت", icon: "weight" },
]);
const filtersList = [{ title: "نوع فعالیت", name: "activityType" }];
watch(
  () => activityTypeStore.activityTypes,
  () => {
    header.forEach((title) => {
      headerTitles.push(title.title);
    });
    activityTypes.value = activityTypeStore.activityTypes;
  },
  { immediate: true }
);
const filterClickHandler = (params) => {
  if (params === "نوع فعالیت") {
    title.value = " نوع فعالیت";
    showFormFilterModal.value = true;
  }
};
const addTag = (params) => {
  const findTag = tags.activityTypes.find((item) => item.title === params);
  if (params && findTag === undefined) {
    const id = getActivityTypeByTitle(params);
    tags.activityTypes.push({ title: params, id: id });
  }
};
const confirmFilter = (params) => {
  filters.activityTypes = tags.activityTypes;
  tags.activityTypes = [];
  showFormFilterModal.value = false;
};
const getActivityTypeByTitle = (title) => {
  const findId = activityTypes.value.find((item) => {
    return item.title === title;
  });
  return findId._id;
};
const closeFilterModal = () => {
  showFilterModal.value = false;
};
const closeFormFilterModal = () => {
  showFormFilterModal.value = false;
};
watch(
  () => store.activity,
  async () => {
    activityList.value = store.activity;
  }
);
watch(date, () => {
  let dateText = [];
  date.value.forEach((item, index) => {
    let convertedDate = dateToTimeStamp(item);
    tags.date.timeStamp = {
      from: dateToTimeStamp(date.value[0]),
      to: dateToTimeStamp(date.value[1] ?? date.value[0]),
    };
    convertedDate = convertDate(convertedDate, "DD MMMM");
    dateText.push(convertedDate);
    if (date.value.length === 1) {
      dateText.push(convertedDate);
    }
  });
  dateText = `${dateText[0]} تا ${dateText[1]}`;
  tags.date.date = dateText;
  filters.date = tags.date;
});
const confirmFilterModal = () => {
  updateHeaders();
  applyFilter.value = true;
  setFilter();
  showFilterModal.value = false;
};
const headerItemsClickHandler = (params) => {
  if (params === 0) {
    applyFilter.value = false;
    showFilterModal.value = true;
    headerTitleClicked.value = params;
  } else {
    applyFilter.value = false;
    showFilterModal.value = true;
    showFormFilterModal.value = true;
    headerTitleClicked.value = params;
  }
};
const updateHeaders = () => {
  const hasDateFilter = filters.date.date ? 1 : 0;
  let numberOfTags = filters.activityTypes.length + hasDateFilter;
  if (numberOfTags === 0) {
    header = [
      { title: "فیلترها", icon: "filter" },
      { title: "نوع فعالیت", icon: "weight" },
    ];
  } else {
    header.splice(1, 1);
  }
};
const setFilter = (params) => {
  if (tags.date.timeStamp.from && filters.activityTypes.length > 0) {
    filterByDateAndActivityType();
  } else if (filters.activityTypes.length > 0) {
    filterByActivityType();
  } else {
    filterByDate();
  }
};
const filterByDateAndActivityType = () => {
  activityList.value = store.activity.filter((item) => {
    for (const filter of filters.activityTypes) {
      return (
        item.tags.date >= tags.date.timeStamp.from &&
        item.tags.date <= tags.date.timeStamp.to &&
        item.data.activityType === filter.id
      );
    }
  });
};
const filterByActivityType = () => {
  activityList.value = store.activity.filter((item, index) => {
    for (const filter of filters.activityTypes) {
      return item.data.activityType === filter.id;
    }
  });
};
const filterByDate = () => {
  activityList.value = store.activity.filter((item) => {
    return (
      +item.tags.date >= +tags.date.timeStamp.from &&
      +item.tags.date <= +tags.date.timeStamp.to
    );
  });
};
const dateTagsClickHandler = (value) => {
  filters.date = value;
  updateHeaders();
};
const activityTypesTagsClickHandler = (value) => {
  filters.activityTypes = value;
  updateHeaders();
};
watch(
  () => filters,
  () => {
    console.log(filters);
    if (applyFilter.value) {
      updateHeaders();
    }
    if (filters.activityTypes.length === 0 && !filters.date.date) {
      activityList.value = activityListBackUp.value;
    }
  },
  { deep: true }
);
watch(
  () => store.activity,
  async () => {
    if (store.activity.length === 0) {
      activityList.value = await store.getActivity();
      activityListBackUp.value = activityList.value.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
    } else {
      activityList.value = store.activity.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      activityListBackUp.value = activityList.value;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.activity-Page {
  @include main.grid-system();
  position: relative;
  &__main {
    @include main.breakpoint(992px) {
      height: 90%;
      width: 100vw;
    }
  }
  &__header {
    display: flex;
    flex-wrap: wrap;
  }
  &__empty {
    position: absolute;
    text-align: center;
    top: 50%;
    right: 50%;
    transform: translate(50%, 50%);
    &-paragraph {
      color: main.$color-gray-500;
    }
    @include main.breakpoint(992px) {
      top: 0;
    }
  }
  &__list {
    padding: 0;
    margin-top: 80px;
    @include main.breakpoint(1200px) {
      margin-bottom: 124px;
      margin-top: 20px;
      justify-items: center;
      align-content: center;
    }
  }
  &__item {
    background-color: main.$background-light-surface;
    border-radius: 24px;
    width: 295px;
    height: 465px;
    &-card {
      cursor: pointer;
    }
  }
}
</style>
