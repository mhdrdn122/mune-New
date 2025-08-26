import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocal } from "../../../../Api/baseURLLocal";
import axios from "axios";

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

export const downloadRatesExcel = async (resId) => {
  try {
    const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
    const headers = {
      Accept: "application/json",
    };

    if (superAdminInfo && superAdminInfo.token) {
      headers.Authorization = `Bearer ${superAdminInfo.token}`;
    }

    const response = await axios({
      url: `${baseURLLocal}/excel?restaurant_id=${resId}`,
      method: "GET",
      responseType: "blob", // important for file download
      headers,
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", `Rates.xlsx`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error downloading the Excel file:", error);
  }
};

// Utility function to build query parameters
const buildQueryParams = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
};

export const ratesRestApi = createApi({
  reducerPath: "ratesRestApi",
  baseQuery,
  tagTypes: ["rates"],
  endpoints: (builder) => ({
    getRatesRest: builder.query({
      query: ({
        page,
        resId,
        fromDate,
        toDate,
        type,
        from_age,
        to_age,
        rate,
        gender,
      }) => {
        const queryParams = buildQueryParams({
          restaurant_id: resId,
          page,
          from_date: fromDate,
          to_date: toDate,
          type,
          from_age,
          to_age,
          rate,
          gender,
        });
        return `show_rates?${queryParams}`;
      },
      providesTags: ["rates"],
    }),
    getRatesRestExcel: builder.query({
      query: ({ page, resId }) => `excel`,
      // providesTags: ["rates"],
    }),
  }),
});

export const { useGetRatesRestQuery, useGetRatesRestExcelQuery } = ratesRestApi;


// getRatesRest: builder.query({
//   query: ({
//     page,
//     resId,
//     fromDate,
//     toDate,
//     type,
//     from_age,
//     to_age,
//     rate,
//     gender,
//   }) =>
//     `show_rates?restaurant_id=${resId}&page=${page}&from_date=${fromDate}&to_date=${toDate}&type=${type}${
//       from_age ? `&from_age=${from_age}` : ""
//     }${to_age ? `&to_age=${to_age}` : ""} ${
//       rate !== 0 ? `&rate=${rate}` : ""
//     }${gender ? `&gender=${gender}` : ""}`,
//   providesTags: ["rates"],
// }),