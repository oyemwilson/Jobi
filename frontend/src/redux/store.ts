import wishlistSlice from './features/wishlist';
import { configureStore } from '@reduxjs/toolkit';
import filterSlice from './features/filterSlice';
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"; 
import { userLoginReducer } from "../reducer/userReducers"
import authSlice from './features/authSlice';
import jobListingsSlice from './features/JoblistSlice';
import { persistStore, persistReducer } from 'redux-persist';
import jobReducer from './reducer/jobReducer';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './reducer/userReducer';


// const persistConfig = {
//   key: 'root', // Key to store the persisted state under
//   storage, // Storage method (localStorage by default)
//   // Add any additional configuration options here
// };

// const authPersistReducer = persistReducer(persistConfig, authSlice);
 

export const store = configureStore({
  reducer: {
    filter:filterSlice,
    wishlist:wishlistSlice,
    auth: authSlice,
    jobListings: jobListingsSlice,
    job: jobReducer,
    user: userReducer
    // userLogin:userLoginReducer
  },
  
  
})










export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch