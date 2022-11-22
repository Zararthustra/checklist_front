import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { categorySlice } from "./categorySlice";
import { taskSlice } from "./taskSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    category: categorySlice.reducer,
    task: taskSlice.reducer,
  },
});
