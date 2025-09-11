import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocal } from "../../../../Api/baseURLLocal";

// Function to set up headers dynamically
const prepareHeaders = (headers) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));

  if (superAdminInfo && superAdminInfo.token) {
    headers.set("Authorization", `Bearer ${superAdminInfo.token}`);
  }
  headers.set("Accept", "application/json");
  // headers.set("Content-Type", "multipart/form-data");
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocal,
  prepareHeaders,
});

export const resturantsApi = createApi({
  reducerPath: "resturantsApi",
  baseQuery,
  tagTypes: ["resturants"],
  endpoints: (builder) => ({
    getRests: builder.query({
      query: ({ page, cityId, searchWord, managerId }) => {
        const params = new URLSearchParams({ page });
        console.log(searchWord)
        if (typeof cityId !== "undefined") params.append("city_id", cityId);
        if (searchWord && searchWord?.length > 0) params.append("search",searchWord)
        console.log(params.toString())
        if (managerId) params.append("restaurant_manager_id", managerId);
        return `show_restaurants?${params.toString()}&per_page=10`;
      },
      providesTags: ["resturants"],
    }),
    getFonts: builder.query({
      query: ({language}) => `show_fonts?locale=${language}`,
    }),

    addNewRest: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: "add_restaurant",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["resturants"],
    }),

    generateApps: builder.mutation({
      query: (id) => {
        return {
          url: `restaurants/${id}/generate-apps`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["resturants"],
    }),
    deleteRest: builder.mutation({
      query: (id) => {
        return {
          url: `delete_restaurant?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["resturants"],
    }),
    deactivateRest: builder.mutation({
      query: (id) => {
        return {
          url: `deactivate_restaurant?id=${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["resturants"],
    }),
    showOneRest: builder.query({
      query: (id) => `show_restaurant?id=${id}`,
      providesTags: ["resturants"],
    }), 
    updateRest: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: `update_restaurant`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["resturants"],
    }),

    update_super_admin_restaurant_id: builder.mutation({
      query: (id) => {
        return {
          url: `update_super_admin_restaurant_id?id=${id}`,
          method: "POST",
          body: {},
        };
      },
      // invalidatesTags: ["resturants"],
    }),

    getSubscriptions: builder.query({
      query: ({ page, resId }) => `show_restaurant_subscription?id=${resId}`,
      providesTags: ["admins"],
    }),
    addSubscription: builder.mutation({
      query: ({ packId, resId }) => {
        return {
          url: `add_subscription?package_id=${packId}&restaurant_id=${resId}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["admins", "resturants"],
    }),
  }),
});

export const {
  useGetRestsQuery,
  useAddNewRestMutation,
  useDeleteRestMutation,
  useDeactivateRestMutation,
  useShowOneRestQuery,
  useUpdateRestMutation,
  useUpdate_super_admin_restaurant_idMutation,
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useGetFontsQuery,
  useGenerateAppsMutation
} = resturantsApi;
