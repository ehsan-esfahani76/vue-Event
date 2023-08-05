import { toast } from "vue3-toastify";
export function checkAuth(to, $cookies, next) {
  if ((to.name === "login" || to.name === "signup") && $cookies.get("token")) {
    toast.error("دسترسی به این مسیر وجود ندارد")
    next({ name: "home" });
  } else if (
    (to.name === "login" || to.name === "signup") &&
    !$cookies.get("token")
  ) {
    next(true);
  } else {
    if (to.meta.requiresAuth && !$cookies.get("token")) {
      next({ name: "login" });
    } else {
      next(true);
    }
  }
}
