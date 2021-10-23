import * as yup from "yup";

const validationProfileSchema = yup.object({
  name: yup.string("Enter your name").required("Email is required"),
  phone: yup.string("Enter your phone").required("Phone is required"),
  location: yup.object().shape({
    value: yup.string().required("Address is required"),
    address: yup.string().required("Invalid address"),
  }),
});

export default validationProfileSchema;
