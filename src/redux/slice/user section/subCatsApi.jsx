import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

const prepareHeaders = (headers) => {
  const language = localStorage.getItem("language");

  if (language) {
    headers.set("language", language);
  }
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseURLLocalPublic,
  prepareHeaders,
});

export const subCatsApi = createApi({
  reducerPath: "subCatsApi",
  baseQuery,
  endpoints: (builder) => ({
    getSubCats: builder.query({
      query: ({ resId, catId, word, page ,language}) =>
        // `/customer_api/show_restaurant_categories?restaurant_id=${resId}&category_id=${catId}&search=${word}&page=${page}`,
      ({
        url: `/customer_api/show_restaurant_categories?restaurant_id=${resId}&category_id=${catId}&search=${word}&page=${page}`,
        headers: {
          language, // Attach the language header here
        },
      }),
    }),
  }),
});

export const { useGetSubCatsQuery } = subCatsApi;
