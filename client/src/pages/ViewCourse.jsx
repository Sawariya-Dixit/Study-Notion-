import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  
  setCompletedVideo,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

useEffect(() => {
  (async () => {
    const courseData = await getFullDetailsOfCourse(courseId, token)

    console.log("🔥 ViewCourse → FULL DATA:", courseData)

    const courseDetails = courseData?.courseDetails
    const completedVideo = courseData?.completedVideo || []

    console.log("📘 courseDetails:", courseDetails)
    console.log("📘 courseContent:", courseDetails?.courseContent)
    console.log("📘 completedVideo:", completedVideo)

    if (!courseDetails || !courseDetails.courseContent?.length) {
      console.log("❌ NO COURSE CONTENT")
      return
    }

    dispatch(setCourseSectionData(courseDetails.courseContent))
    dispatch(setEntireCourseData(courseDetails))
    dispatch(setCompletedVideo(completedVideo))

    let lectures = 0
    courseDetails.courseContent.forEach((sec) => {
      lectures += sec.SubSection.length
    })
    dispatch(setTotalNoOfLectures(lectures))
  })()
}, [])




  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet/>
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}