import { useParams } from "react-router-dom";
import { useGetRestsQuery } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import Page from "../../EmployeesPage";



const ResAdminsPage = () => {

  const { cityId, resId } = useParams();
  const {
    data: rests
  } = useGetRestsQuery({ page: 1, cityId, searchWord: ""  });
  const res2 = rests?.data.find((item)=> item.id === parseInt(resId))

  const breadcrumbs = [
    {
      label: "الرئيسية",
      to: "/super_admin",
    },
    {
      label: res2?.translations?.ar?.name || "...",
      to: localStorage.getItem('prevUrl'),
    },
    {
      label: "المشرفين",
    },
  ].reverse();
  return <Page isSuperAdmin={true} breadCrumbs={breadcrumbs}/>
};

export default ResAdminsPage;
