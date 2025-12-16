// components/NestedView.jsx
import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfirmationModal from "../../../HomePage/common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course) || {};
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubsection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const getPayload = (result) => {
    if (!result) return null;
    if (result.data) return result.data;
    return result;
  };

  const callDeleteSectionApi = async (sectionId) => {
    try {
      let res = await deleteSection(sectionId, token).catch(() => null);
      if (!res) {
        res = await deleteSection({ sectionId, courseId: course?._id }, token).catch(() => null);
      }
      return res;
    } catch (err) {
      console.error("deleteSection API error:", err);
      return null;
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const result = await callDeleteSectionApi(sectionId);
    const payload = getPayload(result);

    if (payload) {
      if (payload.courseContent && Array.isArray(payload.courseContent)) {
        dispatch(setCourse(payload));
      } else if (payload.updatedCourse && Array.isArray(payload.updatedCourse.courseContent)) {
        dispatch(setCourse(payload.updatedCourse));
      } else {
        // fallback: local removal
        const prev = Array.isArray(course?.courseContent) ? course.courseContent : [];
        const updated = prev.filter((s) => s._id !== sectionId);
        dispatch(setCourse({ ...course, courseContent: updated }));
      }
    } else {
      const prev = Array.isArray(course?.courseContent) ? course.courseContent : [];
      const updated = prev.filter((s) => s._id !== sectionId);
      dispatch(setCourse({ ...course, courseContent: updated }));
    }

    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    try {
      let result = await deleteSubSection(subSectionId, token).catch(() => null);
      if (!result) {
        result = await deleteSubSection({ subSectionId, sectionId }, token).catch(() => null);
      }

      const payload = getPayload(result);

      if (payload) {
        if (payload.SubSection && Array.isArray(payload.SubSection)) {
          const updatedCourseContent = (course?.courseContent || []).map((section) =>
            section._id === sectionId ? { ...section, SubSection: payload.SubSection } : section
          );
          dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        } else if (payload.updatedSection && Array.isArray(payload.updatedSection.SubSection)) {
          const updatedCourseContent = (course?.courseContent || []).map((section) =>
            section._id === sectionId ? payload.updatedSection : section
          );
          dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        } else if (payload.courseContent && Array.isArray(payload.courseContent)) {
          dispatch(setCourse(payload));
        } else {
          const updatedCourseContent = (course?.courseContent || []).map((section) =>
            section._id === sectionId
              ? { ...section, SubSection: (section.SubSection || []).filter((s) => s?._id !== subSectionId) }
              : section
          );
          dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        }
      } else {
        const updatedCourseContent = (course?.courseContent || []).map((section) =>
          section._id === sectionId
            ? { ...section, SubSection: (section.SubSection || []).filter((s) => s?._id !== subSectionId) }
            : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      }
    } catch (err) {
      console.error("handleDeleteSubSection error:", err);
    } finally {
      setConfirmationModal(null);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
        {(course?.courseContent || []).map((section) => (
          <details key={section._id} open>
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">{section.sectionName}</p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChangeEditSectionName(section._id, section.sectionName);
                  }}
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                  }}
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>

                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>

            <div className="px-6 pb-4">
              {(section.SubSection || []).filter(Boolean).map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">{data?.title}</p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditSubSection({ ...data, sectionId: section._id });
                      }}
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setAddSubsection({ sectionId: section._id, title: "", description: "", videoUrl: "" })}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection && <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add={true} />}
      {viewSubSection && <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />}
      {editSubSection && <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
