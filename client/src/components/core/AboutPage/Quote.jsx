import React from "react";
import HighlightText from "../HomePage/HighlightText";

const Quote = () => {
  return (
    <div className="text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-[var(--white)]">
      We are passionate about revolutionizing the way we learn. Our
      innovative platform <HighlightText text={"combines technology"} />,{" "}
      <span className="bg-gradient-to-b from-[var(--pink-400)] to-[var(--yellow-50)] text-transparent bg-clip-text font-bold">
        {" "}
        expertise
      </span>
      , and community to create an
      <span className="bg-gradient-to-b from-[var(--pink-300)] to-[var(--yellow-25)] text-transparent bg-clip-text font-bold">
        {" "}
        unparalleled educational experience.
      </span>
    </div>
  );
};

export default Quote;
