import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../slice/categories/categoriesSlice";
import counterReducer from "../slice/counter/counterSlice";
import authReducer from "../slice/auth/authSlice";
import subCategoriesReducer from "../slice/subCategories/subCategoriesSlice";
import itemsReducer from "../slice/items/itemsSlice";
import adsReducer from "../slice/ads/adsSlice";
import ratesReducer from "../slice/rates/ratesSlice";
import restsManagerReducer from '../slice/restsManager/ratesManagerSlice'
import superAdminAuthReducer from "../slice/super_admin/auth/authSlice";
import cityReducerSuper from "../slice/super_admin/city/citySlice";
import emojiReducerSuper from "../slice/super_admin/emoji/emojiSlice";
import { menusApi } from "../slice/super_admin/menu/menusApi";
import { resturantsApi } from "../slice/super_admin/resturant/resturantsApi";
import { ratesRestApi } from "../slice/super_admin/ratesRest/ratesRestApi";
import { superAdminsApi } from "../slice/super_admin/super_admins/superAdminsApi";
import { newsApi } from "../slice/news/newsApi";
import { tablesApi } from "../slice/tables/tablesApi";
import { servicesApi } from "../slice/service/serviceApi";
import { resAdminsApi } from "../slice/super_admin/resAdmins/resAdminsApi";
import { packagesApi } from "../slice/super_admin/packages/packagesApi";
import { subscriptionsApi } from "../slice/super_admin/subscription/subscriptionsApi";
import { orderApi } from "../slice/order/orderApi";
import { adminsApi } from "../slice/admins/adminsApi";
import { subCatsApi } from "../slice/user section/subCatsApi";
import { itemsApi } from "../slice/user section/itemsApi";
import { restManagerApi } from "../slice/super_admin/restManagers/restManagerApi";
import ordersReducer from '../slice/user section/ordersSlice'
import { usersApi } from "../slice/users/usersApi";
import { deliveriesApi } from "../slice/deliveries/deliveriesApi";
import { usersInvoicesApi } from "../slice/usersInvoices/usersInvoicesApi";
import { deliveriesInvoicesApi } from "../slice/deliveriesInvoices/deliveriesInvoices";
import { takeoutOrdersApi } from "../slice/takeoutOrders/takeoutOrdersApi";
import { couponsApi } from "../slice/coupons/couponsApi";


//store
const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    subCategories: subCategoriesReducer,
    items: itemsReducer,
    ads: adsReducer,
    rates: ratesReducer,
    counter: counterReducer,
    restsManager: restsManagerReducer,
    // suepr admin
    authSuper: superAdminAuthReducer,
    citySuper: cityReducerSuper,
    emojiSuper: emojiReducerSuper,
    // customer
    orders: ordersReducer,
    [menusApi.reducerPath]: menusApi.reducer,
    [resturantsApi.reducerPath]: resturantsApi.reducer,
    [ratesRestApi.reducerPath]: ratesRestApi.reducer,
    [superAdminsApi.reducerPath]: superAdminsApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [tablesApi.reducerPath]: tablesApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [resAdminsApi.reducerPath]: resAdminsApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [couponsApi.reducerPath]:couponsApi.reducer,
    [usersApi.reducerPath]:usersApi.reducer,
    [deliveriesApi.reducerPath]:deliveriesApi.reducer,
    [usersInvoicesApi.reducerPath]:usersInvoicesApi.reducer,
    [deliveriesInvoicesApi.reducerPath]:deliveriesInvoicesApi.reducer,
    [subCatsApi.reducerPath]: subCatsApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [restManagerApi.reducerPath]: restManagerApi.reducer,
    [takeoutOrdersApi.reducerPath]:takeoutOrdersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      menusApi.middleware,
      resturantsApi.middleware,
      ratesRestApi.middleware,
      superAdminsApi.middleware,
      newsApi.middleware,
      tablesApi.middleware,
      servicesApi.middleware,
      resAdminsApi.middleware,
      packagesApi.middleware,
      subscriptionsApi.middleware,
      orderApi.middleware,
      adminsApi.middleware,
      couponsApi.middleware,
      usersApi.middleware,
      deliveriesApi.middleware,      
      usersInvoicesApi.middleware,
      deliveriesInvoicesApi.middleware,
      takeoutOrdersApi.middleware,
      subCatsApi.middleware,
      itemsApi.middleware,
      restManagerApi.middleware,
    ),
});

export default store;