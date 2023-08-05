import { SERVICES_URL } from "../../common/constants";
import { axiosInstance } from "../config";
const postData = (params) => {
    return axiosInstance.post(SERVICES_URL.EVENT, params);
};
const editData = (params) => {
    return axiosInstance.put(SERVICES_URL.EVENT, params);
};

const getData = () => {
    return axiosInstance.get(SERVICES_URL.EVENT);
};
const getDataByTag = () => {
    return axiosInstance.get(SERVICES_URL.EVENT);
};
const deleteData = (id) => {
    return axiosInstance.delete(SERVICES_URL.EVENT, {
      params: {
        id,
      },
    });
};
const getDataBYId = ({ id }) => {
  return axiosInstance.get(SERVICES_URL.EVENT, {
    params: {
      id,
    },
  });
};

export { postData, getData, getDataBYId, deleteData, editData, getDataByTag };
