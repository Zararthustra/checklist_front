import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Host } from "../utils/host";
import { getLocalStorage } from "../utils/localStorage";

const URL = Host + "/tasks";
const authHeader = () => {
  return {
    headers: {
      authorization: "Bearer " + getLocalStorage("access"),
    },
  };
};

const initialState = {
  task: [],
  status: "idle",
  error: null,
};

export const retrieveTasks = createAsyncThunk(
  "category/retrieveTasks",
  async () => {
    const response = await axios.get(URL, authHeader());
    return response.data
  }
);

export const createTask = createAsyncThunk(
  "category/createTask",
  async (task) => {
    const response = await axios.post(URL, task, {...authHeader(), params: {
      categoryId: task.categoryId
    }});
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "category/deleteTask",
  async (taskId) => {
    const response = await axios.delete(URL + "/" + taskId, authHeader());
    return response.data;
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(retrieveTasks.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(retrieveTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(retrieveTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createTask.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteTask.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task = state.task.filter(
          (item) => item.id !== action.meta.arg
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
