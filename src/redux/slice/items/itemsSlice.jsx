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
  items: [],
  itemsCache: {}, // Add cache for items
  newItem: {
    loading: false,
    error: null,
    itemDetails: {},
  },
  updatedItem: {
    loading: false,
    error: null,
    updateditemDetails: {},
  },
  deletedItem: {
    loading: false,
    error: null,
    deletedItemDetails: {},
  },
  deactiveItem: {
    loading: false,
    error: null,
    itemDeactiveDetails: {},
  },
  error: null,
  loading: false,
  success: false,
  isUpdated: false,
};

//get_All_Items
export const getAllItemsAction = createAsyncThunk(
  "items/getAllItems",
  async (payload, { rejectWithValue }) => {
    const { page, id, subId, resId } = payload;

    const state = store.getState();
    const cacheKey = `${id}-${subId}-${page}`;

    // console.log(state);

    // Check cache first
    // if (!state.items.isUpdated) {
    //   if (state.items.itemsCache[cacheKey]) {
    //     console.log("Using cache:", state.items.itemsCache[cacheKey]);
    //     return {
    //       data: state.items.itemsCache[cacheKey],
    //       cacheKey,
    //     };
    //   }
    // }
    let url = "";
    if (resId) url = `/admin_api/show_items?restaurant_id=${resId}`;
    else
      url = `/admin_api/show_items?${
        subId === "0" ? `&category_id=${id}` : `&category_id=${subId}`
      }&page=${page}&per_page=10`;
    try {
      const response = await useGetDataToken(url);
      // console.log(response);
      // return response;
      return { data: response, cacheKey };
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error);
    }
  }
);

// Add New Item
export const addNewItemAction = createAsyncThunk(
  "items/addNewItem",
  async (payload, { rejectWithValue, dispatch }) => {
    const { data, id, subId } = payload;
    const cacheKey = `${id}-${subId}`;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/add_item`,
        data
      );
      // Remove the specific cache key after a new item is added
      // dispatch(removeItemFromCacheAction(cacheKey));
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

//update Item
export const updateItemAction = createAsyncThunk(
  "items/updateItem",
  async (payload, { rejectWithValue, dispatch }) => {
    const { data, id, subId } = payload;
    const cacheKey = `${id}-${subId}`;
    try {
      const response = await useInsertDataWithImage(
        `/admin_api/update_item`,
        data
      );
      // Remove the specific cache key after a new item is updated
      // dispatch(removeItemFromCacheAction(cacheKey));
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Item
export const deleteItemAction = createAsyncThunk(
  "items/deletedItem",
  async (payload, { rejectWithValue, dispatch }) => {
    const { id, masterId, subId } = payload;
    const cacheKey = `${masterId}-${subId}`;
    try {
      const response = await useDeleteData(`/admin_api/delete_item?id=${id}`);
      // console.log(response.data);

      // Remove the specific cache key after a new item is updated
      // dispatch(removeItemFromCacheAction(cacheKey));
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactive  Item
export const deactiveItemAction = createAsyncThunk(
  "items/deactiveItem",
  async (payload, { rejectWithValue, dispatch }) => {
    const { id, masterId, subId } = payload;
    const cacheKey = `${masterId}-${subId}`;
    try {
      const response = await useInsertData(
        `/admin_api/deactivate_item?id=${id}`,
        {}
      );
      // dispatch(removeItemFromCacheAction(cacheKey));
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
export const reorderItemAction = createAsyncThunk(
  "items/reorderItem",
  async ({ id, index, id2 }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(
        `/admin_api/reorder_items?id=${id}&index=${index}&category_id=${id2}`,
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

export const resetAddItem = createAction("items/resetAddItem");

export const resetUpdatedItem = createAction("items/resetUpdatedItem");
export const resetDeletedItem = createAction("items/resetDeletedItem");
export const resetDeactiveItem = createAction("items/resetDeactiveItem");
export const removeItemFromCacheAction = createAction(
  "items/removeItemFromCache"
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    //get all items
    builder.addCase(getAllItemsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllItemsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { data, cacheKey } = action.payload;
      state.items = data;
      state.isUpdated = false;

      // Store data in cache
      state.itemsCache[cacheKey] = data;
    });
    builder.addCase(getAllItemsAction.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.items = null;
      state.error = action.payload;
    });
    //Add New Item
    builder.addCase(addNewItemAction.pending, (state) => {
      state.newItem.loading = true;
    });
    builder.addCase(addNewItemAction.fulfilled, (state, action) => {
      state.newItem.loading = false;
      state.newItem.itemDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(addNewItemAction.rejected, (state, action) => {
      state.newItem.loading = false;
      state.newItem.itemDetails = null;
      state.newItem.error = action.payload;
    });
    //Update Item
    builder.addCase(updateItemAction.pending, (state) => {
      state.updatedItem.loading = true;
    });
    builder.addCase(updateItemAction.fulfilled, (state, action) => {
      state.updatedItem.loading = false;
      state.updatedItem.updateditemDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateItemAction.rejected, (state, action) => {
      state.updatedItem.loading = false;
      state.updatedItem.updateditemDetails = null;
      state.updatedItem.error = action.payload;
    });
    // reorder Item Action
    builder.addCase(reorderItemAction.fulfilled, (state) => {
      state.isUpdated = true;
    });
    //Delete Item
    builder.addCase(deleteItemAction.pending, (state) => {
      state.deletedItem.loading = true;
    });
    builder.addCase(deleteItemAction.fulfilled, (state, action) => {
      state.deletedItem.loading = false;
      state.deletedItem.deletedItemDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(deleteItemAction.rejected, (state, action) => {
      state.deletedItem.loading = false;
      state.deletedItem.deletedItemDetails = null;
      state.deletedItem.error = action.payload;
    });
    //Deactive Category
    builder.addCase(deactiveItemAction.pending, (state) => {
      state.deactiveItem.loading = true;
    });
    builder.addCase(deactiveItemAction.fulfilled, (state, action) => {
      state.deactiveItem.loading = false;
      state.deactiveItem.itemDeactiveDetails = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(deactiveItemAction.rejected, (state, action) => {
      state.deactiveItem.loading = false;
      state.deactiveItem.itemDeactiveDetails = null;
      state.deactiveItem.error = action.payload;
    });

    // Reset updatedItem state
    builder.addCase(resetUpdatedItem, (state) => {
      state.updatedItem = initialState.updatedItem;
    });
    // Reset deletedSubCategory state
    builder.addCase(resetDeletedItem, (state) => {
      state.deletedItem = initialState.deletedItem;
    });
    // Reset Deactive state
    builder.addCase(resetDeactiveItem, (state) => {
      state.deactiveItem = initialState.deactiveItem;
    });
    // Reset add state
    builder.addCase(resetAddItem, (state) => {
      state.newItem = initialState.newItem;
    });

    // Remove specific cache key
    builder.addCase(removeItemFromCacheAction, (state, action) => {
      const cacheKey = action.payload;
      console.log(cacheKey);
      delete state.itemsCache[cacheKey];
    });
  },
});
export const { resetSuccess } = itemsSlice.actions;
export default itemsSlice.reducer;
