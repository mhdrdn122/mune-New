import { useContext } from "react";
import baseURL from "../../Api/baseURL";
import baseURLTest from "../../Api/baseURLTest";
import { UserContext } from "../../context/UserProvider";

const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
// const { userToken,setUserToken } = useContext(UserContext);


const useInsertDataWithImage = async (url, params) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${adminInfo && adminInfo.token}`,
    },
  };
  const res = await baseURL.post(url, params, config);
  return res;
};

const useInsertData = async (url, params) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const config = {
    headers: {
      Authorization: `Bearer ${adminInfo && adminInfo.token}`,
      // platform: window.navigator.userAgentData.platform
    },
  };
  const res = await baseURL.post(url, params, config);
  console.log(res);
  return res;
};

const useInsertDataSuperAdmin = async (url, params) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  const config = {
    headers: {
      Authorization: `Bearer ${superAdminInfo && superAdminInfo.token}`,
      // platform: window.navigator.userAgentData.platform
    },
  };
  const res = await baseURLTest.post(url, params, config);
  console.log(res);
  return res;
};

const useInsertDataWithImageSueprAdmin = async (url, params) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${superAdminInfo && superAdminInfo.token}`,
    },
  };
  const res = await baseURLTest.post(url, params, config);
  return res;
};

const useInsertDataUser = async (url, params ,userToken) => {
  const userInfo = localStorage.getItem("userToken") ;
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const res = await baseURL.post(url, params, config);
  // console.log(res);
  return res;
};

export {
  useInsertData,
  useInsertDataWithImage,
  useInsertDataSuperAdmin,
  useInsertDataWithImageSueprAdmin,
  useInsertDataUser
};
