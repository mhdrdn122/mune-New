import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

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
export const deliveriesApi = createApi({
  reducerPath: "deliveriesApi",
  baseQuery,
  endpoints: (builder) => ({
    // tagTypes: ["deliveries","pers", "roles"],
    getDeliveries: builder.query({
      query: ({ role, page }) => {
        const params = new URLSearchParams();
        if (role) params.append("role", role);
        if (role) params.append("page", page);

        return `admin_api/show_deliveries?${params.toString()}`;
      },
      providesTags: ["deliveries"],
    }),
    showOneDelivery: builder.query({
      query: (id) => `admin_api/show_delivery?id=${id}`,
      providesTags: ["deliveries"],
    }),
    addNewDelivery: builder.mutation({
      query: (data) => {
        return {
          url: "admin_api/add_delivery",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["deliveries", "pers", 'roles'],
    }),
    deleteDelivery: builder.mutation({
      query: (id) => {
        return {
          url: `admin_api/delete_delivery?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["deliveries", "pers", 'roles'],
    }),
    updateDelivery: builder.mutation({
      query: (data) => {
        return {
          url: `admin_api/update_delivery`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["deliveries"],
    }),
    deactivateDelivery: builder.mutation({
      query: (id) => {
        return {
          url: `admin_api/active_delivery?id=${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["deliveries"],
    }),
  })

})

export const {
  useGetDeliveriesQuery,
  useShowOneDeliveryQuery,
  useDeleteDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeactivateDeliveryMutation,
  useAddNewDeliveryMutation,
} = deliveriesApi