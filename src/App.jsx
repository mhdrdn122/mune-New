import { Route, Routes, useParams, useLocation } from "react-router-dom";
import { lazy, Suspense, useContext, useEffect, useState } from "react";

import LayoutsAdmin from "./Layouts/LayoutsAdmin";
import LoginPage from "./pages/Admin/Auth/LoginPage";
import { Counter } from "./components/Admin/tesst";
import CategoriesPage from "./pages/Admin/categories/HomePage";
import SubCategoriesPage from "./pages/Admin/subCategories/SubCategoriesPage";
import ItemsPage from "./pages/Admin/items/ItemsPage";
import AdsPage from "./pages/Admin/ads/AdsPage";
import ProfilePage from "./pages/Admin/profile/ProfilePage";
import RatesPage from "./pages/Admin/rates/RatesPage";
import Ratings from "./components/user/template1/Ratings";
import WelcomePage from "./utils/WelcomePage";
import PageNotFound from "./utils/404Page";
import AdminPrivateRoutes from "./utils/AdminPrivateRoutes";
import Login from "./pages/super_admin/auth/Login";
import AllAdminsPage from "./pages/super_admin/admins/AllAdminsPage";
import LayoutSuperAdmin from "./Layouts/LayoutSuperAdmin";
import SuperAdminPrivateRoutes from "./utils/super_admin/SuperAdminPrivateRoutes";
import CitiesPage from "./pages/super_admin/cities/CitiesPage";
import ResturantsPage from "./pages/super_admin/Resturants/ResturantsPage";
import AddRest from "./components/super_admin/resturants/AddRest";
import EmojisPage from "./pages/super_admin/emojis/EmojisPage";
import { AdminContext } from "./context/AdminProvider";
import MenuTemplatePage from "./pages/super_admin/menuTemplate/MenuTemplatePage";
import RatesRestPage from "./pages/super_admin/ratesRestjsx/RatesRestPage";
import ProfileSuperAdminPage from "./pages/super_admin/profile/ProfileSuperAdminPage";
import TablesPage from "./pages/Admin/tables/TablesPage";
import NewsPage from "./pages/Admin/news/NewsPage";
import TestReorder from "./pages/test/TestReorder";
import UpdateRestPage from "./components/super_admin/resturants/UpdateRestPage";
import ResAdminsPage from "./pages/super_admin/resAdmins/ResAdminsPage";
import PackagesPage from "./pages/super_admin/packages/PackagesPage";
import ResSubscriptionsPage from "./pages/super_admin/Subscriptions/ResSubscriptionsPage";
import OrdersPage from "./pages/Admin/orders/OrdersPage";
import AdminsPage from "./pages/Admin/admins/AdminsPage";
import MyOrdersPage from "./pages/user/MyOrdersPage";
import ProtectedRoute from "./utils/ProtectedRoute";
// import ResAdminsPage from "./pages/super_admin/resAdmins/ResAdminsPage";
import {
  FirstHomePage,
  HomePage,
  List,
  Categories,
  SubCatTemp2,
  Items,
  Home3,
  SubCategories,
  Temp3Items,
  Home4,
  SubCatTemp4,
  Temp4Items,
  CategoriesTemp5,
  SubCategoriesTemp5,
  Temp5Items,
  HomeTemp6,
  CategoriesTemp6,
  SubCategoriesTemp6,
  ItemsTemp6,
} from "./LazyLoadedComponents";
import ResturantPage from "./pages/Admin/resturant/ResturantPage";
import { PermissionsEnum, SuperPermissionsEnum } from "./constant/permissions";
import RestManagersPage from "./pages/super_admin/restManagers/RestManagersPage";
import RestsManager from "./pages/Admin/RestsManager/RestsManager";
import InviocesPage from "./pages/Admin/invioces/InviocesPage";
import RequestsPage from "./pages/Admin/requests/RequestsPage";
import QrInformation from "./components/super_admin/resturants/QrInformation";
import Charts from "./pages/Admin/charts/Charts";
import AddOrder from "./pages/Admin/addOrder/AddOrder";
import Inventory from "./pages/Admin/Inventory/Inventory";
import ServicePage from "./pages/Admin/service/ServicePage";
// import Notifications from "./components/Notifications";
// import { requestPermission , onMessageListener, requestFCMToken } from "./firebase";
import toast, { Toaster } from "react-hot-toast";
import UsersPage from "./pages/users/UsersPage";
import DeliveriesPage from "./pages/Admin/deliveries/DeliveriesPage";
import UserInvoices from "./components/Admin/users/invoices/UserInvoices";
import DeliveriesInvoices from "./components/Admin/deliveries/invoices/DeliveriesInvoices";
import CategoriesTemp7 from "./components/user/template7/CategoriesTemp7";
import SubCategoriesTemp7 from "./components/user/template7/SubCategoriesTemp5";
import Temp7Items from "./components/user/template7/Temp7Items";
import TakeoutOrdersPage from "./pages/Admin/takeout_orders/TakeoutOrdersPage";
import LoginTakeOutPage from "./pages/Admin/Auth/LoginTakeOutPage";
import TakeOutSupervisor from "./pages/Admin/takeOut_supervisor/TakeOutSupervisor";
import UserProfile from "./utils/user/UserProfile";
import CouponPage from "./pages/Admin/coupons/CouponPage";
import RegisterPage from "./utils/user/RegisterPage";
import CategoriesTemp9 from "./components/user/template9/CategoriesTemp9";
import SubCategoriesTemp9 from "./components/user/template9/SubCategoriesTemp9";
import Temp9Items from "./components/user/template9/Temp9Items";
// import CategoriesTemp10 from "./components/user/template10/CategoriesTemp10";
import CombinedSubcategoryItems10 from "./components/user/template10/CombinedSubcategoryItems10";
import Home from "./components/user/template11/Home";
import AIDesignCustomizer from "./components/Admin/AIDesign/AIDesignCustomizer";
import PaymentGatewayIntegration from "./components/Admin/Payment/PaymentGatewayIntegration";
import CreateAccountForm from "./LoginForm";
import UserOrders from "./utils/user/UserOrders";
import HomeTemp10 from "./components/user/template10/HomeTemp10";
import DriverTracking from "./pages/Admin/deliveries/DriverTracking";
function App() {
  const { adminDetails, updateUsername, loading } = useContext(AdminContext);
  console.log(adminDetails);

  const { username } = useParams();
  const { pathname } = useLocation();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, [username]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Routes>
        {/* <Route index element={<LoginPage />} /> */}
        {/* Admin Routes */}
        <Route element={<AdminPrivateRoutes />}>
          <Route path="/admin/rests" element={<RestsManager />} />

          <Route path="/admin" element={<LayoutsAdmin />}>
            <Route
              path="/admin/ai"
              element={<AIDesignCustomizer restaurantId={1520} />}
            />
            <Route
              path="/admin/pay"
              element={<PaymentGatewayIntegration restaurantId={1520} />}
            />
            <Route
              index
              element={
                <ProtectedRoute permission={PermissionsEnum.CATEGORY_INDEX}>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="category/:id"
              element={
                <ProtectedRoute permission={PermissionsEnum.CATEGORY_INDEX}>
                  <SubCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="category/:id/subCategory/:subId"
              element={
                <ProtectedRoute permission={PermissionsEnum.ITEM_INDEX}>
                  <ItemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="ads"
              element={
                <ProtectedRoute
                  permission={PermissionsEnum.ADVERTISEMENT_INDEX}
                >
                  <AdsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="admins"
              element={
                <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                  <AdminsPage />
                </ProtectedRoute>
              }
            />
            <Route path="restaurant_details" element={<ResturantPage />} />
            <Route path="tables">
              <Route
                index
                element={
                  <ProtectedRoute permission={PermissionsEnum.TABLE_INDEX}>
                    <TablesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":tableId/orders"
                element={
                  <ProtectedRoute permission={PermissionsEnum.ORDER_INDEX}>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="profile" element={<ProfilePage />} />

            <Route
              path="rates"
              element={
                <ProtectedRoute permission={PermissionsEnum.RATE_INDEX}>
                  <RatesPage />
                </ProtectedRoute>
              }
            />

            <Route path="invoices">
              <Route
                index
                element={
                  <ProtectedRoute permission={PermissionsEnum.ORDER_INDEX}>
                    <InviocesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":invoiceId/orders"
                element={
                  <ProtectedRoute permission={PermissionsEnum.ORDER_INDEX}>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="news"
              element={
                <ProtectedRoute permission={PermissionsEnum.NEWS_INDEX}>
                  <NewsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="coupon"
              element={
                // <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                <CouponPage />
                // </ProtectedRoute>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":userId/invoices"
                element={
                  <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                    <UserInvoices />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="deliveries">
              <Route
                index
                element={
                  <ProtectedRoute permission={PermissionsEnum.DELIVERY_INDEX}>
                    <DeliveriesPage />
                  </ProtectedRoute>
                }
              />

              

              <Route
                path=":deliveryId/invoices"
                element={
                  <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                    <DeliveriesInvoices />
                  </ProtectedRoute>
                }
              />
            </Route>
             <Route
                path="driver-tracking"
                element={
                  <ProtectedRoute permission={PermissionsEnum.DELIVERY_INDEX}>
                    <DriverTracking />
                  </ProtectedRoute>
                }
              />

            <Route
              path="takeoutOrders"
              element={
                <ProtectedRoute permission={PermissionsEnum.ORDER_INDEX}>
                  <TakeoutOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="requests"
              element={
                <ProtectedRoute permission={PermissionsEnum.USER_INDEX}>
                  <RequestsPage />
                </ProtectedRoute>
              }
            />
            <Route path="testReorder" element={<TestReorder />} />

            <Route path="charts" element={<Charts />} />

            <Route path="inventory" element={<Inventory />} />

            <Route
              path="service"
              permission={PermissionsEnum.SERVICE_INDEX}
              element={<ServicePage />}
            />

            <Route path="addOrder" element={<AddOrder />} />
            <Route path="addOrder/:id" element={<AddOrder />} />

          </Route>
        </Route>

        {/* <Route path="/admin/test" element={<Counter />} /> */}

        {/* <Route path="/super_admin/login" element={<Login />} /> */}
        <Route
          path="/super_admin/login"
          element={<RegisterPage mode="super_admin" />}
        />
        <Route
          path="/:username/rating"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Ratings />
            </Suspense>
          }
        />
        <Route path="/:username/orders" element={<MyOrdersPage />} />

        {adminDetails.menu_template_id === 6 ? (
          <Route
            path="/:username/:table_id?"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomeTemp6 />
              </Suspense>
            }
          />
        ) : (
          <Route
            path="/:username/:table_id?"
            element={
              <Suspense fallback={<div>Loading.8..</div>}>
                <FirstHomePage />
              </Suspense>
            }
          />
        )}
        <Route
          path="/:username/takeout/register"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterPage mode="user" />
            </Suspense>
          }
        />
        <Route
          path="/:username/takeout"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <FirstHomePage />
            </Suspense>
          }
        />
        <Route
          path="/:username/profile"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UserProfile />
            </Suspense>
          }
        />
        <Route
          path="/:username/my-orders"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UserOrders />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/1/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/1/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <List />
            </Suspense>
          }
        />

        <Route
          path="/:username/template/2/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Categories />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/2/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCatTemp2 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/2/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Items />
            </Suspense>
          }
        />

        <Route
          path="/:username/template/3/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home3 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/3/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCategories />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/3/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Temp3Items />
            </Suspense>
          }
        />

        <Route
          path="/:username/template/4/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home4 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/4/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCatTemp4 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/4/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Temp4Items />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/5/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CategoriesTemp5 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/5/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCategoriesTemp5 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/5/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Temp5Items />
            </Suspense>
          }
        />
        {
          <Route
            path="/:username/home"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomeTemp6 />
              </Suspense>
            }
          />
        }

        <Route
          path="/:username/template/6/categories"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CategoriesTemp6 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/6/categories/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCategoriesTemp6 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/6/categories/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ItemsTemp6 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/7/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CategoriesTemp7 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/7/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCategoriesTemp7 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/7/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Temp7Items />
            </Suspense>
          }
        />

        {/* -------- 32 ------ */}
        <Route
          path="/:username/template/8/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CategoriesTemp9 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/32/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SubCategoriesTemp9 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/32/category/:id/sub-category/:id2"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Temp9Items />
            </Suspense>
          }
        />
        {/* -------- 10 ------ */}
        <Route
          path="/:username/template/10/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomeTemp10 />
            </Suspense>
          }
        />
        <Route
          path="/:username/template/10/category/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CombinedSubcategoryItems10 />
            </Suspense>
          }
        />
        {/*-------34-------*/}
        <Route
          path="/:username/template/35/home"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          }
        />

        {/*   -----------------------------  */}
        {/* {<Route path="/admin/login" element={<LoginPage />} />} */}
        {<Route path="/admin/login" element={<RegisterPage mode="admin" />} />}

        {<Route path="/admin/logintakeout" element={<LoginTakeOutPage />} />}
        {
          <Route
            path="/admin/takeoutsupervisor"
            element={<TakeOutSupervisor />}
          />
        }

        {/* Super Admin Routes */}
        <Route element={<SuperAdminPrivateRoutes />}>
          <Route path="/super_admin" element={<LayoutSuperAdmin />}>
            <Route
              index
              element={
                <ProtectedRoute permission={SuperPermissionsEnum.CITY_INDEX}>
                  <CitiesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="city/:cityId/resturants"
              element={
                <ProtectedRoute
                  permission={SuperPermissionsEnum.RESTAURANT_INDEX}
                >
                  <ResturantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="city/:cityId/resturants/:resId/rates"
              element={
                <ProtectedRoute permission={SuperPermissionsEnum.RATE_INDEX}>
                  <RatesRestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resturants/add"
              element={
                <ProtectedRoute
                  permission={SuperPermissionsEnum.RESTAURANT_ADD}
                >
                  <AddRest />
                </ProtectedRoute>
              }
            />
            <Route
              path="resturants/:id/edit"
              element={
                <ProtectedRoute
                  permission={SuperPermissionsEnum.RESTAURANT_UPDATE}
                >
                  <UpdateRestPage />
                </ProtectedRoute>
              }
            />
            <Route path="resturants/:id/qrInfo" element={<QrInformation />} />
            <Route
              path="city/:cityId/resturants/:resId/admins"
              element={
                <ProtectedRoute
                  permission={SuperPermissionsEnum.ADMIN_RESTAURANT_INDEX}
                >
                  <ResAdminsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="city/:cityId/resturants/:resId/subscriptions"
              element={
                <ProtectedRoute
                  permission={
                    SuperPermissionsEnum.PACKAGE_SHOW_RESTAURANT_SUBSCRIPTION
                  }
                >
                  <ResSubscriptionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="admins"
              element={
                <ProtectedRoute
                  permission={SuperPermissionsEnum.SUPER_ADMIN_INDEX}
                >
                  <AllAdminsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="restaurants_managers"
              element={
                // <ProtectedRoute
                //   permission={SuperPermissionsEnum.RESTAURANT_MANAGER_INDEX}
                // >
                <RestManagersPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="restaurants_managers/:managerId/restaurants"
              element={
                // <ProtectedRoute
                //   permission={SuperPermissionsEnum.RESTAURANT_MANAGER_INDEX}
                // >
                // <ManagerRestaurantsPage />
                <ResturantsPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="emojis"
              element={
                <ProtectedRoute permission={SuperPermissionsEnum.EMOJI_INDEX}>
                  <EmojisPage />
                </ProtectedRoute>
              }
            />

            <Route path="profile" element={<ProfileSuperAdminPage />} />

            <Route
              path="menu_template"
              element={
                <ProtectedRoute permission={SuperPermissionsEnum.MENU_INDEX}>
                  <MenuTemplatePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="packages"
              element={
                <ProtectedRoute permission={SuperPermissionsEnum.PACKAGE_INDEX}>
                  <PackagesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
        <Route path="/test" element={<CreateAccountForm />} />
      </Routes>
      {/* <Notifications/> */}
    </div>
  );
}

export default App;
