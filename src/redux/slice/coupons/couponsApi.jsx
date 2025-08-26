import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
// Function to set up headers dynamically
const prepareHeaders = (headers) => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  
    if (adminInfo && adminInfo.token) {
      headers.set("Authorization", `Bearer ${adminInfo.token}`);
    }
    headers.set("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    return headers;
  };
  
  const baseQuery = fetchBaseQuery({
    baseUrl: baseURLLocalPublic,
    prepareHeaders,
  });

  export const couponsApi = createApi({
    reducerPath: "couponsApi",
    baseQuery,
    tagTypes: ["coupons"],
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: ({ role, page }) => {
              const params = new URLSearchParams({ page });
              if (role) params.append("role", role);
              return `admin_api/show_coupons?${params.toString()}`;
            },
            providesTags: ["coupons"],
          }),
          addNewCoupon: builder.mutation({
            query: (data) => {
              return {
                url: "admin_api/add_coupon",
                method: "POST",
                body: data,
              };
            },
            invalidatesTags: ["coupons"],
          }),
          showOneCoupon: builder.query({
            query: (id) => `admin_api/show_coupon?id=${id}`,
            providesTags: ["coupons"],
          }),
          deleteCoupon: builder.mutation({
            query: (id) => {
              return {
                url: `admin_api/delete_coupon?id=${id}`,
                method: "DELETE",
                body: {},
              };
            },
            invalidatesTags: ["coupons"],
          }),
          deactivateCoupon: builder.mutation({
            query: (id) => {
              return {
                url: `admin_api/deactivate_coupon?id=${id}`,
                method: "POST",
                body: {},
              };
            },
            invalidatesTags: ["coupons"],
          }),
          updateCoupon: builder.mutation({
            query: (data) => {
              return {
                url: `admin_api/update_coupon`,
                method: "POST",
                body: data,
              };
            },
            invalidatesTags: ["coupons"],
          }),
    })
})
export const {
    useGetCouponsQuery,
    useShowOneCouponQuery,
    useAddNewCouponMutation,
    useUpdateCouponMutation,
    useDeactivateCouponMutation,
    useDeleteCouponMutation,
} = couponsApi;