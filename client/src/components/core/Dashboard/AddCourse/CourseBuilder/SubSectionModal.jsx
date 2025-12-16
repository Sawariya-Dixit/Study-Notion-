// components/SubSectionModal.jsx
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import IconBtn from "../../../HomePage/common/IconBtn";
import Upload from "../Upload";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { toast } from "react-hot-toast";

export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false }) {
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course) || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData?.title || "");
      setValue("lectureDesc", modalData?.description || "");
    }
  }, [modalData, view, edit, setValue]);

  const normalizeResult = (res) => {
    if (!res) return null;
    if (res.data) return res.data;
    if (res.updated) return res.updated;
    return res;
  };

  const isFormUpdated = () => {
    const v = getValues();
    const titleChanged = v.lectureTitle?.trim() !== modalData?.title?.trim();
    const descChanged = v.lectureDesc?.trim() !== modalData?.description?.trim();

    let videoChanged = false;
    if (v.lectureVideo) {
      if (v.lectureVideo instanceof File) videoChanged = true;
      else if (v.lectureVideo.length > 0) videoChanged = true;
    }

    return titleChanged || descChanged || videoChanged;
  };

  const handleEditSubsection = async () => {
    try {
      const v = getValues();
      const formData = new FormData();
      formData.append("subSectionId", modalData._id);
      formData.append("sectionId", modalData.sectionId);
      formData.append("title", v.lectureTitle);
      formData.append("description", v.lectureDesc);

      if (v.lectureVideo instanceof File) {
        formData.append("video", v.lectureVideo);
      } else if (v.lectureVideo?.[0] instanceof File) {
        formData.append("video", v.lectureVideo[0]);
      }

      setLoading(true);
      const result = await updateSubSection(formData, token);
      const updatedSubSection = normalizeResult(result);

      const updatedCourseContent = (course?.courseContent || []).map((section) => {
        if (section._id !== modalData.sectionId) return section;
        const prevSubs = Array.isArray(section.SubSection) ? section.SubSection : [];
        const newSubs = prevSubs.map((ss) => (ss._id === modalData._id ? { ...ss, ...updatedSubSection } : ss));
        return { ...section, SubSection: newSubs.filter(Boolean) };
      });

      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      setModalData(null);
      toast.success("Lecture updated successfully");
    } catch (err) {
      console.error("handleEditSubsection:", err);
      toast.error(err.message || "Could not update lecture");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made");
        return;
      }
      return handleEditSubsection();
    }

    try {
      const formData = new FormData();
      formData.append("sectionId", modalData.sectionId);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDesc);

      if (data.lectureVideo instanceof File) formData.append("video", data.lectureVideo);
      else if (data.lectureVideo?.[0]) formData.append("video", data.lectureVideo[0]);

      setLoading(true);
      const result = await createSubSection(formData, token);
      const payload = normalizeResult(result);

      if (payload?.SubSection && Array.isArray(payload.SubSection)) {
        const updatedCourseContent = (course?.courseContent || []).map((section) =>
          section._id === modalData.sectionId ? { ...section, SubSection: payload.SubSection } : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      } else if (payload?._id) {
        const updatedCourseContent = (course?.courseContent || []).map((section) =>
          section._id === modalData.sectionId
            ? { ...section, SubSection: [...(section.SubSection || []), payload] }
            : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      } else {
        toast.success("Lecture added (please refresh to see updates)");
      }

      setModalData(null);
      toast.success("Lecture added successfully");
    } catch (err) {
      console.error("createSubSection error:", err);
      toast.error(err.message || "Could not add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-white/10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] max-h-[90vh] rounded-lg bg-[var(--richblack-800)] border border-[var(--richblack-400)] flex flex-col">
        <div className="bg-[var(--richblack-700)] p-5 flex justify-between">
          <p className="text-xl text-[var(--richblack-5)]">
            {view ? "Viewing" : edit ? "Editing" : "Adding"} Lecture
          </p>
          <RxCross2
            onClick={() => (!loading ? setModalData(null) : null)}
            className="text-2xl cursor-pointer text-[var(--richblack-5)]"
          />
        </div>

        <div className="p-10 space-y-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Upload
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              accept={{ "video/*": [".mp4", ".mov", ".mkv"] }}
              viewData={view ? modalData?.videoUrl : null}
              editData={edit ? modalData?.videoUrl : null}
            />

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-[var(--richblack-5)]">
                Lecture Title {!view && <sup className="text-[var(--pink-200)]">*</sup>}
              </label>
              <input
                disabled={view}
                {...register("lectureTitle", { required: true })}
                className="form-style bg-[var(--richblack-700)] text-[var(--richblack-5)] border border-[var(--richblack-400)] rounded px-3 py-2"
                placeholder="Enter title"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-[var(--richblack-5)]">
                Description {!view && <sup className="text-[var(--pink-200)]">*</sup>}
              </label>
              <textarea
                disabled={view}
                {...register("lectureDesc", { required: true })}
                className="form-style bg-[var(--richblack-700)] text-[var(--richblack-5)] border border-[var(--richblack-400)] rounded px-3 py-2 min-h-[130px]"
                placeholder="Enter description"
              />
            </div>

            {!view && (
              <div className="flex justify-end">
                <IconBtn
                  type="submit"
                  text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                  disabled={loading}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
