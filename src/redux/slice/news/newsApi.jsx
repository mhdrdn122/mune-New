import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalAdmin } from "../../../Api/baseURLLocal";

// Function to set up headers dynamically
const prepareHeaders = (headers) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (adminInfo && adminInfo.token) {
    headers.set("Authorization", `Bearer ${adminInfo.token}`);
  }
  headers.set("Accept", "application/json");
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocalAdmin,
  prepareHeaders,
});

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery,
  tagTypes: ["news"],
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({page}) => `show_news?page=${page}&per_page=10`,
      providesTags: ["news"],
    }),
    addNews: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: "add_news",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["news"],
    }),
    updateNews: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: `update_news`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["news"],
    }),
    deleteNews: builder.mutation({
      query: (id) => {
        return {
          url: `delete_news?id=${id}`,
          method: 'DELETE',
          body: {}
        };
      },
      invalidatesTags: ['news']
    }),
  }),
});

export const { useGetNewsQuery, useAddNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } = newsApi;
