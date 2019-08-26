const course = {
  state: {
    courseName: '',
    courseId: '',
    subId: ''
  },
  mutations: {
    SET_COURSE_NAME: (state, name) => {
      state.courseName = name
    },
    SET_COURSE_ID: (state, id) => {
      state.courseId = id
    },
    SET_ORDER_ID: (state, id) => {
      state.subId = id
    }
  },
  actions: {
  }
}

export default course
