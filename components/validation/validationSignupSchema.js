import * as yup from 'yup';

const validationSignupSchema = yup.object({
  name: yup
    .string('Enter your name')
    .required('Name is Required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf(
    [yup.ref('password'), null],
    'Passwords must match'
  ),
});

export default validationSignupSchema;