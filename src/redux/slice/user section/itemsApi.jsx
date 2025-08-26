import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

const prepareHeaders = (headers, { getState }) => {
  const language = getState().language; // Access language from query parameters

  if (language) {
    headers.set("language", language);
  }
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocalPublic,
  prepareHeaders,
});

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({ catId, word, page, language }) => ({
        url: `/customer_api/show_items?category_id=${catId}&search=${word}&page=${page}`,
        headers: {
          language, // Pass the language directly in the headers
        },
      }),
    }),
  }),
});


export const { useGetItemsQuery } = itemsApi;
