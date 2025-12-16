import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CountryCode from "../../data/countrycode";
import { apiConnector } from "../../services/apiConnector";
import { contactusEndpoint } from "../../services/operations/apis";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Form Data - ", data);
    try {
      setLoading(true);
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      console.log("Email Res - ", res);
      setLoading(false);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* Name Fields */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label
            htmlFor="firstname"
            className="text-[var(--richblack-5)] font-medium"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="border border-[var(--richblack-400)] rounded-md px-3 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] placeholder:text-[var(--richblack-400)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-[var(--yellow-100)]">
              Please enter your name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label
            htmlFor="lastname"
            className="text-[var(--richblack-5)] font-medium"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="border border-[var(--richblack-400)] rounded-md px-3 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] placeholder:text-[var(--richblack-400)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-[var(--richblack-5)] font-medium"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="border border-[var(--richblack-400)] rounded-md px-3 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] placeholder:text-[var(--richblack-400)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-[var(--yellow-100)]">
            Please enter your Email address.
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phonenumber"
          className="text-[var(--richblack-5)] font-medium"
        >
          Phone Number
        </label>
        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              name="countrycode"
              id="countrycode"
              className="border border-[var(--richblack-400)] rounded-md px-2 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => (
                <option key={i} value={ele.code}>
                  {ele.code} - {ele.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phoneNo"
              id="phonenumber"
              placeholder="12345 67890"
              className="border border-[var(--richblack-400)] rounded-md px-3 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] placeholder:text-[var(--richblack-400)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
              {...register("phoneNo", {
                required: { value: true, message: "Please enter your Phone Number." },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-[var(--yellow-100)]">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-[var(--richblack-5)] font-medium"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="border border-[var(--richblack-400)] rounded-md px-3 py-2 bg-[var(--richblack-900)] text-[var(--richblack-5)] placeholder:text-[var(--richblack-400)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-50)]"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-[var(--yellow-100)]">
            Please enter your Message.
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-[var(--yellow-50)] px-6 py-3 text-center text-[13px] font-bold text-[var(--black)] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
          ${!loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"} disabled:bg-[var(--richblack-500)] sm:text-[16px]`}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
