import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedVideo: [],   
  totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setCompletedVideo: (state, action) => {
      state.completedVideo = action.payload
    },
    updateCompletedVideo: (state, action) => {
      state.completedVideo = [...state.completedVideo, action.payload]
    },
  },
})

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedVideo,
  updateCompletedVideo,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer
