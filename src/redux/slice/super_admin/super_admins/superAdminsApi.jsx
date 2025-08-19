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

export const superAdminsApi = createApi({
  reducerPath: "superAdminsApi",
  baseQuery,
  tagTypes: ["admins"],
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: ({role, page}) =>
        `show_admins?page=${page}${role !== "all" ? `&role=${role}`: "" } `,
      providesTags: ["admins"],
    }),
    getPermissons: builder.query({
      query: () =>
        `permissions?role=superAdmin `,
      // providesTags: ["admins"],
    }),
    getRoles: builder.query({
      query: () => `roles `,
      // providesTags: ["admins"],
    }),
    addNewAdmin: builder.mutation({
      query: (data) => {
        // const formData = new FormData();
        // Object.entries(data).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });
        return {
          url: "add_admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
    showOneAdmin: builder.query({
      query: (id) =>
        `show_admin?id=${id}`,
      providesTags: ["admins"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `delete_admin?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    deactivateAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `active_admin?id=${id}`,
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
    updateAdmin: builder.mutation({
      query: (data) => {
        return {
          url: `update_admin`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    })
  }),
});

export const {
  useGetAdminsQuery,
  useAddNewAdminMutation,
  useGetPermissonsQuery,
  useShowOneAdminQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useDeactivateAdminMutation,
  useGetRolesQuery
} = superAdminsApi;
