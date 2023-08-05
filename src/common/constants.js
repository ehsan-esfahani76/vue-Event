const SERVICES_URL = {
  ACTIVITY: "http://localhost:3000/activity",
  ACTIVITY_TYPE:
    "http://localhost:3000/activityType",
  EVENT:
    "http://localhost:3000/event",
  USER:
    "http://localhost:3000/user",
};


const ACTIVITY_SCHEMA = (
  { title, description, date, startTime, endTime, activityType, content, id },
  keyName
) => {
  const USER_ID = JSON.parse(localStorage.getItem("info"))?._id;
  const schema = {
    id,
    tags: {
      title,
      date,
      startTime,
      endTime,
      userId: USER_ID,
    },
    data: {
        title,
        description,
        date,
        startTime,
        content,
        endTime,
        activityType,
    },
  };
  return schema;
};

const EVENT_SCHEMA = (
  { title, dueDate, description, time, users ,id ,sharedTag},
  keyName
) => {
  const USER_ID = JSON.parse(localStorage.getItem("info"))?._id;
  const schema = {
    id,
    tags: {
      title,
      dueDate,
      userId: USER_ID,
      time,
      ...sharedTag
    },
    data: {
        title,
        dueDate,
        description,
        time,
        users,
    },
  };
  return schema;
};

const ACTIVITY_PARAMS = (id) => {
  const USER_ID = JSON.parse(localStorage.getItem("info"))?._id;
  const params = {
    uniqueKey: USER_ID,
    id,
  };
  return params;
};
const ACTIVITY_TYPE_PARAMS = (id) => {
  const USER_ID = JSON.parse(localStorage.getItem("info"))?._id;
  const params = {
    uniqueKey: USER_ID,
    id,
  };
  return params;
};

const EVENT_PARAMS = (id)=>{
  const USER_ID = JSON.parse(localStorage.getItem("info"))?._id;
  const params = {
    uniqueKey: USER_ID,
    id,
  };
  return params
}

export {
  SERVICES_URL,
  ACTIVITY_SCHEMA,
  ACTIVITY_PARAMS,
  ACTIVITY_TYPE_PARAMS,
  EVENT_SCHEMA,
  EVENT_PARAMS
};
