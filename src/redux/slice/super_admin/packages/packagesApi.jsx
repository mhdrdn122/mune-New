import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocal } from "../../../../Api/baseURLLocal";


// Function to set up headers dynamically
const prepareHeaders = (headers) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));

  if (superAdminInfo && superAdminInfo.token) {
    headers.set('Authorization', `Bearer ${superAdminInfo.token}`);
  }
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocal,
  prepareHeaders,
});

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery,
  tagTypes: ['packages'],
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: (page) =>
        `show_packages?page=${page}`,
      providesTags: ['packages']
    }),
    addNewPackage: builder.mutation({
      query: (data) => {
        return {
          url: "add_package",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ['packages']
    }),
    updatePackage: builder.mutation({
      query: (data) => {
        return {
          url: "update_package",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ['packages']
    }),
    deletePackage: builder.mutation({
      query: (id) => {
        return {
          url: `delete_package?id=${id}`,
          method: 'DELETE',
          body: {}
        };
      },
      invalidatesTags: ['packages']
    }),
    deactivatePackage: builder.mutation({
      query: (id) => {
        return {
          url: `active_package?id=${id}`,
          method: 'POST',
          body: {}
        };
      },
      invalidatesTags: ['packages']
    }),
  }),
});

export const { useGetPackagesQuery, useAddNewPackageMutation, useUpdatePackageMutation, useDeletePackageMutation, useDeactivatePackageMutation} = packagesApi;
