import * as yup from "yup";

const validationProfileSchema = yup.object({
  name: yup.string("Enter your name").required("Email is required"),
  phone: yup.string("Enter your phone").required("Phone is required"),
  address: yup
    .string("Enter your Full Address")
    .required("Address is required"),
  city: yup.string("Enter your city").required("City is required"),
  province: yup.string("Enter your province").required("Province is required"),
  country: yup.string("Enter your country").required("Country is required"),
  postal: yup
    .string("Enter your Postal Code")
    .required("Postal Code is required"),
});

export default validationProfileSchema;
