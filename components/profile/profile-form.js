import { Field, Form, Formik, FormikProps } from "formik";

const Input = ({ field, form, ...props }) => {
  return (
    <div className=" relative ">
      <input
        {...field}
        className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        {...props}
      />
    </div>
  );
};

const Section = ({ name, children }) => (
  <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
    <h2 className="max-w-sm mx-auto md:w-1/3">{name}</h2>
    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">{children}</div>
  </div>
);

function ProfileForm({ user }) {
  return (
    <section className="h-screen bg-gray-100 bg-opacity-50">
      <Formik
        initialValues={{
          name: user?.name || "",
          phone: "",
          address: "",
          city: "",
          province: "",
          postal: "",
          cpr: "",
          driving: "",
          degree: "",
          teaching: "",
          ncs: "",
          ics: "",
          rn: "",
          fa: "",
          cna: "",
          ecd: "",
          bsp: "",
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));

            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        <Form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
          {/* <form className="container max-w-2xl mx-auto shadow-md md:w-3/4"> */}
          <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="max-w-sm mx-auto md:w-full md:mx-0">
              <div className="inline-flex items-center space-x-4">
                <h1 className="text-gray-600"></h1>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-white">
            <Section name="Your Email">
              <Field
                disabled
                type="email"
                name="email"
                defaultValue={user.email}
                component={Input}
              />
            </Section>
            <hr />
            <Section name="Personal Information">
              <Field
                type="text"
                name="name"
                placeholder="Your Full Name"
                component={Input}
              />
              <Field
                type="tel"
                name="phone"
                placeholder="Phone Number"
                component={Input}
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              />
              <Field
                type="text"
                name="address"
                placeholder="Address"
                component={Input}
              />
              <Field
                type="text"
                name="city"
                placeholder="city"
                component={Input}
              />
              <Field
                type="text"
                name="province"
                placeholder="Province"
                component={Input}
              />
              <Field
                type="text"
                name="country"
                placeholder="Country"
                component={Input}
              />
              <Field
                type="text"
                name="postal"
                placeholder="Postal code"
                component={Input}
              />
            </Section>
            <hr />
            <Section name="CPR Certification">
              <Field type="file" name="cpr" component={Input} />
            </Section>
            <Section name="Driving License">
              <Field type="file" name="driving" component={Input} />
            </Section>
            <Section name="Degree Certificate">
              <Field type="file" name="degree" component={Input} />
            </Section>
            <Section name="Teaching Certification">
              <Field type="file" name="teaching" component={Input} />
            </Section>
            <Section name="Newborn Care Specialist (NCS)">
              <Field type="file" name="ncs" component={Input} />
            </Section>
            <Section name="Infant Care Specialist (ICS)">
              <Field type="file" name="ics" component={Input} />
            </Section>
            <Section name="Registered Nurse (RN)">
              <Field type="file" name="rn" component={Input} />
            </Section>
            <Section name="First Aid Certification">
              <Field type="file" name="fa" component={Input} />
            </Section>
            <Section name="Certified Nursing Assistant (CNA)">
              <Field type="file" name="cna" component={Input} />
            </Section>
            <Section name="Early Childhood Development (ECD)">
              <Field type="file" name="ecd" component={Input} />
            </Section>
            <Section name="Babysitpro Certificate (BSP)">
              <Field type="file" name="bsp" component={Input} />
            </Section>
            <hr />
            <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
              <button
                type="submit"
                className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </section>
  );
}

export default ProfileForm;
