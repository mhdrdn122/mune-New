import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/Admin/useGetData";
import {
  useInsertData,
  useInsertDataWithImage,
} from "../../../hooks/Admin/useInsertData";
import useDeleteData from "../../../hooks/Admin/useDeleteData";
import store from "../../store/store";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";

//initialState
const initialState = {
  subCategories: [],
  subCategoriesCache: {}, // Add cache for subcategories
  newSubCategory: {
    loading: false,
    error: null,
    subCatDetails: {},
  },
  updatedSubCategory: {
    loading: false,
    error: null,
    subCatUpdatedDetails: {},
  },
  deletedSubCategory: {
    loading: false,
    error: null,
    subCatDeletedDetails: {},
  },
  deactiveSubCategory: {
    loading: false,
    error: null,
    subCatDeactiveDetails: {},
  },
  error: null,
  loading: false,
  success: false,
  isUpdated: false,
};

//get_All_Sub_Categories
export const getAllSubCategoriesAction = createAsyncThunk(
  "subCategories/getAllSubCategories",
  async (payload, { rejectWithValue }) => {
    const { page, id } = payload;

    const state = store.getState();
    const cacheKey = `${id}-${page}`;

    // console.log(state);

    // Check cache first
    // if (!state.subCategories.isUpdated) {
    //   if (state.subCategories.subCategoriesCache[cacheKey]) {
    //     console.log(
    //       "Using cache:",
    //       state.subCategories.subCategoriesCache[cacheKey]
    //     );
    //     return {
    //       data: state.subCategories.subCategoriesCache[cacheKey],
    //       cacheKey,
    //     };
    //   }
    // }

    try {
      const response = await useGetDataToken(
        `/admin_api/show_admin_categories?category_id=${id}&page=${page}&per_page=10`
      );
      // console.log(response);
      // return response;
      return { data: response, cacheKey };
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Add One Sub Category
export const addNewSubCategoryAction = createAsyncThunk(
  "subCategories/addNewSubCategory",
  async (payload, { rejectWithValue, dispatch }) => {
    const { data, id } = payload;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/add_category`,
        data
      );
      // dispatch(removeSubFromCacheAction(data.category_id));
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

//update Sub Category
export const updateSubCategoryAction = createAsyncThunk(
  "subCategories/updateSubCategory",
  async (payload, { rejectWithValue, dispatch }) => {
    const { data, id } = payload;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_category`,
        data
      );
      // dispatch(removeSubFromCacheAction(id));
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Sub Category
export const deleteSubCategoryAction = createAsyncThunk(
  "subCategories/deleteSubCategory",
  async (payload, { rejectWithValue, dispatch }) => {
    const { id, masterId } = payload;
    try {
      const response = await useDeleteData(
        `/admin_api/delete_category?id=${id}`
      );
      // dispatch(removeSubFromCacheAction(masterId));
      // console.log(response.data);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactive Sub Category
export const deactiveSubCategoryAction = createAsyncThunk(
  "subCategories/deactiveSubCategory",
  async (payload, { rejectWithValue, dispatch }) => {
    const { id, masterId } = payload;
    try {
      const response = await useInsertData(
        `/admin_api/deactivate_category?id=${id}`,
        {}
      );
      // dispatch(removeSubFromCacheAction(masterId));

      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// reorder subCategory
export const reorderSubCategoryAction = createAsyncThunk(
  "subCategories/reorderSubCategory",
  async ({ id, index, id2 }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(
        `/admin_api/reorder_categories?id=${id}&index=${index}&category_id=${id2}`,
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

export const resetAddSubCategory = createAction(
  "subCategories/resetAddSubCategory"
);
export const resetUpdatedSubCategory = createAction(
  "subCategories/resetUpdatedSubCategory"
);
export const resetDeletedSubCategory = createAction(
  "subCategories/resetDeletedSubCategory"
);
export const resetDeactiveSubCategory = createAction(
  "subCategories/resetDeactiveSubCategory"
);
export const resetSuccess = createAction("subCategories/resetSuccess");
export const removeSubFromCacheAction = createAction(
  "items/removeSubFromCacheAction"
);

const categoriesSlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get all categories
    builder.addCase(getAllSubCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllSubCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { data, cacheKey } = action.payload;
      state.subCategories = data;
      state.isUpdated = false;
      // Store data in cache
      state.subCategoriesCache[cacheKey] = data;
    });
    builder.addCase(getAllSubCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.subCategories = null;
      state.error = action.payload;
    });

    //Add One Sub Category
    builder.addCase(addNewSubCategoryAction.pending, (state) => {
      state.newSubCategory.loading = true;
    });
    builder.addCase(addNewSubCategoryAction.fulfilled, (state, action) => {
      state.newSubCategory.loading = false;
      state.newSubCategory.subCatDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(addNewSubCategoryAction.rejected, (state, action) => {
      state.newSubCategory.loading = false;
      state.newSubCategory.subCatDetails = null;
      state.newSubCategory.error = action.payload;
    });

    //update Sub Category
    builder.addCase(updateSubCategoryAction.pending, (state) => {
      state.updatedSubCategory.loading = true;
    });
    builder.addCase(updateSubCategoryAction.fulfilled, (state, action) => {
      state.updatedSubCategory.loading = false;
      state.updatedSubCategory.subCatUpdatedDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateSubCategoryAction.rejected, (state, action) => {
      state.updatedSubCategory.loading = false;
      state.updatedSubCategory.subCatUpdatedDetails = null;
      state.updatedSubCategory.error = action.payload;
    });
    //Delete Category
    builder.addCase(deleteSubCategoryAction.pending, (state) => {
      state.deletedSubCategory.loading = true;
    });
    builder.addCase(deleteSubCategoryAction.fulfilled, (state, action) => {
      state.deletedSubCategory.loading = false;
      state.deletedSubCategory.subCatDeletedDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(deleteSubCategoryAction.rejected, (state, action) => {
      state.deletedSubCategory.loading = false;
      state.deletedSubCategory.subCatDeletedDetails = null;
      state.deletedSubCategory.error = action.payload;
    });
    //Deactive Category
    builder.addCase(deactiveSubCategoryAction.pending, (state) => {
      state.deactiveSubCategory.loading = true;
    });
    builder.addCase(deactiveSubCategoryAction.fulfilled, (state, action) => {
      state.deactiveSubCategory.loading = false;
      state.deactiveSubCategory.subCatDeactiveDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(deactiveSubCategoryAction.rejected, (state, action) => {
      state.deactiveSubCategory.loading = false;
      state.deactiveSubCategory.subCatDeactiveDetails = null;
      state.deactiveSubCategory.error = action.payload;
    });
    //reorder SubCategory Action
    builder.addCase(reorderSubCategoryAction.fulfilled, (state) => {
      state.isUpdated = true;
    });

    // Reset updatedSubCategory state
    builder.addCase(resetUpdatedSubCategory, (state) => {
      state.updatedSubCategory = initialState.updatedSubCategory;
    });
    // Reset deletedSubCategory state
    builder.addCase(resetDeletedSubCategory, (state) => {
      state.deletedSubCategory = initialState.deletedSubCategory;
    });
    // Reset Deactive state
    builder.addCase(resetDeactiveSubCategory, (state) => {
      state.deactiveSubCategory = initialState.deactiveSubCategory;
    });
    // Reset Add state
    builder.addCase(resetAddSubCategory, (state) => {
      state.newSubCategory = initialState.newSubCategory;
    });
    // Reset success state
    builder.addCase(resetSuccess, (state) => {
      state.success = initialState.success;
    });

    // Remove specific cache key
    builder.addCase(removeSubFromCacheAction, (state, action) => {
      const cacheKey = action.payload;
      console.log(cacheKey);
      delete state.subCategoriesCache[cacheKey];
    });
  },
});

export default categoriesSlice.reducer;
