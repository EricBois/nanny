import { Field, Form, Formik, ErrorMessage } from "formik";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useS3Upload } from "next-s3-upload";
import validationProfileSchema from "components/validation/validationProfileSchema";
import PlacesAutoComplete from "../PlacesAutoComplete";
import { useProfile } from "lib/profile";

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

// Get the user profile
function ProfileForm() {
  const formRef = useRef();
  const {
    profile: user,
    getProfile,
    updateProfile,
    loading,
    show,
    setShow,
  } = useProfile();
  const { uploadToS3 } = useS3Upload();

  async function deleteDoc(doc, file) {
    await fetch("/api/s3-upload/s3-delete", {
      method: "POST",
      body: JSON.stringify({ document: doc, file: file }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json();
      getProfile();
    });
  }

  const handleFilesChange = async ({ target }) => {
    // submit form before submit pic and it gets erased
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
    // for docs
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
      // for profile pic
      // delete existing first
      if (user?.photo) {
        await deleteDoc(user.photo, "photo");
      }
      const { url } = await uploadToS3(target.files[0]);
      updateProfile({ photo: url });
    }
  };
  if (loading) return <p>Loading ...</p>;
  return (
    <>
      <section className="h-screen bg-gray-100 bg-opacity-50">
        <Formik
          innerRef={formRef}
          enableReinitialize
          validationSchema={validationProfileSchema}
          initialValues={{
            name: user?.name || "",
            phone: user?.phone || "",
            location: user?.location || {
              address: "",
              coordinates: { lat: "", lng: "" },
              value: "",
            },
          }}
          onSubmit={async (values) => {
            await updateProfile(values);
            await getProfile();
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
              <Section name="Your Email">{user?.email}</Section> <hr />
              <Section name="Your Picture">
                {!loading ? (
                  <Input
                    type="file"
                    name="photo"
                    onChange={handleFilesChange}
                  />
                ) : (
                  <p>Loading ...</p>
                )}
                <br />
                <hr />
                {user?.photo && (
                  <Image
                    src={user?.photo}
                    alt="Photo"
                    width="150"
                    height="150"
                  />
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
              </Section>
              <Section
                name={[
                  "Current Address",
                  <button
                    type="button"
                    key="button"
                    style={{
                      marginLeft: "5px",
                      fontSize: "2rem",
                      color: "#d16200",
                    }}
                    onClick={() => setShow(true)}
                  >
                    &#9998;
                  </button>,
                ]}
              >
                {show ? (
                  <div style={{ display: "flex" }}>
                    <Field
                      type="text"
                      name="location"
                      required
                      component={PlacesAutoComplete}
                    />
                    {user?.location?.value?.length > 1 && (
                      <button
                        style={{ marginLeft: "5px" }}
                        type="button"
                        onClick={() => setShow(false)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ) : (
                  `${user?.location?.value}`
                )}
                <ErrorMessage name="address" />
              </Section>
              <hr />
              <Section name="Your Documentation">
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
                {/* TODO LIST ALL DOCUMENTS UPLOADED */}
                <div style={{ display: "flex" }}>
                  {user?.documents?.map((doc) => (
                    <div key={doc}>
                      <Image
                        src={doc}
                        alt="document"
                        width="150"
                        height="150"
                      />
                      <button
                        type="button"
                        onClick={() => deleteDoc(doc, "document")}
                      >
                        delete
                      </button>
                    </div>
                  ))}
                </div>
              </Section>
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
    </>
  );
}

export default ProfileForm;
