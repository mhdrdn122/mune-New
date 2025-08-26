import baseURL from "../../Api/baseURL";
import baseURLTest from "../../Api/baseURLTest";

const useDeleteData= async(url)=>{
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const config = {
    headers: { Authorization: `Bearer ${adminInfo.token}`}
  } 
  const res = await baseURL.delete(url,config)
  console.log(res)
  return res.data
}
export const useDeleteDataSuperAdmin= async(url)=>{
  const adminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
  const config = {
    headers: { Authorization: `Bearer ${adminInfo.token}`}
  } 
  const res = await baseURLTest.delete(url,config)
  console.log(res)
  return res.data
}

export default useDeleteData;