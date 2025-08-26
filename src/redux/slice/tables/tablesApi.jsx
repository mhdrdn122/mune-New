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

export const tablesApi = createApi({
  reducerPath: "tablesApi",
  baseQuery,
  tagTypes: ["tables"],
  endpoints: (builder) => ({
    getTables: builder.query({
      query: ({ page }) => `show_tables?page=${page}`,
      providesTags: ["tables"],
    }),
    getOrders: builder.query({
      query: ({ page, type, emp_id, table_id, search, date}) => {
        const params = new URLSearchParams({ page });
        if (emp_id) params.append("emp_id", emp_id);
        if (table_id) params.append("table_id", table_id);
        if (type) params.append("type", type);
        if (search) params.append("search", search);
        if (date) params.append("date", date);
        return `show_orders_request?${params.toString()}`;
      },
    }),
    addTable: builder.mutation({
      query: (data) => {
        return {
          url: "add_table",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tables"],
    }),
    updateTable: builder.mutation({
      query: (data) => {
        return {
          url: `update_table`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tables"],
    }),
    deleteTable: builder.mutation({
      query: (id) => {
        return {
          url: `delete_table?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["tables"],
    }),
    requestOrder: builder.mutation({
      query: ({ type, tableId, language }) => {
        return {
          url: `table/${tableId}/update_status?type=${type}`,
          method: "POST",
          body: {},
          headers: {
            language, // تمرير اللغة مباشرة في الرؤوس
          },
        };
      },
    }),
    // إضافة نقطة نهاية جديدة للتعامل مع قبول طلبات الطاولة
    acceptTableRequest: builder.mutation({
      query: (data) => {
        return {
          url: `accept_table_request`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tables"],
    }),
    // إضافة نقطة نهاية جديدة للحصول على تفاصيل الطاولة
    getTableDetails: builder.query({
      query: (id) => `show_table?id=${id}`,
    }),
  }),
});

export const {
  useGetTablesQuery,
  useAddTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useGetOrdersQuery,
  useRequestOrderMutation,
  useAcceptTableRequestMutation,
  useGetTableDetailsQuery,
} = tablesApi;
