import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";
import { getLocalStorage } from "../utils/localStorage";

const URL = Host + "/category";
const authHeader = () => {
  return {
    headers: {
      authorization: "Bearer " + getLocalStorage("access"),
    },
  };
};

const initialState = {
  category: [],
  status: "idle",
  error: null,
};

export const retrieveCategories = createAsyncThunk(
  "category/retrieveCategories",
  async () => {
    const response = await axios.get(URL, authHeader());
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category) => {
    const response = await axios.post(URL, category, authHeader());
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId) => {
    const response = await axios.delete(URL + "/" + categoryId, authHeader());
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category) => {
    const response = await axios.patch(
      URL + "/" + category.id,
      { color: category.color },
      authHeader()
    );
    return response.data;
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(retrieveCategories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(retrieveCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.category = action.payload;
      })
      .addCase(retrieveCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.category.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.category = state.category.filter(
          (item) => item.id !== action.meta.arg
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
