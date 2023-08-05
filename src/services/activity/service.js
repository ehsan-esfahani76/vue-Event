import { SERVICES_URL } from "../../common/constants";
import { axiosInstance } from "../config";
const postData = (params) => {
    return axiosInstance.post(SERVICES_URL.ACTIVITY, params);
};
const editData = (params) => {
    return axiosInstance.put(SERVICES_URL.ACTIVITY, params);
};

const getData = () => {
    return axiosInstance.get(SERVICES_URL.ACTIVITY);
};
const getDataByTag = () => {
    return axiosInstance.get(SERVICES_URL.ACTIVITY);
};
const deleteData = (id) => {
  console.log(id);
    return axiosInstance.delete(SERVICES_URL.ACTIVITY, {
      params: {
        id,
      },
    });
};
const getDataBYId = ({ id }) => {
  return axiosInstance.get(SERVICES_URL.ACTIVITY, {
    params: {
      id,
    },
  });
};

export { postData, getData, getDataBYId, deleteData, editData, getDataByTag };
