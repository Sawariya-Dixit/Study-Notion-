import React from "react";
import ContactUsForm from "../../ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto">
      <h1 className="text-center text-4xl font-semibold text-[var(--richblack-5)]">
        Get in Touch
      </h1>
      <p className="text-center mt-3 text-[var(--richblack-300)]">
        We&apos;d love to hear from you, please fill out this form.
      </p>
      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
