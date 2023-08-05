import { axiosInstance } from "../config";

async function postEvent(params) {
  try {
    const data = await axiosInstance.post("https://barjavand-v3-dev.apipart.ir/share",params);
    return data;
  } catch (err) {
    return err;
  }
}

export {postEvent };
