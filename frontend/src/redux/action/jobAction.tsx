// actions/jobActions.js
export const setJobListings = (listings) => ({
    type: 'SET_JOB_LISTINGS',
    payload: listings,
  });
  
  export const fetchJobListings = () => async (dispatch) => {
    try {
      const response = await fetch('http://localhost:5001/api/joblistings/all'); // Replace with your actual API endpoint
      const data = await response.json();
      dispatch(setJobListings(data));
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };
  