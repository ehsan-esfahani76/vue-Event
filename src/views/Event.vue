<template>
  <div class="event-page">
    <Header
      title="رویداد ها"
      :filter="header"
      :back-btn="true"
      @handle-click="headerItemsClickHandler"
      @clicked="setFilter"
      :users="filters.users"
      :date="filters.date"
      :apply-filter="applyFilter"
      @user-tags-click="userTagsClickHandler"
      @date-tags-click="dateTagsClickHandler"
    />
    <div v-if="store.loading" class="event-page__loading">
      <base-loading />
    </div>
    <div class="event-page__main" v-else>
      <div v-if="!eventList.length" class="event-page__empty">
        <img :src="emptyImage" alt="" class="event-page__empty-image" />
        <h2>رویدادی ندارید</h2>
        <p class="event-page__empty-paragraph">
          برای ایجاد رویداد جدید، آیکون + را بزن
        </p>
      </div>
      <ul v-else class="event-page__list row">
        <li
          class="event-page__item col-sm-12 col-md-6 col-lg-12 col-xl-6 col-xxl-4"
          v-for="(event, index) in eventList"
          :key="event._id"
        >
          <EventCard
            class="event-page__item--active"
            :title="event.tags.title"
            :dueDate="event.tags.dueDate"
            :time="event.data.time"
            :description="event.data.description"
            :users="event.data.users"
            :image="event.images"
            :userId="event.tags.userId"
            :editable="event.editable"
            :id="event._id"
          />
        </li>
      </ul>
    </div>
    <FilterModal
      @cancel="closeFilterModal"
      @confirm="confirmFilterModal"
      @click-filter="filterClickHandler"
      v-model="date"
      :has-activity="false"
      :users="filters.users"
      :date="filters.date"
      :filters="filtersList"
      @user-tags-click="userTagsClickHandler"
      @date-tags-click="dateTagsClickHandler"
      v-if="showFilterModal"
    />
    <PersonModal
      v-if="showPersonModal"
      title="افراد"
      @cancel="personClickHandler"
      @confirm="confirmModal"
      :usersId="selectedUsers"
    />
  </div>
</template>

<script setup>
import emptyImage from "@/assets/images/EmptyIllustration.png";
import { watch, ref, onMounted, reactive } from "vue";
import { toast } from "vue3-toastify";
import { useEvent } from "@/stores/event/event.js";
import Header from "@/layouts/header/TheHeader.vue";
import EventCard from "@/common/components/card/eventCard/EventCard.vue";
import FilterModal from "@/common/components/modal/FilterModal.vue";
import PersonModal from "@/common/components/modal/PersonModal.vue";
import { useModal } from "@/stores/modal/modal";
import { useUsers } from "../stores/users/users";
import { dateToTimeStamp, convertDate } from "../common/mixins/mixin";
let eventList = ref([]);
let eventListBackUp = ref([]);
const date = ref([]);
const store = useEvent();
const modalStore = useModal();
const userStore = useUsers();
const showPersonModal = ref(false);
const headerTitleClicked = ref("");
let selectedUsers = reactive([]);
const applyFilter = ref(false);
const showFilterModal = ref(false);
let tags = reactive({
  date: {
    timeStamp: {},
    date: "",
  },
});
let filters = reactive({
  users: [],
  date: "",
});
let header = reactive([
  { title: "فیلترها", icon: "filter" },
  { title: "افراد", icon: "frame2" },
]);
const filtersList = [{ title: "افراد", name: "users" }];
onMounted(async () => {
  if (!store.events.length) await store.getEvent();
});
watch(
  () => store.events,
  () => {
    if (store.events.length) {
      eventList.value = store.events.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      eventListBackUp.value = eventList.value;
    }
  },
  { immediate: true, deep: true }
);
const filterClickHandler = (params) => {
  if (params === "افراد") showPersonModal.value = true;
};
const closeFilterModal = () => {
  showFilterModal.value = false;
};
const updateHeaders = () => {
  const hasDateFilter = filters.date ? 1 : 0;
  let numberOfTags = filters.users.length + hasDateFilter;
  if (!numberOfTags) {
    header = [
      { title: "فیلترها", icon: "filter" },
      { title: "افراد", icon: "frame2" },
    ];
  } else {
    header.splice(1, 1);
  }
};
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
  if (filters.users.length || filters.date) {
    applyFilter.value = true;
    setFilter();
  }
  showFilterModal.value = false;
};
const setFilter = (params) => {
  if (tags.date.timeStamp.from && filters.users.length) {
    filterByDateAndUsers();
  } else if (filters.users.length) {
    filterByUsers();
  } else {
    filterByDate();
  }
};
const filterByDate = () => {
  eventList.value = store.events.filter((item) => {
    return (
      +item.tags.dueDate >= +tags.date.timeStamp.from &&
      +item.tags.dueDate <= +tags.date.timeStamp.to
    );
  });
};
const filterByUsers = () => {
  eventList.value = store.events.filter((item) => {
    for (const user of filters.users) {
      return item.tags.userId === user._id;
    }
  });
};
const filterByDateAndUsers = () => {
  eventList.value = store.events.filter((item) => {
    for (const filter of filters.users) {
      return (
        item.tags.dueDate >= tags.date.timeStamp.from &&
        item.tags.dueDate <= tags.date.timeStamp.to &&
        item.tags.userId === filter._id
      );
    }
  });
};
const headerItemsClickHandler = (params) => {
  if (params === 1) {
    applyFilter.value = false;
    showPersonModal.value = true;
    showFilterModal.value = true;
    headerTitleClicked.value = params;
  } else {
    applyFilter.value = false;
    showFilterModal.value = true;
    headerTitleClicked.value = params;
  }
};
const personClickHandler = () => {
  showPersonModal.value = false;
};
const userTagsClickHandler = (value) => {
  filters.users = value;
  updateHeaders();
};
const dateTagsClickHandler = (value) => {
  filters.date = value;
  updateHeaders();
};
const updateSelectedUsers = () => {
  selectedUsers = filters.users.map((i) => {
    return i._id;
  });
};
const confirmModal = (value) => {
  filters.users = [];
  value.forEach((item) => {
    const findUser = userStore.users.find((user) => {
      return user._id === item;
    });
    if (findUser) {
      filters.users.push(findUser);
    }
  });
  showPersonModal.value = false;
};
watch(
  () => filters,
  () => {
    updateSelectedUsers();
    if (applyFilter.value) {
      updateHeaders();
    }
    if (!filters.users.length && !filters.date) {
      eventList.value = eventListBackUp.value;
    }
  },
  { deep: true }
);
navigator.serviceWorker.addEventListener("message", (event) => {
  const { type, isDone, message } = event.data;
  if (type === "event" && isDone) {
    toast.success(message, { autoClose: 3000 });
    store.getEvent();
  } else if (type === "event" && !isDone) {
    toast.error(message, {
      autoClose: 3000,
    });
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/sass/main";
.event-page {
  @include main.grid-system();
  position: relative;
  &__main {
    @include main.breakpoint(992px) {
      height: 100%;
      width: 100vw;
    }
  }
  &__loading {
    position: absolute;
    top: 40vh;
    right: 50%;
    transform: translateX(50%);
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
    border-radius: 24px;
    height: 262px;
    min-width: 340px;
    width: 100%;
    background-color: main.$background-light-surface;
    @include main.breakpoint(1200px) {
      width: 90%;
    }
    &-card {
      cursor: pointer;
    }
  }
}
</style>
