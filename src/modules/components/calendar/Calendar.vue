<template>
  <div class="calendar">
    <div class="calendar__title">
      <div class="calendar__title-icons">
        <base-icon name="arrowRight" @click="handlePrevMonth" />
        <base-icon name="arrowLeft2" @click="handleNextMonth" />
      </div>
      <div class="calendar__title-text">
        {{ currentDate[0] }}
        {{ convertNumberToPersian(currentDate[1]) }}
      </div>
    </div>
    <div class="calendar__main">
      <div class="calendar__weeks">
        <span v-for="(weekName, index) in weeks" :key="index">{{
          weekName
        }}</span>
      </div>
      <div class="calendar__dayList" :class="animateClass">
        <div
          v-for="day in currentMonthDays"
          @click="
            $emit('update:modelValue', day.date), dayClickHandler(day.date)
          "
          :class="[
            'day',
            isToday(day.date) && 'calendar__today',
            day.ispast && 'calendar__otherMonth',
            day.isCurrent && 'calendar__selected',
          ]"
        >
          {{ convertNumberToPersian(day.day) }}
          <span
            v-if="day.events.length > 0"
            :class="day.isCurrent && 'calendar__current-event'"
            >{{ convertNumberToPersian(day.events.length) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, reactive } from "vue";
import moment from "jalali-moment";
import { useEvent } from "@/stores/event/event";
moment.locale("fa");
const animateClass = ref("");
const m = reactive(moment());
const currentDate = ref(" ");
const endDayofMonth = ref("");
const week = ref("");
const dayOfPrevMonth = ref("");
const currentMonthDays = ref([]);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  events: {
    type: Array,
  },
});

const convertNumberToPersian = (number) => {
  return new Intl.NumberFormat("fa-IR", {
    useGrouping: false,
  }).format(number);
};

const weeks = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const dateOfEachDay = (params) => {
  const date = moment.from(params, "fa").locale("en").format("YYYY/MM/DD");
  const timeStamp = new Date(date).getTime();
  return timeStamp;
};
const daysThisMonth = () => {
  currentMonthDays.value = [];
  currentDate.value = m.clone().format("MMMM YYYY").split(" ");
  endDayofMonth.value = m.clone().endOf("month").format("D");
  const endOfMonthWeek = +m.clone().endOf("month").weekday();
  week.value = m.clone().startOf("month").weekday();
  dayOfPrevMonth.value = m.clone().endOf("month").format("D");
  let counter = 1;
  for (let i = 0; i < week.value; i++) {
    counter--;
    const prev = m
      .clone()
      .date(counter)
      .subtract(0, "month")
      .format("YYYY/MM/DD");
    currentMonthDays.value.push({
      day: +dayOfPrevMonth.value - i,
      date: dateOfEachDay(prev),
      ispast: true,
      isCurrent: false,
      events: [],
    });
    currentMonthDays.value.sort((a, b) => a.date - b.date);
  }
  for (let i = 1; i <= +endDayofMonth.value; i++) {
    const date = m.clone().date(i).format("YYYY/MM/DD");
    currentMonthDays.value.push({
      day: i,
      date: dateOfEachDay(date),
      ispast: false,
      isCurrent: false,
      events: [],
    });
  }
  for (let i = 1; i < 7 - endOfMonthWeek; i++) {
    const next = m.clone().date(i).subtract(-1, "month").format("YYYY/MM/DD");
    currentMonthDays.value.push({
      day: i,
      date: dateOfEachDay(next),
      ispast: true,
      isCurrent: false,
      events: [],
    });
  }
};
daysThisMonth();
const isToday = (date) => {
  const shamsi = moment.from(new Date(), "en").format("YYYY/MM/DD");
  return dateOfEachDay(shamsi) === date;
};
const dayClickHandler = (date) => {
  currentMonthDays.value.forEach((item) => {
    if (item.date === date) {
      item.isCurrent = true;
    } else {
      item.isCurrent = false;
    }
  });
};
const timeout = (ms) => {
  let id;
  const promise = new Promise((resolve) => {
    id = setTimeout(() => {
      animateClass.value = "";
    }, 320);
  });
  return { id, promise };
};
const handleNextMonth = async () => {
  animateClass.value = "animate";
  m.subtract(1, "month");
  daysThisMonth();
  setEvents();
  const { id, promise } = timeout();
  promise.then(() => clearInterval(id));
};
const handlePrevMonth = async () => {
  animateClass.value = "animate";
  m.add(1, "month");
  daysThisMonth();
  setEvents();
  const { id, promise } = timeout();
  promise.then(() => clearInterval(id));
};
const resetEventsItem = () => {
  currentMonthDays.value.forEach((item) => {
    item.events = [];
  });
};
const setEvents = () => {
  currentMonthDays.value.forEach((item) => {
    useEvent().events.forEach((event) => {
      if (item.date === +event.tags.dueDate) {
        item.events.push(event);
      }
    });
  });
};
watch(
  () => useEvent().events,
  () => {
    resetEventsItem();
    setEvents();
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
@use "@/assets/sass/main";
.calendar {
  border-radius: 24px;
  background-color: main.$background-light-default;
  color: black;
  height: auto;
  padding: 10px 0;
  overflow: hidden;
  &__title {
    display: flex;
    justify-content: space-around;
    &-icons {
      display: flex;
      gap: 5px;
      cursor: pointer;
    }
    &-text {
      max-width: 100px;
      min-width: 100px;
    }
  }
  &__weeks {
    display: grid;
    grid-template-columns: repeat(7, calc(100% / 7));
    padding: 10px 20px;
    justify-items: center;
  }
  &__dayList {
    display: grid;
    grid-template-columns: repeat(7, calc(100% / 7));
    justify-items: center;
    row-gap: 10px;
    padding: 10px 18px;
    border: 1px solid transparent;
    div {
      width: 30px;
      padding: 5px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      span {
        position: absolute;
        right: -10px;
        top: -5px;
        width: 15px;
        height: 15px;
        background-color: main.$color-primary-600;
        color: main.$background-light-surface;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  &__current-event {
    background-color: main.$background-light-surface;
    color: main.$color-primary-600;
  }
  &__otherMonth {
    color: main.$color-gray-500;
  }
  &__today {
    background-color: main.$color-primary-600;
    color: main.$background-light-surface;
    border-radius: 5px;
  }
  .day {
    border: 2px solid transparent;
    border-radius: 5px;
    &:hover{
      background-color: main.$color-primary-200;
    }
  }
  &__selected {
    border: 2px solid main.$color-primary-600 !important;
    border-radius: 5px;
  }
}
.animate {
  animation: animate 0.3s ease-in-out;
}
@keyframes animate {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
