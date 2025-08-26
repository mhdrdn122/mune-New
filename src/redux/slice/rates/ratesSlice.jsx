import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataExcel, useGetDataToken } from "../../../hooks/Admin/useGetData";
import { handle401ErrorAdmin } from "../../../utils/handle401Error";

//initialState
const initialState = {
  rates: [],
  ratesExcel: {
    loading: false,
    error: null,
    excelData: {},
  },
  smsRecharge: {
    loadingSms: false,
    errorSms: null,
    smsRechargeData: {},
  },
  smsWithdrawals: {
    loadingSmsWith: false,
    errorSmsWith: null,
    smsWithdrawalsData: {},
  },
  error: null,
  loading: false,
  success: false,
};

//get_All_Rates
export const getAllRatesAction = createAsyncThunk(
  "Rates/getAllRates",
  async (
    {
      adminId,
      fromDate,
      toDate,
      type,
      from_age,
      to_age,
      rate,
      gender,
      resId,
      page,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_rates?page=${page}&restaurant_id=${resId}&adminId=${adminId}
        &from_date=${fromDate}&to_date=${toDate}&type=${type}${
          from_age ? `&from_age=${from_age}` : ""
        }${to_age ? `&to_age=${to_age}` : ""} ${
          rate !== 0 ? `&rate=${rate}` : ""
        }${gender ? `&gender=${gender}` : ""}`
      );
      return response;
    } catch (error) {
      // console.log(error.response.data);
      handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);
//get_All_Rates
export const getRatesExcelAction = createAsyncThunk(
  "Rates/getRatesExcel",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useGetDataExcel(`/admin_api/excel`);
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      // handle401ErrorAdmin(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);
//get_All_Sms_Recharge
export const getSmsRechargeAction = createAsyncThunk(
  "Rates/getSmsRecharge",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_recharge?adminId=${id}`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//get_All_Sms_Withdrawals
export const getSmsWithdrawalsAction = createAsyncThunk(
  "Rates/getSmsWithdrawals",
  async (id, { rejectWithValue }) => {
    try {
      const response = await useGetDataToken(
        `/admin_api/show_withdrawals?adminId=${id}`
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Reset actions
export const resetRatesExcel = createAction("Rates/resetRatesExcel");
export const resetSmsRecharge = createAction("Rates/resetSmsRecharge");
export const resetSmsWithdrawals = createAction("Rates/resetSmsWithdrawals");

const ratesSlice = createSlice({
  name: "rates",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
      state.error = null
    },
  },
  extraReducers: (builder) => {
    //get all ads
    builder.addCase(getAllRatesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllRatesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.rates = action.payload;
      state.success = true;
    });
    builder.addCase(getAllRatesAction.rejected, (state, action) => {
      state.loading = false;
      state.rates = null;
      state.error = action.payload;
    });
    //get Excel
    builder.addCase(getRatesExcelAction.pending, (state) => {
      state.ratesExcel.loading = true;
    });
    builder.addCase(getRatesExcelAction.fulfilled, (state, action) => {
      state.ratesExcel.loading = false;
      state.ratesExcel.excelData = action.payload;
    });
    builder.addCase(getRatesExcelAction.rejected, (state, action) => {
      state.ratesExcel.loading = false;
      state.ratesExcel.excelData = null;
      state.ratesExcel.error = action.payload;
    });
    //get Sms Recharge
    builder.addCase(getSmsRechargeAction.pending, (state) => {
      state.smsRecharge.loadingSms = true;
    });
    builder.addCase(getSmsRechargeAction.fulfilled, (state, action) => {
      state.smsRecharge.loadingSms = false;
      state.smsRecharge.smsRechargeData = action.payload;
    });
    builder.addCase(getSmsRechargeAction.rejected, (state, action) => {
      state.smsRecharge.loadingSms = false;
      state.smsRecharge.smsRechargeData = null;
      state.smsRecharge.errorSms = action.payload;
    });
    //get Sms Withdrawals
    builder.addCase(getSmsWithdrawalsAction.pending, (state) => {
      state.smsWithdrawals.loadingSmsWith = true;
    });
    builder.addCase(getSmsWithdrawalsAction.fulfilled, (state, action) => {
      state.smsWithdrawals.loadingSmsWith = false;
      state.smsWithdrawals.smsWithdrawalsData = action.payload;
    });
    builder.addCase(getSmsWithdrawalsAction.rejected, (state, action) => {
      state.smsWithdrawals.loadingSmsWith = false;
      state.smsWithdrawals.smsWithdrawalsData = null;
      state.smsWithdrawals.errorSmsWith = action.payload;
    });

    builder.addCase(resetRatesExcel, (state) => {
      state.ratesExcel = initialState.ratesExcel;
    });
    builder.addCase(resetSmsRecharge, (state) => {
      state.smsRecharge = initialState.smsRecharge;
    });
    builder.addCase(resetSmsWithdrawals, (state) => {
      state.smsWithdrawals = initialState.smsWithdrawals;
    });
  },
});
export const { resetSuccess } = ratesSlice.actions;
export default ratesSlice.reducer;
