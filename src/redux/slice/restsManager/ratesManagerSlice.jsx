import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/Admin/useGetData";
import { useInsertData } from "../../../hooks/Admin/useInsertData";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";

//initialState
const initialState = {
  restsManager: [],
  storeId: {
    loading: true,
    error: null,
    storeIdDetails: {},
  },
  error: null,
  loading: false,
  status: "idle",
};

//get_All_RestsManager
export const getAllRestsManagerAction = createAsyncThunk(
  "rests/getAllRestManagerAction",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_restaurants?page=${page}`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Store ID Restaurant
export const sotreIdRestaurantAction = createAsyncThunk(
  "rests/sotreIdRestaurant",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useInsertData(
        `/admin_api/update_super_admin_restaurant_id`,
        { id }
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      // handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetStoreState = createAction(
  "rests/resetStoreState"
);

const restsManagerSlice = createSlice({
  name: "restsManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get all rests
    builder.addCase(getAllRestsManagerAction.pending, (state) => {
      state.loading = true;
      state.status = "loading";
    });
    builder.addCase(getAllRestsManagerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.restsManager = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(getAllRestsManagerAction.rejected, (state, action) => {
      state.loading = false;
      state.restsManager = null;
      state.error = action.payload;
      state.status = "failed";
    });

    //Store ID Restaurant
    builder.addCase(sotreIdRestaurantAction.pending, (state) => {
      state.storeId.loading = true;
    });
    builder.addCase(sotreIdRestaurantAction.fulfilled, (state, action) => {
      state.storeId.loading = false;
      state.storeId.storeIdDetails = action.payload;
    });
    builder.addCase(sotreIdRestaurantAction.rejected, (state, action) => {
      state.storeId.loading = false;
      state.storeId.storeIdDetails = null;
      state.storeId.error = action.payload;
    });

    // Reset store state
    builder.addCase(resetStoreState, (state) => {
      state.storeId = initialState.storeId;
    });
  },
});

export default restsManagerSlice.reducer;
