// jobListingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchJobListings = createAsyncThunk("jobListings/fetchJobListings", async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get("http://localhost:5001/api/joblistings/user", config);
  return response.data;
});

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchJobListings.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default jobListingsSlice.reducer;