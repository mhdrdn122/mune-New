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

export const menusApi = createApi({
  reducerPath: "menusApi",
  baseQuery,
  tagTypes: ['Menus'],
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: (page) =>
        `show_menu_forms?page=${page}`,
      providesTags: ['Menus']
    }),
    addNewMenu: builder.mutation({
      query: (data) => {
        return {
          url: "add_menu_form",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ['Menus']
    }),
    deleteMenu: builder.mutation({
      query: (id) => {
        return {
          url: `delete_menu_form?id=${id}`,
          method: 'DELETE',
          body: {}
        };
      },
      invalidatesTags: ['Menus']
    }),
    deactivateMenu: builder.mutation({
      query: (id) => {
        return {
          url: `deactivate_menu_form?id=${id}`,
          method: 'POST',
          body: {}
        };
      },
      invalidatesTags: ['Menus']
    }),
  }),
});

export const {useGetMenusQuery, useAddNewMenuMutation, useDeleteMenuMutation, useDeactivateMenuMutation} = menusApi;
