import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataTokenSuperAdmin } from "../../../../hooks/Admin/useGetData";
import {
  useInsertDataSuperAdmin,
  useInsertDataWithImageSueprAdmin,
} from "../../../../hooks/Admin/useInsertData";
import { useDeleteDataSuperAdmin } from "../../../../hooks/Admin/useDeleteData";
import { handle401Error } from "../../../../utils/handle401Error";

//initialState
const initialState = {
  cities: [],
  city: {
    loading: false,
    error: null,
    cityDetails: {},
  },
  updatedCity: {
    loading: false,
    error: null,
    cityUpdatedDetails: {},
  },
  deletedCity: {
    loading: false,
    error: null,
    cityDeletedDetails: {},
  },
  deactiveCity: {
    loading: false,
    error: null,
    cityDeactiveDetails: {},
  },
  error: null,
  loading: false,
  status: "idle",
};

//get_All_Cities
export const getAllCitiesAction = createAsyncThunk(
  "cities/getAllCitiesAction",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataTokenSuperAdmin(
        `/superAdmin_api/show_cities?page=${page}`
      );
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      handle401Error(error.response); // Handle 401 error
      return rejectWithValue(error.response.data);
    }
  }
);

// Add One City
export const addNewCityAction = createAsyncThunk(
  "cities/addNewCity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImageSueprAdmin(
        `/superAdmin_api/add_city`,
        data
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response); // Handle 401 error
      return rejectWithValue(error.response.data);
    }
  }
);

// update City
export const updateCityAction = createAsyncThunk(
  "cities/updateCity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImageSueprAdmin(
        `/superAdmin_api/update_city`,
        data
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response); // Handle 401 error
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete City
export const deleteCityAction = createAsyncThunk(
  "cities/deleteCity",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useDeleteDataSuperAdmin(
        `/superAdmin_api/delete_city?id=${id}`
      );
      // console.log(response.data);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response); // Handle 401 error
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactive City
export const deactiveCityAction = createAsyncThunk(
  "cities/deactiveCity",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useInsertDataSuperAdmin(
        `/superAdmin_api/active_or_not_city?id=${id}`,
        {}
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response); // Handle 401 error
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetAddCity = createAction("cities/resetAddCity");
export const resetUpdatedCity = createAction("cities/resetUpdatedCity");
export const resetDeletedCity = createAction("cities/resetDeletedCity");
export const resetDeactiveCity = createAction("cities/resetDeactiveCity");

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    //get all cities
    builder.addCase(getAllCitiesAction.pending, (state) => {
      state.loading = true;
      state.status = "loading";
    });
    builder.addCase(getAllCitiesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.cities = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(getAllCitiesAction.rejected, (state, action) => {
      state.loading = false;
      state.cities = null;
      state.error = action.payload;
      state.status = "failed";
    });
    //Add New City
    builder.addCase(addNewCityAction.pending, (state) => {
      state.city.loading = true;
    });
    builder.addCase(addNewCityAction.fulfilled, (state, action) => {
      state.city.loading = false;
      state.city.cityDetails = action.payload;
    });
    builder.addCase(addNewCityAction.rejected, (state, action) => {
      state.city.loading = false;
      state.city.cityDetails = null;
      state.city.error = action.payload;
    });
    //Update City
    builder.addCase(updateCityAction.pending, (state) => {
      state.updatedCity.loading = true;
    });
    builder.addCase(updateCityAction.fulfilled, (state, action) => {
      state.updatedCity.loading = false;
      state.updatedCity.cityUpdatedDetails = action.payload;
    });
    builder.addCase(updateCityAction.rejected, (state, action) => {
      state.updatedCity.loading = false;
      state.updatedCity.cityUpdatedDetails = null;
      state.updatedCity.error = action.payload;
    });
    //Delete City
    builder.addCase(deleteCityAction.pending, (state) => {
      state.deletedCity.loading = true;
    });
    builder.addCase(deleteCityAction.fulfilled, (state, action) => {
      state.deletedCity.loading = false;
      state.deletedCity.cityDeletedDetails = action.payload;
    });
    builder.addCase(deleteCityAction.rejected, (state, action) => {
      state.deletedCity.loading = false;
      state.deletedCity.cityDeletedDetails = null;
      state.deletedCity.error = action.payload;
    });
    //Deactive City
    builder.addCase(deactiveCityAction.pending, (state) => {
      state.deactiveCity.loading = true;
    });
    builder.addCase(deactiveCityAction.fulfilled, (state, action) => {
      state.deactiveCity.loading = false;
      state.deactiveCity.cityDeactiveDetails = action.payload;
    });
    builder.addCase(deactiveCityAction.rejected, (state, action) => {
      state.deactiveCity.loading = false;
      state.deactiveCity.cityDeactiveDetails = null;
      state.deactiveCity.error = action.payload;
    });
    // Reset updatedCity state
    builder.addCase(resetUpdatedCity, (state) => {
      state.updatedCity = initialState.updatedCity;
    });
    // Reset deletedCity state
    builder.addCase(resetDeletedCity, (state) => {
      state.deletedCity = initialState.deletedCity;
    });
    // Reset deactiveCity state
    builder.addCase(resetDeactiveCity, (state) => {
      state.deactiveCity = initialState.deactiveCity;
    });
    // Reset resetAddCity state
    builder.addCase(resetAddCity, (state) => {
      state.city = initialState.city;
    });
  },
});

export const { resetStatus } = citySlice.actions;
export default citySlice.reducer;
