import { SERVICES_URL } from "../../common/constants";
import { axiosInstance } from "../config";
const postData = (params) => {
    return axiosInstance.post(SERVICES_URL.ACTIVITY_TYPE, params);
};
const editData = (params) => {
    return axiosInstance.put(SERVICES_URL.ACTIVITY_TYPE, params);
};

const getData = () => {
    return axiosInstance.get(SERVICES_URL.ACTIVITY_TYPE);
};
const getDataByTag = () => {
    return axiosInstance.get(SERVICES_URL.ACTIVITY_TYPE);
};
const deleteData = () => {
    return axiosInstance.delete(SERVICES_URL.ACTIVITY_TYPE, {
      params: {
        id,
      },
    });
};
const getDataBYId = () => {
  return axiosInstance.get(SERVICES_URL.ACTIVITY_TYPE, {
    params: {
      id,
    },
  });
};

export { postData, getData, getDataBYId, deleteData, editData, getDataByTag };
