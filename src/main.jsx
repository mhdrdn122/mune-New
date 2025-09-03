import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/store.jsx";
import AdminProvider from "./context/AdminProvider.jsx";
import LanguageProvider from "./context/LanguageProvider.jsx";
import CategoriesProvider from "./context/CategoriesProvider.jsx";
import AdvertismentsProvidr from "./context/AdvertismentsProvider.jsx";
import "./fonts.css";
import { PermissionsProvider } from "./context/PermissionsContext.jsx";
import UserProvider from "./context/UserProvider.jsx";
import { WebSocketProvider } from "./context/WebSocketProvider.jsx";
import "leaflet/dist/leaflet.css";
import ShowSidebarProvider from "./context/ShowSidebarProvider.jsx";
import { FCMProvider } from "./context/FCMProvider.jsx";
// Service Worker Registration

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
      .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
          console.error("Service Worker registration failed:", error);
      });
}


// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('Service Worker registered with scope:', registration.scope);
//     })
//     .catch((err) => {
//       console.log('Service Worker registration failed:', err);
//     });
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <WebSocketProvider>
        <FCMProvider>

        <LanguageProvider>
          <AdminProvider>
            <CategoriesProvider>
              <AdvertismentsProvidr>
                <PermissionsProvider>
                  <UserProvider>
                    <ShowSidebarProvider>
                      <App />
                    </ShowSidebarProvider>
                  </UserProvider>
                </PermissionsProvider>
              </AdvertismentsProvidr>
            </CategoriesProvider>
          </AdminProvider>
        </LanguageProvider>
        </FCMProvider>
      </WebSocketProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
