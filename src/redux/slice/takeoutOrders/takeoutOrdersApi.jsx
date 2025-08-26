import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

const prepareHeaders = (headers) => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  
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
export const takeoutOrdersApi = createApi({
    reducerPath: "takeoutOrdersApi",
    baseQuery,
    tagTypes: ["takeoutOrders"],
    endpoints: (builder) =>({ 
        getTakeoutOrders: builder.query({
            query: ({ role, page }) => {
                const params = new URLSearchParams({ page });
                if (role) params.append("role", role);
                return `admin_api/show_orders_takeout?${params.toString()}`;
              },
              providesTags: ["takeoutOrders"], 
          }),
    })
    
})
export const {
    useGetTakeoutOrdersQuery
 } =  takeoutOrdersApi  ;  