import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/eBookSlice";
import errorReducer from "./slices/errorSlice";
import filterReducer from "./slices/filterSlice";

const store = configureStore({
  reducer: {
    ebook: booksReducer,
    filter: filterReducer,
    error: errorReducer,
  },
});

export default store;
