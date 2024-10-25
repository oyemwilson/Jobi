import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { boolean } from 'yup';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  id: string | null; // Assuming user ID is a string (modify if different)
  isAdmin: boolean | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userRole: null,
  firstName: null,
  lastName: null,
  email: null,
  id: null,
  isAdmin: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action: PayloadAction<{ token: string; firstName:string; lastName:string;email: string; _id: string; isAdmin:boolean; role: string; user: any }>) => {
        console.log("AAA 1")
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userRole = action.payload.role;
        state.firstName = action.payload.firstName;  // Access user name
        state.lastName = action.payload.lastName;  // Access user name
        state.email = action.payload.email; // Access user email
        state.id = action.payload._id;      // Assuming ID is stored in "_id" field
        state.isAdmin = action.payload.isAdmin;
      },
      // ... other reducers
  
    logoutHandler: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userRole = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.id = null;
      state.isAdmin = null;
    },
  },
});

export const { login, logoutHandler } = authSlice.actions;
export default authSlice.reducer;
