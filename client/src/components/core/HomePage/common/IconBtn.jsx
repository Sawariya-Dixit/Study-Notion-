// IconBtn.jsx
export default function IconBtn({
  text,
  onClick,
  children,
  disabled = false,
  outline = false,
  customClasses = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center ${
        outline
          ? "border border-[var(--yellow-50)] bg-transparent"
          : "bg-[var(--yellow-50)]"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[var(--richblack-900)] ${customClasses}`}
      {...rest}
    >
      {children ? (
        <>
          <span className={`${outline && "text-[var(--yellow-400)]"}`}>
            {text}
          </span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
