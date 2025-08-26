import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

const prepareHeaders = (headers) => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  
    if (adminInfo && adminInfo.token) {
      headers.set("Authorization", `Bearer ${adminInfo.token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  };
  const baseQuery = fetchBaseQuery({
    baseUrl: baseURLLocalPublic,
    prepareHeaders,
  });

  export const usersInvoicesApi = createApi({
    reducerPath: "usersInvoicesApi",
    baseQuery,
    endpoints: (builder) =>({
    getUsersInvoices: builder.query({
            query: (id) => `admin_api/show_orders_user?id=${id}`,
          providesTags: ["usersInvoices"], 
    })
    })
})
 export const {
    useGetUsersInvoicesQuery,
   } =  usersInvoicesApi;
