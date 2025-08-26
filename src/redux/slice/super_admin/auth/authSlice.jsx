import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  useInsertData,
  useInsertDataSuperAdmin,
} from "../../../../hooks/Admin/useInsertData";
import { useGetDataSuperAdminBackup, useGetDataTokenSuperAdmin } from "../../../../hooks/Admin/useGetData";
import { handle401Error } from "../../../../utils/handle401Error";

const initialState = {
  loading: false,
  error: null,
  status: 'idle',
  superAdminAuth: {
    error: null,
    superAdminInfo: localStorage.getItem("superAdminInfo")
      ? JSON.parse(localStorage.getItem("superAdminInfo"))
      : null,
  },
  superAdminDetails: {
    error: null,
    loading: false,
    details: {},
  },
  updatedProfile: {
    error: null,
    loading: false,
    data: {},
  },
  backupCreate: {
    error: null,
    loading: false,
    data: {},
  },
  backupDownload: {
    error: null,
    loading: false,
    data: {},
  },
  backupImages: {
    error: null,
    loading: false,
    data: {},
  },
};

//login
export const loginSuperAdminAction = createAsyncThunk( 
  "auth/loginSuperAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataSuperAdmin(
        `/superAdmin_api/login?model=SuperAdmin`,
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

//logout
export const logOutSuperAdminAction = createAsyncThunk(
  "auth/logOutSuperAdmin",
  async () => {
    // localStorage.removeItem("superAdminInfo");
    await localStorage.clear();
    return null;
  }
);

// update Profile super admin
export const updateSuperAdminAction = createAsyncThunk(
  "auth/updateSuperAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useInsertDataSuperAdmin(
        `/superAdmin_api/update_super_admin`,
        payload
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

//Create Backup DB
export const createBackupDBAction = createAsyncThunk(
  "auth/createBackupDB",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataTokenSuperAdmin(
        `/superAdmin_api/backup/create`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

//Download Backup DB
export const downloadBackupDBAction = createAsyncThunk(
  "auth/downloadBackupDB",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataTokenSuperAdmin(
        `/superAdmin_api/backup/download`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Backup Images
export const getBackupImagesAction = createAsyncThunk(
  "auth/getBackupImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await useGetDataSuperAdminBackup(
        `/superAdmin_api/backup/storage`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetUpdateProfileState = createAction(
  "auth/resetUpdateProfileState"
);
export const resetCreateBackupState = createAction(
  "auth/resetCreateBackupState"
);
export const resetDownloadBackupState = createAction(
  "auth/resetDownloadBackupState"
);
export const resetBackupImagesState = createAction(
  "auth/resetBackupImagesState"
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state)=>{
      state.superAdminAuth.error = null 
      state.superAdminAuth.superAdminInfo = null 
    }
  },
  extraReducers: (builder) => {
    //login
    builder
      .addCase(loginSuperAdminAction.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(loginSuperAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.superAdminAuth.superAdminInfo = action.payload.data;
      })
      .addCase(loginSuperAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.superAdminAuth.error = action.payload;
      });
    // update profile
    builder
      .addCase(updateSuperAdminAction.pending, (state) => {
        state.updatedProfile.loading = true;
      })
      .addCase(updateSuperAdminAction.fulfilled, (state, action) => {
        state.updatedProfile.loading = false;
        state.updatedProfile.data = action.payload;
      })
      .addCase(updateSuperAdminAction.rejected, (state, action) => {
        state.updatedProfile.loading = false;
        state.updatedProfile.error = action.payload;
      });
    // Backup DB
    builder
      .addCase(createBackupDBAction.pending, (state) => {
        state.backupCreate.loading = true;
      })
      .addCase(createBackupDBAction.fulfilled, (state, action) => {
        state.backupCreate.loading = false;
        state.backupCreate.data = action.payload;
      })
      .addCase(createBackupDBAction.rejected, (state, action) => {
        state.backupCreate.loading = false;
        state.backupCreate.error = action.payload;
      });
    // Backup DB
    builder
      .addCase(downloadBackupDBAction.pending, (state) => {
        state.backupDownload.loading = true;
      })
      .addCase(downloadBackupDBAction.fulfilled, (state, action) => {
        state.backupDownload.loading = false;
        state.backupDownload.data = action.payload;
      })
      .addCase(downloadBackupDBAction.rejected, (state, action) => {
        state.backupDownload.loading = false;
        state.backupDownload.error = action.payload;
      });
    // Backup Images
    builder
      .addCase(getBackupImagesAction.pending, (state) => {
        state.backupImages.loading = true;
      })
      .addCase(getBackupImagesAction.fulfilled, (state, action) => {
        state.backupImages.loading = false;
        // state.backupImages.data = action.payload;
      })
      .addCase(getBackupImagesAction.rejected, (state, action) => {
        state.backupImages.loading = false;
        // state.backupImages.error = action.payload;
      });
    //logout
    builder.addCase(logOutSuperAdminAction.fulfilled, (state) => {
      state.loading = false;
      state.superAdminAuth.superAdminInfo = null;
    });
    //reset update profile
    builder.addCase(resetUpdateProfileState, (state) => {
      state.updatedProfile = initialState.updatedProfile;
    });
    //reset Create backup state
    builder.addCase(resetCreateBackupState, (state) => {
      state.backupCreate = initialState.backupCreate;
    });
    //reset Download backup state
    builder.addCase(resetDownloadBackupState, (state) => {
      state.backupDownload = initialState.backupDownload;
    });
    //reset backup images state
    builder.addCase(resetBackupImagesState, (state) => {
      state.backupImages = initialState.backupImages;
    });
  },
});
export const {resetAuthState }  = authSlice.actions;
export default authSlice.reducer;
