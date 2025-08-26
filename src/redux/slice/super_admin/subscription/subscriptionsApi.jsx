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

export const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery,
  tagTypes: ["admins", "resturants"],
  endpoints: (builder) => ({
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

export const { useGetSubscriptionsQuery, useAddSubscriptionMutation } =
  subscriptionsApi;
