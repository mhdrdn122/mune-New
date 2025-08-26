import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

// Function to set up headers dynamically
const prepareHeaders = (headers) => {
  console.log('we are preperanig headers');
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  console.log('admin info',adminInfo)
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

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery,
  tagTypes: ["admins","pers", "roles"],
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: ({ type_id, page, startDate, endDate }) => {
        const params = new URLSearchParams({ page });
        if (type_id) params.append("type_id", type_id);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `admin_api/show_users?${params.toString()}`;
      },
      providesTags: ["admins"],
    }),
    getPermissons: builder.query({
      query: () => `superAdmin_api/permissions?role=admin `,
      providesTags: ["pers"],
    }),
    getRoles: builder.query({
      query: () => `admin_api/roles `,
      providesTags: ["roles"],
    }),
    getTypes: builder.query({
      query: () => `admin_api/types `,
      // providesTags: ["admins"],
    }),
    addNewAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "admin_api/add_user",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins", "pers", 'roles'],
    }),
    showOneAdmin: builder.query({
      query: (id) => `admin_api/show_user?id=${id}`,
      providesTags: ["admins"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `admin_api/delete_user?id=${id}`,
          method: "DELETE",
          body: {},
        };
      },
      invalidatesTags: ["admins", "pers", 'roles'],
    }),
    deactivateAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `admin_api/active_user?id=${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["admins"],
    }),
    updateAdmin: builder.mutation({
      query: (data) => {
        return {
          url: `admin_api/update_user`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admins"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetPermissonsQuery,
  useAddNewAdminMutation,
  useUpdateAdminMutation,
  useGetRolesQuery,
  useShowOneAdminQuery,
  useDeleteAdminMutation,
  useDeactivateAdminMutation,
  useGetTypesQuery
} = adminsApi;
