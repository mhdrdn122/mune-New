import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import baseURLTest from "../Api/baseURLTest";
import { LanguageContext } from "./LanguageProvider";
// import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  
  const { language,setLanguage } = useContext(LanguageContext);

  const [adminDetails, setAdminDetails] = useState([]);
  const [tableId, setTableId] = useState(localStorage.getItem("tableId") || "");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateUsername = (newUsername,takeout=false) => {
    if (newUsername === undefined) {
      return;
    }
    const name = localStorage.getItem("name_url");
    if (name !== newUsername) {
      // localStorage.removeItem("tableId");
      localStorage.removeItem("userToken");
      setTableId("")
    }
    setUsername(newUsername);
  };

  const updateTableId = (id) => {
    setTableId(id);
  };

  useEffect(() => {
    // localStorage.removeItem('language')
    async function getAdminDetails() {
      console.log('we are in the get admin use effect')
      try {
        const config = {
          headers: {
            language: language,
          },
        };
        setLoading(true);
        const response = await baseURLTest.get(
          `/customer_api/show_restaurant_by_name_or_id?restaurant_name=${username}${
            tableId ? `&qr_code=${tableId}` : ""
          }`,
          config
        );
        console.log(response)
        localStorage.setItem('adminInfo',JSON.stringify(response?.data?.data))

        console.log('response of new-menu : ',response)
        if(!localStorage.getItem("language")){
          setLanguage(response?.data?.data?.fav_lang)
        }
        localStorage.setItem('language',response?.data?.data?.fav_lang??'ar')
        setAdminDetails(response.data.data);

        console.log('hello from adminProvider : ',response?.data?.data)
        setLoading(false);
        setError(null);
        // setAdminDetails(response.data.data);
        // setLoading(false);
        // setError(null);
        if (response?.data?.data?.token) {
          localStorage.setItem("userToken", response.data.data.token);
        }
        if (response?.data?.data?.name_url) {
          localStorage.setItem("name_url", response.data.data.name_url);
        }
        document.documentElement.style.setProperty(
          "--background-color",
          `#${response?.data?.data?.background_color?.substring(10, 16)}`
        );
        document.documentElement.style.setProperty(
          "--color",
          `#${response?.data?.data?.color?.substring(10, 16)}`
        );
        document.documentElement.style.setProperty(
          "--color-opacity-50",
          `rgba(${parseInt(response?.data?.data?.color?.substring(10, 12), 16)},
          ${parseInt(response?.data?.data?.color?.substring(12, 14), 16)},
          ${parseInt(response?.data?.data?.color?.substring(14, 16), 16)},0.7)`
        );
        document.documentElement.style.setProperty(
          "--f-color-category",
          `#${response?.data?.data?.f_color_category?.substring(10, 16)}`
        );
        document.documentElement.style.setProperty(
          "--f-color-sub",
          `#${response?.data?.data?.f_color_sub?.substring(10, 16)}`
        );
        document.documentElement.style.setProperty(
          "--f-color-item",
          `#${response?.data?.data?.f_color_item?.substring(10, 16)}`
        );
        document.documentElement.style.setProperty(
          "--fontFamily",
          `${response?.data?.data?.font}`
        );
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error?.response?.data);
        
        setAdminDetails([]);
        // localStorage.removeItem("tableId");
        localStorage.removeItem("userToken");
      }
    }
    // if(username){
    //   getAdminDetails();
    // }
    if (username) {
      setTimeout(()=>{
        getAdminDetails();
      },200)
    }
  }, [username /*, language*/]);
  return (
    <AdminContext.Provider
      value={{ adminDetails, updateUsername, updateTableId, loading, error }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
