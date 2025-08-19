import { get_All_Categories_and_sub } from "../../../redux/slice/categories/categoriesSlice";
import { useGetTypes } from "../AddEmplyee/utils";

export const getAddEmplyeeFields = async(isSupperAdmin,hasAdmin,types,initialValues) =>{
  const res = await get_All_Categories_and_sub()
  const categories = res?.data?.map((category)=>(category.name))

  let roles;
  if(!isSupperAdmin || hasAdmin){
    roles = ['موظف']
  }else{
    roles = ['موظف','أدمن']
  }
  const typesLabels = types?.data?.map((type)=>(type.name))
  const  addEmployeeFields = [
    { name: "name", label: "الإسم", type: "text", required: true },
    { name: "user_name", label: "اسم المستخدم", type: "text", required: true },
    { name: "password", label: "كلمة السر", type: "password", required: true },
    { name: "mobile", label: "رقم الموبايل", type: "tel", required: true },
    { name:"role",label:"Role",type:"select",options:roles,required:true},
    { name: "category",label:"Category",type:"multiselect",options:categories,isHidden: (values) => values.role === "أدمن"  },
    { name:"type_id",label:"النوع",type:"select",options:typesLabels,required:true,isHidden: (values) => values.role === "أدمن"}

  ];
  return {
    fields:addEmployeeFields,
    initialValues:initialValues
  };
}