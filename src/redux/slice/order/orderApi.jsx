import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalAdmin } from "../../../Api/baseURLLocal";

// دالة لإعداد الرؤوس بشكل ديناميكي
const prepareHeaders = (headers) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (adminInfo && adminInfo.token) {
    headers.set("Authorization", `Bearer ${adminInfo.token}`);
  }
  headers.set("Accept", "application/json");
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocalAdmin,
  prepareHeaders,
});

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["orders", "invoices"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({
        page,
        tableId,
        invoiceId,
        status,
        searchWord,
        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams({ page });
        if (tableId) params.append("table_id", tableId);
        if (invoiceId) params.append("invoice_id", invoiceId);
        if (status) params.append("status", status);
        if (searchWord) params.append("search", searchWord);
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        return `show_orders?${params.toString()}`;
      },
      providesTags: ["orders"],
    }),
    addOrder: builder.mutation({
      query: (data) => {
        return {
          url: "add_order",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["orders"],
    }),
    updateOrder: builder.mutation({
      query: (data) => {
        console.log(data);
        return {
          url: `update_order`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => {
        return {
          url: `delete_order?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["orders"],
    }),
    //************************************ */
    getInvoices: builder.query({
      query: ({ page, date, selectedTableId, selectedWaiterId }) => {
        const params = new URLSearchParams({ page });
        if (date) params.append("date", date);
        if (selectedTableId) params.append("table_id", selectedTableId);
        if (selectedWaiterId) params.append("admin_id", selectedWaiterId);

        return `show_invoices?${params.toString()}`;
      },
      providesTags: ["invoices"],
    }),
    getOneInvoices: builder.query({
      query: ({ id }) => {
        return `show_orders_invoice?id=${id}`;
      },
    }),
    addInvoice: builder.mutation({
      query: (data) => {
        return {
          url: "add_invoice_to_table",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["invoices"],
    }),

    addCouponToInvoice: builder.mutation({
      query: (data) => {
        return {
          url: "add_coupon_to_invoice",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["invoices"],
    }),
    updateInvoice: builder.mutation({
      query: (id) => {
        return {
          url: `update_status_invoice_paid?id=${id}`,
          method: "PATCH",
          body: {},
        };
      },
      invalidatesTags: ["invoices"],
    }),
    // إضافة نقطة نهاية جديدة للحصول على تفاصيل الفاتورة مع الضرائب
    getInvoiceDetails: builder.query({
      query: (id) => `show_invoice_details?id=${id}`,
    }),
    // إضافة نقطة نهاية جديدة لإنشاء فاتورة للطاولة
    createTableInvoice: builder.mutation({
      query: (data) => {
        return {
          url: "create_table_invoice",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["invoices", "orders"],
    }),
    // إضافة نقطة نهاية جديدة للحصول على إحصائيات الطلبات
    getOrderStatistics: builder.query({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        return `order_statistics?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useAddInvoiceMutation,
  useAddCouponToInvoiceMutation,
  useUpdateInvoiceMutation,
  useGetOneInvoicesQuery,
  useGetInvoiceDetailsQuery,
  useCreateTableInvoiceMutation,
  useGetOrderStatisticsQuery,
} = orderApi;
