import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataTokenSuperAdmin } from "../../../../hooks/Admin/useGetData";
import { useInsertDataSuperAdmin, useInsertDataWithImageSueprAdmin } from "../../../../hooks/Admin/useInsertData";
import { useDeleteDataSuperAdmin } from "../../../../hooks/Admin/useDeleteData";
import { handle401Error } from "../../../../utils/handle401Error";

//initialState
const initialState = {
  emojis: [],
  emoji: {
    loading: false,
    error: null,
    emojiDetails: {},
  },
  updatedEmoji: {
    loading: false,
    error: null,
    emojiUpdatedDetails: {},
  },
  deletedEmoji: {
    loading: false,
    error: null,
    emojiDeletedDetails: {},
  },
  deactiveEmoji: {
    loading: false,
    error: null,
    emojiDeactiveDetails: {},
  },
  error: null,
  loading: false,
  status:'idle'
};

//get_All_Emojis
export const getAllEmojisAction = createAsyncThunk(
  "cities/getAllEmojisAction",
  async (page, { rejectWithValue }) => {
    try {
      const response = await useGetDataTokenSuperAdmin(
        `/superAdmin_api/show_emoji?page=${page}`
      );
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error.response);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Add One Emoji
export const addNewEmojiAction = createAsyncThunk(
  "emojis/addNewEmoji",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImageSueprAdmin(
        `/superAdmin_api/add_emoji`,
        data
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

// update Emoji
export const updateEmojiAction = createAsyncThunk(
  "emojis/updateEmoji",
  async (data, { rejectWithValue }) => {
    try {
      const response = await useInsertDataWithImageSueprAdmin(
        `/superAdmin_api/update_emoji`,
        data
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

// Delete City
export const deleteEmojiAction = createAsyncThunk(
  "emojis/deleteEmoji",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useDeleteDataSuperAdmin(
        `/superAdmin_api/delete_emoji?id=${id}`
      );
      // console.log(response.data);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401Error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactive Emoji
export const deactiveEmojiAction = createAsyncThunk(
  "emojis/deactiveEmoji",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useInsertDataSuperAdmin(
        `/superAdmin_api/deactivate_emoji?id=${id}`,{}
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

export const resetDeletedEmoji = createAction("emojis/resetDeletedEmoji");
export const resetDeactiveEmoji = createAction("emojis/resetDeactiveEmoji");
export const resetEditEmoji = createAction("emojis/resetEditEmoji");

const citySlice = createSlice({
  name: "emojis",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
    resetAddState: (state) => {
      state.emoji = initialState.emoji;
    },
  },
  extraReducers: (builder) => {
    //get all emojis
    builder.addCase(getAllEmojisAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllEmojisAction.fulfilled, (state, action) => {
      state.loading = false;
      state.emojis = action.payload;
    });
    builder.addCase(getAllEmojisAction.rejected, (state, action) => {
      state.loading = false;
      state.emojis = null;
      state.error = action.payload;
    });
    //Add New Emoji
    builder.addCase(addNewEmojiAction.pending, (state) => {
      state.emoji.loading = true;
    });
    builder.addCase(addNewEmojiAction.fulfilled, (state, action) => {
      state.emoji.loading = false;
      state.emoji.emojiDetails = action.payload;
    });
    builder.addCase(addNewEmojiAction.rejected, (state, action) => {
      state.emoji.loading = false;
      state.emoji.emojiDetails = null;
      state.emoji.error = action.payload;
    });
    //Update Emoji
    builder.addCase(updateEmojiAction.pending, (state) => {
      state.updatedEmoji.loading = true;
    });
    builder.addCase(updateEmojiAction.fulfilled, (state, action) => {
      state.updatedEmoji.loading = false;
      state.updatedEmoji.emojiUpdatedDetails = action.payload;
    });
    builder.addCase(updateEmojiAction.rejected, (state, action) => {
      state.updatedEmoji.loading = false;
      state.updatedEmoji.emojiUpdatedDetails = null;
      state.updatedEmoji.error = action.payload;
    });
    //Delete Emoji
    builder.addCase(deleteEmojiAction.pending, (state) => {
      state.deletedEmoji.loading = true;
    });
    builder.addCase(deleteEmojiAction.fulfilled, (state, action) => {
      state.deletedEmoji.loading = false;
      state.deletedEmoji.emojiDeletedDetails = action.payload;
    });
    builder.addCase(deleteEmojiAction.rejected, (state, action) => {
      state.deletedEmoji.loading = false;
      state.deletedEmoji.emojiDeletedDetails = null;
      state.deletedEmoji.error = action.payload;
    });
    //Deactive Emoji
    builder.addCase(deactiveEmojiAction.pending, (state) => {
      state.deactiveEmoji.loading = true;
    });
    builder.addCase(deactiveEmojiAction.fulfilled, (state, action) => {
      state.deactiveEmoji.loading = false;
      state.deactiveEmoji.emojiDeactiveDetails = action.payload;
    });
    builder.addCase(deactiveEmojiAction.rejected, (state, action) => {
      state.deactiveEmoji.loading = false;
      state.deactiveEmoji.emojiDeactiveDetails = null;
      state.deactiveEmoji.error = action.payload;
    });
    //Reset updatedCity state
    // builder.addCase(resetUpdatedCity, (state) => {
    //   state.updatedCity = initialState.updatedCity;
    // });
    // Reset deletedEmoji state
    builder.addCase(resetDeletedEmoji, (state) => {
      state.deletedEmoji = initialState.deletedEmoji;
    });
    // Reset deactiveCity state
      builder.addCase(resetDeactiveEmoji, (state) => {
        state.deactiveEmoji = initialState.deactiveEmoji;
      });
      builder.addCase(resetEditEmoji, (state) => {
        state.updatedEmoji = initialState.updatedEmoji;
      });
  },
});
export const { resetStatus ,resetAddState} = citySlice.actions;
export default citySlice.reducer;
