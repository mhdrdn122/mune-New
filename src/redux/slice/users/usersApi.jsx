import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

// دالة لإعداد الرؤوس بشكل ديناميكي
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

  export const usersApi = createApi({
  
    reducerPath: "usersApi",
    baseQuery,
    tagTypes: ["users"],
    endpoints: (builder) =>({
    getUsers: builder.query({
      query: ({ role, page }) => {
          const params = new URLSearchParams({ page });
          if (role) params.append("role", role);
          return `admin_api/show_users_takeout?${params.toString()}`;
        },
        providesTags: ["users"], 
    }),
    showOneUser: builder.query({
        query: (id) => `admin_api/show_user_takeout?id=${id}`,
        providesTags: ["users"],
      }),
    deleteUser: builder.mutation({
        query: (id) => {
          return {
            url: `admin_api/delete_user_takeout?id=${id}`,
            method: "DELETE",
            body: {},
          };
        },
        invalidatesTags: ["users", "pers", 'roles'],
      }),
      updateUser: builder.mutation({
        query: (data) => {
          return {
            url: `admin_api/update_user_takeout`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: ["users"],
      }),
      deactivateUser: builder.mutation({
        query: (id) => {
          return {
            url: `admin_api/active_user_takeout?id=${id}`,
            method: "POST",
            body: {},
          };
        },
        invalidatesTags: ["users"],
      }),
      // إضافة نقطة نهاية جديدة لإنشاء مستخدم جديد
      createUser: builder.mutation({
        query: (data) => {
          return {
            url: `admin_api/create_user_takeout`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: ["users"],
      }),
      // إضافة نقطة نهاية جديدة للبحث عن المستخدمين
      searchUsers: builder.query({
        query: ({ page, searchTerm }) => {
          const params = new URLSearchParams({ page });
          if (searchTerm) params.append("search", searchTerm);
          return `admin_api/search_users_takeout?${params.toString()}`;
        },
        providesTags: ["users"],
      }),
      // إضافة نقطة نهاية جديدة لإعادة تعيين كلمة المرور
      resetUserPassword: builder.mutation({
        query: (data) => {
          return {
            url: `admin_api/reset_user_password`,
            method: "POST",
            body: data,
          };
        },
      }),
      // إضافة نقطة نهاية جديدة للحصول على إحصائيات المستخدمين
      getUserStatistics: builder.query({
        query: () => `admin_api/user_statistics`,
      }),
    })
  })

  export const {
    useGetUsersQuery,
    useShowOneUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useDeactivateUserMutation,
    useCreateUserMutation,
    useSearchUsersQuery,
    useResetUserPasswordMutation,
    useGetUserStatisticsQuery
 } =  usersApi;
