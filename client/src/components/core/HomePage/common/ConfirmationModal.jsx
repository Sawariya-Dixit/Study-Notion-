import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      <div className="bg-[var(--richblack-800)] text-[var(--richblack-5)] p-6 rounded-md shadow-lg w-[350px]">
        <p className="text-xl font-semibold">{modalData.text1}</p>
        <p className="text-sm mt-2 mb-6">{modalData.text2}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-[var(--yellow-50)] text-[var(--black)] rounded-md"
            onClick={modalData.btn1Handler}
          >
            {modalData.btn1Text}
          </button>

          <button
            className="px-4 py-2 bg-[var(--richblack-700)] text-[var(--richblack-25)] rounded-md"
            onClick={modalData.btn2Handler}
          >
            {modalData.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
