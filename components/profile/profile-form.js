import { Field, Form, Formik, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useS3Upload } from "next-s3-upload";
import validationProfileSchema from "components/validation/validationProfileSchema";

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

function ProfileForm() {
  const [user, setUser] = useState({});

  async function getUser() {
    const response = await fetch("/api/user/profile", {
      method: "GET",
    });
    const data = await response.json();
    await setUser(data);
  }

  useEffect(() => {
    getUser();
  }, []);

  const [loading, setLoading] = useState(false);
  const { uploadToS3 } = useS3Upload();
  const handleFilesChange = async ({ target }) => {
    setLoading(true);
    if (target.name === "file") {
      let urls = [];
      if (user?.documents?.length >= 1 && target.name === "file") {
        urls = [...user?.documents];
      }
      const files = Array.from(target.files);

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const { url } = await uploadToS3(file);
        urls.push(url);
      }
      updateProfile({ documents: urls });
    } else {
      console.log(target);
      const { url } = await uploadToS3(target.files[0]);
      updateProfile({ photo: url });
    }
    setLoading(false);
    getUser();
  };

  async function updateProfile(info) {
    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
  }
  return (
    <section className="h-screen bg-gray-100 bg-opacity-50">
      <Formik
        enableReinitialize
        validationSchema={validationProfileSchema}
        initialValues={{
          name: user?.name || "",
          phone: user?.phone || "",
          address: user?.address || "",
          city: user?.city || "",
          province: user?.province || "",
          country: user?.country || "",
          postal: user?.postal || "",
        }}
        onSubmit={async (values) => {
          await setLoading(true);
          await updateProfile(values);
          await setLoading(false);
        }}
      >
        <Form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
          {/* <form className="container max-w-2xl mx-auto shadow-md md:w-3/4"> */}
          <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="max-w-sm mx-auto md:w-full md:mx-0">
              <div className="inline-flex items-center space-x-4">
                {/* <h1 className="text-gray-600"></h1> TODO DESCRIPTION HERE */}
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-white">
            <Section name="Your Email">{user?.email}</Section>
            <hr />
            <Section name="Your Picture">
              {!loading ? (
                <Input type="file" name="photo" onChange={handleFilesChange} />
              ) : (
                <p>Loading ...</p>
              )}
              <br />
              <hr />
              {user?.photo && (
                <Image src={user?.photo} alt="Photo" width="150" height="150" />
              )}
            </Section>
            <hr />
            <Section name="Personal Information">
              <Field
                type="text"
                name="name"
                placeholder="Your Full Name"
                required
                component={Input}
              />
              <ErrorMessage name="name" />
              <Field
                type="text"
                name="phone"
                required
                placeholder="Phone Number"
                component={Input}
              />
              <ErrorMessage name="phone" />
              <Field
                type="text"
                name="address"
                required
                placeholder="Address"
                component={Input}
              />
              <ErrorMessage name="address" />
              <Field
                type="text"
                name="city"
                required
                placeholder="city"
                component={Input}
              />
              <ErrorMessage name="city" />
              <Field
                type="text"
                name="province"
                required
                placeholder="Province"
                component={Input}
              />
              <ErrorMessage name="province" />
              <Field
                type="text"
                name="country"
                required
                placeholder="Country"
                component={Input}
              />
              <ErrorMessage name="country" />
              <Field
                type="text"
                name="postal"
                required
                placeholder="Postal code"
                component={Input}
              />
              <ErrorMessage name="postal" />
            </Section>
            <hr />
            <div>
              <p>Include all your documents and certifications</p>
              {!loading ? (
                <Input
                  type="file"
                  name="file"
                  multiple
                  onChange={handleFilesChange}
                />
              ) : (
                <p>Loading ...</p>
              )}
              <br />
              <hr />
              {/* TODO LIST ALL DOCUMENTS UPLOADED */}
              {user?.documents?.map((doc) => (
                <Image
                  src={doc}
                  alt="document"
                  width="150"
                  height="150"
                  key={doc}
                />
              ))}
            </div>
            <hr />
            <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
              <button
                type="submit"
                className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
            <hr />
          </div>
        </Form>
      </Formik>
    </section>
  );
}

export default ProfileForm;
