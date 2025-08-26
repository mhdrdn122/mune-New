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

export const restManagerApi = createApi({
  reducerPath: "restManagerApi",
  baseQuery,
  tagTypes: ["admins"],
  endpoints: (builder) => ({
    getRestManagers: builder.query({
      query: ({ page, perpage }) => {
        let url = `restaurant_managers?page=${page}`;
        if (perpage) {
          url += `&per_page=${perpage}`;
        }
        return url;
      },
      providesTags: ["admins"],
    }),
    addRestManager: builder.mutation({
      query: (data) => {
        return {
          url: "restaurant_manager",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
    updateRestManager: builder.mutation({
      query: (data) => {
        return {
          url: `update_restaurant_manager`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
    deleteRestManager: builder.mutation({
      query: (id) => {
        return {
          url: `delete_restaurant_manager?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    deactivateRestManager: builder.mutation({
      query: (id) => {
        return {
          url: `active_restaurant_manager?id=${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    // showOneRest: builder.query({
    //   query: (id) =>
    //     `show_restaurant?id=${id}`,
    //   providesTags: ["admins"],
    // }),
  }),
});

export const {
  useGetRestManagersQuery,
  useAddRestManagerMutation,
  useUpdateRestManagerMutation,
  useDeactivateRestManagerMutation,
  useDeleteRestManagerMutation,
} = restManagerApi;
