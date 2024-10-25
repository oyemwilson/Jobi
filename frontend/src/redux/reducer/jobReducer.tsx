
const initialState = {
    jobListings: [],
  };
  
  const jobReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_JOB_LISTINGS':
        return {
          ...state,
          jobListings: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default jobReducer;
  