import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../../components/core/HomePage/common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedVideo } from "../../../slices/viewCourseSlice";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData = [], courseEntireData = {}, completedVideo = [] } =
    useSelector((state) => state.viewCourse || {});

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load current video
  useEffect(() => {
    if (!courseSectionData.length) return;

    const section = courseSectionData.find((sec) => sec._id === sectionId);
    const sub = section?.SubSection?.find((ss) => ss._id === subSectionId);

    setVideoData(sub || null);
    setVideoEnded(false);
    setIsPlaying(false);
  }, [courseSectionData, sectionId, subSectionId]);

  // First / Last video
  const isFirstVideo = () => {
    const secIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[secIndex]?.SubSection?.findIndex(
      (v) => v._id === subSectionId
    );
    return secIndex === 0 && subIndex === 0;
  };

  const isLastVideo = () => {
    const secIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[secIndex]?.SubSection?.findIndex(
      (v) => v._id === subSectionId
    );
    return (
      secIndex === courseSectionData.length - 1 &&
      subIndex === courseSectionData[secIndex]?.SubSection?.length - 1
    );
  };

  // Navigation
  const goToNextVideo = () => {
    const secIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[secIndex]?.SubSection?.findIndex(
      (v) => v._id === subSectionId
    );

    if (subIndex < courseSectionData[secIndex].SubSection.length - 1) {
      const nextSubId = courseSectionData[secIndex].SubSection[subIndex + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`);
    } else {
      const nextSec = courseSectionData[secIndex + 1];
      if (nextSec?.SubSection?.length) {
        navigate(
          `/view-course/${courseId}/section/${nextSec._id}/sub-section/${nextSec.SubSection[0]._id}`
        );
      }
    }
  };

  const goToPrevVideo = () => {
    const secIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[secIndex]?.SubSection?.findIndex(
      (v) => v._id === subSectionId
    );

    if (subIndex > 0) {
      const prevSubId = courseSectionData[secIndex].SubSection[subIndex - 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`);
    } else {
      const prevSec = courseSectionData[secIndex - 1];
      if (prevSec?.SubSection?.length) {
        const lastSub = prevSec.SubSection[prevSec.SubSection.length - 1]._id;
        navigate(`/view-course/${courseId}/section/${prevSec._id}/sub-section/${lastSub}`);
      }
    }
  };

  // Mark complete
  const handleLectureCompletion = async () => {
    if (!token) return;

    setLoading(true);
    const res = await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token);
    if (res) dispatch(updateCompletedVideo(subSectionId));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* VIDEO PLAYER */}
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
        {videoData ? (
          <>
            <video
              ref={videoRef}
              src={videoData.videoUrl}
              controls
              autoPlay={false} // autoplay false to avoid NotAllowedError
              muted={false}
              className="w-full h-full object-cover"
              onEnded={() => setVideoEnded(true)}
            />

            {!isPlaying && (
              <button
                onClick={() => {
                  videoRef.current.play();
                  setIsPlaying(true);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-semibold"
              >
                ▶ Play Video
              </button>
            )}

            {videoEnded && (
              <div className="absolute inset-0 grid place-content-center bg-black/70 gap-4">
                {!completedVideo.includes(subSectionId) && (
                  <IconBtn
                    onClick={handleLectureCompletion}
                    disabled={loading}
                    text={loading ? "Loading..." : "Mark As Completed"}
                  />
                )}

                <IconBtn
                  onClick={() => {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setVideoEnded(false);
                  }}
                  text="Rewatch"
                />

                <div className="flex gap-4 justify-center">
                  {!isFirstVideo() && (
                    <button onClick={goToPrevVideo} className="blackButton">
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button onClick={goToNextVideo} className="blackButton">
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={courseEntireData?.thumbnail}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* VIDEO DETAILS */}
      <h1 className="text-3xl font-semibold">{videoData?.title || "Video Title"}</h1>
      <p>{videoData?.description || "Video Description"}</p>
    </div>
  );
};

export default VideoDetails;
