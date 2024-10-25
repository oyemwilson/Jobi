// src/reducers/userReducer.js
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE
  } from '../constants/userConstant'
  
  const initialState = {
    users: [],
    loading: false,
    error: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USERS_REQUEST:
        console.log("Fetching users...");
        return { ...state, loading: true };
      case FETCH_USERS_SUCCESS:
        console.log("Users fetched successfully:", action.payload);
        return { ...state, loading: false, users: action.payload };
      case FETCH_USERS_FAILURE:
        console.log("Error fetching users:", action.payload);
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default userReducer;