import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useInsertDataUser } from "../../../hooks/Admin/useInsertData";
import { useGetDataUser } from "../../../hooks/Admin/useGetData";
import notify from "../../../utils/useNotification";


function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  // Ensure both arrays have the same elements (order doesn't matter)
  return a.every(val => b.includes(val)) && b.every(val => a.includes(val));
}

const initialState = {
  orders: [],
  sendOrders: {
    loading: false,
    error: null,
    data: null,
  },
  ordersInvoice: {
    loading: false,
    error: null,
    data: null,
    showInvoice: false
  },
  error: null,
  loading: false,
  success: false,

};

// Send Orders
export const sendOrdersAction = createAsyncThunk(
  "orders/sendOrders",
  async ({data,userToken,address_id,longitude,latitude,isDelivery,delivery_price,code, friend_address}, { rejectWithValue }) => {
    try {
      // const response = await useInsertDataUser(`/customer_api/add_order`, data, userToken);
      const response = await useInsertDataUser(`/customer_api/add_order`, 
        { data,address_id,longitude,latitude ,isDelivery,delivery_price,code,friend_address}, userToken);

      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

//Get Orders Invoice
export const getOrdersInvoice = createAsyncThunk(
  "orders/getOrdersInvoice",
  async ({userToken}, { rejectWithValue }) => {
    console.log("getOrdersInvoice called with userToken:", userToken);
    try {
      const response = await useGetDataUser(
        `/customer_api/show_orders_invoice`,
        userToken
      );
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error);
      if (error.code === "ERR_NETWORK") {
        notify(error.message, "warn");
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      console.log('action inside addOrder : ',action?.payload)
      const incoming = action.payload;
      const res = state.orders?.some(item =>
                    item.id === incoming.id &&
                    item.sizes === incoming.sizes &&
                    arraysEqual(item.components, incoming.components) &&
                    arraysEqual(item.toppings, incoming.toppings)
                  );
      console.log(res)
      if (res) {
        const newItem = state.orders.map((item) => {
          if (
            item.id === incoming.id &&
            item.sizes === incoming.sizes &&
            arraysEqual(item.components, incoming.components) &&
            arraysEqual(item.toppings, incoming.toppings)
          ) {
            return { ...item, count: item.count + incoming.count };
          } else return item;
        });
        console.log('state after add order : ',state.orders)
        // const newItem = [...item, count: item.count + 1]
        state.orders = newItem;
      } else {
        state.orders = [...state.orders, action.payload];
      }
    },
    deleteOrder: (state, action) => {
      const incoming = action.payload
      const res = state.orders.filter((item) => 
        item.id === incoming.id 
      );
      state.orders = res;
    },
    deleteCount: (state, action) => {
      const updatedOrders = state.orders.reduce((acc, item) => {
        const incoming = action?.payload
        if (
          item.id === incoming.id &&
          item.sizes === incoming.sizes &&
          arraysEqual(item.components, incoming.components) &&
          arraysEqual(item.toppings, incoming.toppings)
        ) {
          // If the count is greater than 1, decrement the count
          if (item.count > 1) {
            acc.push({ ...item, count: item.count - 1 });
          }
          // If the count is 1, do not add the item to the new array (removes it)
        } else {
          // Add all other items unchanged
          acc.push(item);
        }
        return acc;
      }, []);
      
      state.orders = updatedOrders;
    },
    
    resetSendOrdersState: (state) => {
      state.sendOrders = initialState.sendOrders;
    },
    resetOrdersState: (state) => {
      state.orders = initialState.orders;
    },
    resetOrdersInvoiceState: (state) => {
      state.ordersInvoice = initialState.ordersInvoice;
    },
  },
  extraReducers: (builder) => {
    //Get Orders Invoice
    builder.addCase(getOrdersInvoice.pending, (state) => {
      state.ordersInvoice.loading = true;
    });
    builder.addCase(getOrdersInvoice.fulfilled, (state, action) => {
      state.ordersInvoice.loading = false;
      state.ordersInvoice.data = action.payload;
      state.ordersInvoice.error = null;
    });
    builder.addCase(getOrdersInvoice.rejected, (state, action) => {
      state.ordersInvoice.loading = false;
      state.ordersInvoice.data = null;
      state.ordersInvoice.error = action.payload;
    });
    // Send Orders
    builder.addCase(sendOrdersAction.pending, (state) => {
      state.sendOrders.loading = true;
    });
    builder.addCase(sendOrdersAction.fulfilled, (state, action) => {
      state.sendOrders.loading = false;
      state.sendOrders.data = action.payload;
      state.sendOrders.error = null;
      state.ordersInvoice.showInvoice = true;
    });
    builder.addCase(sendOrdersAction.rejected, (state, action) => {
      state.sendOrders.loading = false;
      state.sendOrders.data = null;
      state.sendOrders.error = action.payload;
    });
  },
});

export const {
  addOrder,
  deleteOrder,
  deleteCount,
  resetSendOrdersState,
  resetOrdersState,
  resetOrdersInvoiceState
} = ordersSlice.actions;
export default ordersSlice.reducer;
