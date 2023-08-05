import * as yup from "yup";
const required = yup.string().required("پرکردن این فیلد الزامیست");
export const loginSchema = yup.object().shape({
  email: required.email("ایمیل معتبر وارد کنید"),
  password: required
    .min(6, "رمز عبور باید بیشتر از 6 کاراکتر باشد")
    .matches(/^(?=.*[0-9])/, "باید شامل حداقل یک عدد باشد"),
});

export const signupSchema = yup.object().shape({
  email: required.email("ایمیل معتبر وارد کنید"),
  password: required
    .min(6, "رمز عبور باید بیشتر از 6 کاراکتر باشد")
    .matches(/^(?=.*[0-9])/, "باید شامل حداقل یک عدد باشد"),
  text: yup.string().required("پرکردن این فیلد الزامیست"),
  number: yup.string().required("پرکردن این فیلد الزامیست"),
});

export const activitySchema = yup.object().shape({
  title: required,
  date: required,
  startTime: required,
  endTime: required,
  activityType: required,
});

export const eventSchema = yup.object().shape({
  title: required,
  dueDate: required,
  time: required,
});
