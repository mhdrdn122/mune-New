import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  useInsertData,
  useInsertDataWithImage,
} from "../../../hooks/Admin/useInsertData";
import { useGetDataToken } from "../../../hooks/Admin/useGetData";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";


//loginAdmin
export const loginAdminAction = createAsyncThunk(
  "auth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      console.log('we are in loging dispatch')
      const response = await useInsertData(
        `/admin_api/login?model=Admin`,
        data
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

//Get Admin Details
export const getAdminDetailsAction = createAsyncThunk(
  "auth/getAdminDetails",
  async ({ page, id }, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_admin?id=${id}&page=${page}`
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

// update Profile
export const updateProfileAction = createAsyncThunk(
  "auth/updateAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_admin?id=2`,
        payload
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

// update Restaurant
export const updateRestaurantAction = createAsyncThunk(
  "auth/updateRestaurant",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_restaurant_admin`,
        payload
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

//logout
export const logOutAdminAction = createAsyncThunk(
  "auth/logOutAdmin",
  async () => {
    //remove user from localstorage
    await localStorage.removeItem("adminInfo");
    return null;
  }
);

export const resetupdatedProfile = createAction("auth/resetupdatedProfile");

export const resetupdatedRestaurant = createAction(
  "auth/resetupdatedRestaurant"
);
export const resetLogin = createAction("auth/resetLogin");

const initialState = {
  loading: false,
  error: null,
  adminAuth: {
    error: null,
    adminInfo: localStorage.getItem("adminInfo")
      ? JSON.parse(localStorage.getItem("adminInfo"))
      : null,
  },
  adminDetails: {
    error: null,
    loading: false,
    details: {},
  },
  updatedProfile: {
    error: null,
    loading: false,
    updatedDetails: {},
  },
  updatedRestaurant: {
    error: null,
    loading: false,
    updatedDetails: {},
  },
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state)=>{
      state.adminAuth.error = null 
      state.adminAuth.adminInfo = null 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.adminAuth.adminInfo = action.payload.data;
      })
      .addCase(loginAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.adminAuth.error = action.payload;
      });
    //logout
    builder.addCase(logOutAdminAction.fulfilled, (state) => {
      state.loading = false;
      state.adminAuth.adminInfo = null;
    });
    // get Admin Details
    builder
      .addCase(getAdminDetailsAction.pending, (state) => {
        state.adminDetails.loading = true;
      })
      .addCase(getAdminDetailsAction.fulfilled, (state, action) => {
        state.adminDetails.loading = false;
        state.adminDetails.details = action.payload;
      })
      .addCase(getAdminDetailsAction.rejected, (state, action) => {
        state.adminDetails.loading = false;
        state.adminDetails.error = action.payload;
      });
    // update profile
    builder
      .addCase(updateProfileAction.pending, (state) => {
        state.updatedProfile.loading = true;
      })
      .addCase(updateProfileAction.fulfilled, (state, action) => {
        state.updatedProfile.loading = false;
        state.updatedProfile.updatedDetails = action.payload;
      })
      .addCase(updateProfileAction.rejected, (state, action) => {
        state.updatedProfile.loading = false;
        state.updatedProfile.error = action.payload;
      });
    // update Restaurant
    builder
      .addCase(updateRestaurantAction.pending, (state) => {
        state.updatedRestaurant.loading = true;
      })
      .addCase(updateRestaurantAction.fulfilled, (state, action) => {
        state.updatedRestaurant.loading = false;
        state.updatedRestaurant.updatedDetails = action.payload;
      })
      .addCase(updateRestaurantAction.rejected, (state, action) => {
        state.updatedRestaurant.loading = false;
        state.updatedRestaurant.error = action.payload;
      });
    // Reset resetupdatedProfile state
    builder.addCase(resetupdatedProfile, (state) => {
      state.updatedProfile = initialState.updatedProfile;
    });
    // Reset resetUpdatedRestaurant state
    builder.addCase(resetupdatedRestaurant, (state) => {
      state.updatedRestaurant = initialState.updatedRestaurant;
    });
    // Reset Login state
    builder.addCase(resetLogin, (state) => {
      state.adminAuth = initialState.adminAuth;
    });
  },
});

export const {resetAuthState } = authSlice.actions
export default authSlice.reducer;
