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

export const resAdminsApi = createApi({
  reducerPath: "resAdminsApi",
  baseQuery,
  tagTypes: ["admins","pers", "roles"],
  endpoints: (builder) => ({
    getRestAdmins: builder.query({
      query: ({ page, resId }) =>
        `show_admins_restaurant?restaurant_id=${resId}&page=${page}`,
      providesTags: ["admins"],
    }),
    addRestAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "add_admin_to_restaurant",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
    updateRestAdmin: builder.mutation({
      query: (data) => {
        return {
          url: `update_admin_restaurant`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
    deleteRestAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `delete_admin_restaurant?admin_id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    deactivateRestAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `active_admin_restaurant?admin_id=${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    getSuperRoles: builder.query({
      query: () => `roles?type=admin`,
      providesTags: ["roles"],
    }),
    getSuperTypes: builder.query({
      query: () => `types`,
    }),
    // showOneRest: builder.query({
    //   query: (id) =>
    //     `show_restaurant?id=${id}`,
    //   providesTags: ["admins"],
    // }),
  }),
});

export const {
  useAddRestAdminMutation,
  useGetRestAdminsQuery,
  useGetSuperRolesQuery,
  useGetSuperTypesQuery,
  useUpdateRestAdminMutation,
  useDeleteRestAdminMutation,
  useDeactivateRestAdminMutation,
} = resAdminsApi;
