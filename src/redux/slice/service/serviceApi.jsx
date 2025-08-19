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

  export const servicesApi = createApi({
    reducerPath: "servicesApi",
    baseQuery,
    tagTypes: ["services"],
    endpoints: (builder) => ({
        getServices: builder.query({
          query: ({ page }) => `show_services?page=${page}`,
          providesTags: ["services"],
        }),
        addService: builder.mutation({
            query: (data) => {
              return {
                url: "add_service",
                method: "POST",
                body: data,
              };
            },
            invalidatesTags: ["services"],
          }),
          updateService: builder.mutation({
            query: (data) => {
              return {
                url: `update_service`,
                method: "POST",
                body: data,
              };
            },
            invalidatesTags: ["services"],
          }),
          deleteService: builder.mutation({
            query: (id) => {
              return {
                url: `delete_service?id=${id}`,
                method: "DELETE",
                body: {},
              };
            },
            invalidatesTags: ["services"],
          }),
          // إضافة نقطة نهاية جديدة للحصول على تفاصيل خدمة معينة
          getServiceDetails: builder.query({
            query: (id) => `show_service?id=${id}`,
          }),
          // إضافة نقطة نهاية جديدة لتفعيل/تعطيل الخدمة
          toggleServiceStatus: builder.mutation({
            query: (data) => {
              return {
                url: `toggle_service_status`,
                method: "POST",
                body: data,
              };
            },
            invalidatesTags: ["services"],
          }),
          // إضافة نقطة نهاية جديدة للبحث عن الخدمات
          searchServices: builder.query({
            query: ({ page, searchTerm }) => {
              const params = new URLSearchParams({ page });
              if (searchTerm) params.append("search", searchTerm);
              return `search_services?${params.toString()}`;
            },
            providesTags: ["services"],
          }),
    })
  })

  export const {
    useGetServicesQuery,
    useAddServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    useGetServiceDetailsQuery,
    useToggleServiceStatusMutation,
    useSearchServicesQuery
  } = servicesApi;
