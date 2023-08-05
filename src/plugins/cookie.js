import { globalCookiesConfig } from "vue3-cookies";
import { useCookies } from "vue3-cookies";
globalCookiesConfig({
  expireTimes: "1d",
  path: "",
  domain: "",
  secure: true,
  sameSite: "None",
});
const {cookies} = useCookies()
export default cookies