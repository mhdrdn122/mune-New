import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/Admin/useGetData";
import {
  useInsertData,
  useInsertDataWithImage,
} from "../../../hooks/Admin/useInsertData";
import useDeleteData from "../../../hooks/Admin/useDeleteData";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";

//initialState
const initialState = {
  ads: [],
  adv: {
    loading: false,
    error: null,
    advDetails: {},
  },
  updatedAdv: {
    loading: false,
    error: null,
    advUpdatedDetails: {},
  },
  deletedAdv: {
    loading: false,
    error: null,
    advDeletedDetails: {},
  },
  error: null,
  loading: false,
  success: false,
  isUpdated: false,
};

//get_All_Ads
export const getAllAdsAction = createAsyncThunk(
  "Ads/getAllAds",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_advertisements?page=${page}&per_page=10`
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

// Add One Adv
export const addNewAdvAction = createAsyncThunk(
  "Ads/addNewAdv",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/add_advertisement`,
        data
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// update Adv
export const updateAdvAction = createAsyncThunk(
  "Ads/updateAdv",
  async (payload, { rejectWithValue }) => {
    const { data, id } = payload;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_advertisement`,
        data
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Category
export const deleteAdvAction = createAsyncThunk(
  "Ads/deleteAdv",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useDeleteData(
        `/admin_api/delete_advertisement?id=${id}`
      );
      // console.log(response.data);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetAdvState = createAction("Ads/resetAdvState");
export const resetUpdatedAdv = createAction("Ads/resetUpdatedAdv");
export const resetDeletedAdv = createAction("Ads/resetDeletedAdv");

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    //get all ads
    builder.addCase(getAllAdsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllAdsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.ads = action.payload;
    });
    builder.addCase(getAllAdsAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.ads = null;
      state.error = action.payload;
    });
    //Add One Adv
    builder.addCase(addNewAdvAction.pending, (state) => {
      state.adv.loading = true;
    });
    builder.addCase(addNewAdvAction.fulfilled, (state, action) => {
      state.adv.loading = false;
      state.adv.advDetails = action.payload;
    });
    builder.addCase(addNewAdvAction.rejected, (state, action) => {
      state.adv.loading = false;
      state.adv.advDetails = null;
      state.adv.error = action.payload;
    });
    //update Adv
    builder.addCase(updateAdvAction.pending, (state) => {
      state.updatedAdv.loading = true;
    });
    builder.addCase(updateAdvAction.fulfilled, (state, action) => {
      state.updatedAdv.loading = false;
      state.updatedAdv.advUpdatedDetails = action.payload;
    });
    builder.addCase(updateAdvAction.rejected, (state, action) => {
      state.updatedAdv.loading = false;
      state.updatedAdv.advUpdatedDetails = null;
      state.updatedAdv.error = action.payload;
    });

    //Delete Adv
    builder.addCase(deleteAdvAction.pending, (state) => {
      state.deletedAdv.loading = true;
    });
    builder.addCase(deleteAdvAction.fulfilled, (state, action) => {
      state.deletedAdv.loading = false;
      state.deletedAdv.advDeletedDetails = action.payload;
    });
    builder.addCase(deleteAdvAction.rejected, (state, action) => {
      state.deletedAdv.loading = false;
      state.deletedAdv.advDeletedDetails = null;
      state.deletedAdv.error = action.payload;
    });

    // Reset updatedAdv state
    builder.addCase(resetUpdatedAdv, (state) => {
      state.updatedAdv = initialState.updatedAdv;
    });
    // Reset deletedAdv state
    builder.addCase(resetDeletedAdv, (state) => {
      state.deletedAdv = initialState.deletedAdv;
    });
    // Reset Adv state
    builder.addCase(resetAdvState, (state) => {
      state.adv = initialState.adv;
    });
  },
});
export const { resetSuccess } = adsSlice.actions;
export default adsSlice.reducer;
