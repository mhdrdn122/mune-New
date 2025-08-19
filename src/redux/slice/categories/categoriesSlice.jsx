import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/Admin/useGetData";
import {
  useInsertData,
  useInsertDataWithImage,
} from "../../../hooks/Admin/useInsertData";
import useDeleteData from "../../../hooks/Admin/useDeleteData";
import notify from "../../../utils/useNotification";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";

//initialState
const initialState = {
  categories: [],
  category: {
    loading: false,
    error: null,
    catDetails: {},
  },
  updatedCategory: {
    loading: false,
    error: null,
    catUpdatedDetails: {},
  },
  deletedCategory: {
    loading: false,
    error: null,
    catDeletedDetails: {},
    status:false
  },
  deactiveCategory: {
    loading: false,
    error: null,
    catDeactiveDetails: {},
  },
  catWithSub: {
    loading: false,
    error: null,
    data: [],
  },
  error: null,
  loading: false,
  success: false,
  isUpdated: false,
};

export const get_All_Categories_and_sub = async()=>{
  try {
    // const response = await useGetDataToken(`/admin_api/show_categories_sub`);
    const response = await useGetDataToken(`/admin_api/show_categories_sub_in_item`);
    // console.log(response);
    return response;
  } catch (error) {
    // console.log(error);
    if (error.code === "ERR_NETWORK") {
      notify(error.message, "warn");
    }
    handle401ErrorAdmin(error.response);
    return rejectWithValue(error.response.data);
  }
}
//get_All_Categories
export const getAllCategoriesAction = createAsyncThunk(
  "categories/getAllCategories",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_admin_categories?page=${page}&per_page=10`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error);
      if (error.code === "ERR_NETWORK") {
        notify(error.message, "warn");
      }
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

//get_All_Categories_and_sub
export const getAllCategoriesWihtSubAction = createAsyncThunk(
  "categories/getAllCategoriesWihtSub",
  async (page, { rejectWithValue }) => {
    try {
      // const response = await useGetDataToken(`/admin_api/show_categories_sub`);
      const response = await useGetDataToken(`/admin_api/show_categories_sub_in_item`);
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error);
      if (error.code === "ERR_NETWORK") {
        notify(error.message, "warn");
      }
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Add One Category
export const addNewCategoryAction = createAsyncThunk(
  "categories/addNewCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/add_category`,
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

// update Category
export const updateCategoryAction = createAsyncThunk(
  "categories/updateCategory",
  async (payload, { rejectWithValue }) => {
    const { data } = payload;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_category`,
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
export const deleteCategoryAction = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useDeleteData(
        `/admin_api/delete_category?id=${id}`
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
// Deactive Category
export const deactiveCategoryAction = createAsyncThunk(
  "categories/deactiveCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useInsertData(
        `/admin_api/deactivate_category?id=${id}`,
        {}
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

// reorder Category
export const reorderCategoryAction = createAsyncThunk(
  "categories/reorderCategory",
  async ({ id, index }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(
        `/admin_api/reorder_categories?id=${id}&index=${index}`,
        {}
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

export const resetCategoryState = createAction("categories/resetCategoryState");
export const resetUpdatedCategory = createAction(
  "categories/resetUpdatedCategory"
);
export const resetDeletedCategory = createAction(
  "categories/resetDeletedCategory"
);
export const resetDeactiveCategory = createAction(
  "categories/resetDeactiveCategory"
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    //get all categories
    builder.addCase(getAllCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      // state.success = true;
      state.categories = action.payload;
    });
    builder.addCase(getAllCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.categories = null;
      state.error = action.payload;
    });
    //get all categories with sub
    builder.addCase(getAllCategoriesWihtSubAction.pending, (state) => {
      state.catWithSub.loading = true;
    });
    builder.addCase(
      getAllCategoriesWihtSubAction.fulfilled,
      (state, action) => {
        state.catWithSub.loading = false;
        state.catWithSub.data = action.payload;
      }
    );
    builder.addCase(getAllCategoriesWihtSubAction.rejected, (state, action) => {
      state.catWithSub.loading = false;
      state.catWithSub.data = null;
      state.catWithSub.error = action.payload;
    });
    //Add One Category
    builder.addCase(addNewCategoryAction.pending, (state) => {
      state.category.loading = true;
    });
    builder.addCase(addNewCategoryAction.fulfilled, (state, action) => {
      state.category.loading = false;
      state.category.catDetails = action.payload;
    });
    builder.addCase(addNewCategoryAction.rejected, (state, action) => {
      state.category.loading = false;
      state.category.catDetails = null;
      state.category.error = action.payload;
    });
    //update Category
    builder.addCase(updateCategoryAction.pending, (state) => {
      state.updatedCategory.loading = true;
    });
    builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
      state.updatedCategory.loading = false;
      state.updatedCategory.catUpdatedDetails = action.payload;
    });
    builder.addCase(updateCategoryAction.rejected, (state, action) => {
      state.updatedCategory.loading = false;
      state.updatedCategory.catUpdatedDetails = null;
      state.updatedCategory.error = action.payload;
    });
    //Delete Category
    builder.addCase(deleteCategoryAction.pending, (state) => {
      state.deletedCategory.loading = true;
    });
    builder.addCase(deleteCategoryAction.fulfilled, (state, action) => {
      state.deletedCategory.loading = false;
      state.deletedCategory.catDeletedDetails = action.payload;
    });
    builder.addCase(deleteCategoryAction.rejected, (state, action) => {
      state.deletedCategory.loading = false;
      state.deletedCategory.catDeletedDetails = null;
      state.deletedCategory.error = action.payload;
    });
    //Deactive Category
    builder.addCase(deactiveCategoryAction.pending, (state) => {
      state.deactiveCategory.loading = true;
    });
    builder.addCase(deactiveCategoryAction.fulfilled, (state, action) => {
      state.deactiveCategory.loading = false;
      state.deactiveCategory.catDeactiveDetails = action.payload;
    });
    builder.addCase(deactiveCategoryAction.rejected, (state, action) => {
      state.deactiveCategory.loading = false;
      state.deactiveCategory.catDeactiveDetails = null;
      state.deactiveCategory.error = action.payload;
    });
    // Reset updatedCategory state
    builder.addCase(resetUpdatedCategory, (state) => {
      state.updatedCategory = initialState.updatedCategory;
    });
    // Reset deletedCategory state
    builder.addCase(resetDeletedCategory, (state) => {
      state.deletedCategory = initialState.deletedCategory;
    });
    // Reset category state
    builder.addCase(resetCategoryState, (state) => {
      state.category = initialState.category;
    });
    // Reset Deactive state
    builder.addCase(resetDeactiveCategory, (state) => {
      state.deactiveCategory = initialState.deactiveCategory;
    });
  },
});

export const { resetSuccess } = categoriesSlice.actions;
export default categoriesSlice.reducer;
