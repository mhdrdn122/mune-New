import axios from "axios";

// تحديث عنوان API للتوافق مع الباك إند الجديد
const baseURL = axios.create({baseURL:"https://tmenuback.addresses.sy"})  // الإصدار الجديد

// النسخ القديمة (محفوظة للرجوع إليها عند الحاجة)
// const baseURL = axios.create({baseURL:"https://medical-clinic.serv00.net"})
// const baseURL = axios.create({baseURL:"https://medical-clinic.serv00.net/"}) //test server

// front-end Domain : https://menu-new-f.medical-clinic.serv00.net/admin/login

///////-----------------------------------------------------------////////////////////

// export const baseURLPublicName ="http://192.168.1.40:3030" //local

// تحديث عنوان API العام
export const baseURLPublicName ="https://tmenuback.addresses.sy" // الإصدار الجديد

// export const baseURLPublicName ="https://medical-clinic.serv00.net" // server test 

export default baseURL;
