import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div
      className="rounded-xl p-7 lg:p-14 flex gap-3 flex-col border"
      style={{
        borderColor: "var(--richblack-600)",
        color: "var(--richblack-300)",
      }}
    >
      <h1
        className="text-4xl leading-10 font-semibold"
        style={{ color: "var(--richblack-5)" }}
      >
        Got a Idea? We&apos;ve got the skills. Let&apos;s team up
      </h1>
      <p style={{ color: "var(--richblack-300)" }}>
        Tell us more about yourself and what you&apos;re got in mind.
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
