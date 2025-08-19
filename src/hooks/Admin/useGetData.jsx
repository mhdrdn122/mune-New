import baseURL from "../../Api/baseURL";
import baseURLTest from "../../Api/baseURLTest";

const useGetData = async (url, params) => {
  const res = await baseURL.get(url, params);
  return res.data;
};

const useGetDataToken = async (url, params) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  // console.log(adminInfo.token);
  const config = {
    headers: {
      Authorization: `Bearer ${
        (adminInfo && adminInfo.token) ||
        (superAdminInfo && superAdminInfo.token)
      }`,
      language: "ar",
    },
  };
  const res = await baseURL.get(url, config);
  // console.log(res)
  return res.data;
};

const useGetDataExcel = async (url, params) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const config = {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${adminInfo && adminInfo.token}`,
      language: "ar",
    },
  };
  const res = await baseURLTest.get(url, config);
  return res.data;
};

const useGetDataTokenSuperAdmin = async (url, params) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  // console.log(adminInfo.token);
  const config = {
    headers: {
      Authorization: `Bearer ${superAdminInfo.token}`,
      language: "ar",
    },
  };
  const res = await baseURLTest.get(url, config);
  // console.log(res)
  return res.data;
};

const useGetDataSuperAdminBackup = async (url, params) => {
  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  const config = {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${superAdminInfo.token}`,
      language: "ar",
    },
    // responseType: "arraybuffer" // Important for handling binary data
  };
  const res = await baseURLTest.get(url, config);
  // console.log(res)
  return res.data;
};

const useGetDataUser = async (url,userToken) => {
  // const userToken = localStorage.getItem("userToken");
  // console.log(adminInfo.token);
  console.log("useGetDataUser called with url:", url, "userToken:", userToken);

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const res = await baseURLTest.get(url, config);
  // console.log(res)
  return res.data;
};

export {
  useGetData,
  useGetDataToken,
  useGetDataTokenSuperAdmin,
  useGetDataSuperAdminBackup,
  useGetDataExcel,
  useGetDataUser
};
