// src/actions/userActions.js
import axios from 'axios';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE
} from '../constants/userConstant';

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error
  };
};

// actions/userActions.js
export const fetchUsers = () => async (dispatch, getState) => {
    try {
      // Dispatch a request action to indicate the start of the process
      dispatch({ type: FETCH_USERS_REQUEST });
  
      // Retrieve user data from localStorage
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        // If user data is not found in localStorage, throw an error
        throw new Error("User data not found in localStorage");
      }
  
      // Parse the user data JSON string
      const userData = JSON.parse(userDataString);
      const token = userData.token;
  
      // Make a GET request to the API endpoint to fetch user data
      const response = await axios.get("http://localhost:5001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Log the response for debugging purposes
      console.log("API Response:", response);
  
      // Dispatch a success action with the fetched user data
      dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
  
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching users:", error);
  
      // Dispatch a failure action with the error message
      dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    }

};


