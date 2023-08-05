import { SERVICES_URL } from "../../common/constants";
import { axiosInstance } from "../config";
const putData = async(params)=> {
  try {
    const data = await axiosInstance.put(SERVICES_URL.FileStorage, params);
    return data;
  } catch (err) {
    return err;
  }
}

const getData =async(id)=> {
  try {
    const data = await axiosInstance.get(SERVICES_URL.FileStorage, {
      responseType: "blob",
      params:{
        id
      }
    });
    return data;
  } catch (err) {
    return err;
  }
}

export { putData, getData };
