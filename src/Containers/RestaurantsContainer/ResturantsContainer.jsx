import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useDeactivateRestMutation,
  useDeleteRestMutation,
  useGetRestsQuery,
  useUpdate_super_admin_restaurant_idMutation,
} from "../../redux/slice/super_admin/resturant/resturantsApi";
import { TiStarFullOutline } from "react-icons/ti";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddAlarmOutlinedIcon from "@mui/icons-material/AddAlarmOutlined";
import useError401 from "../../hooks/useError401 ";
import Pagination from "../../utils/Pagination";
import { IoQrCodeOutline } from "react-icons/io5";
import Table from "../../components/Tables/Tables";
import { handleDeactive, handleDelete, handleShowRestaurant } from "./helpers";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";

const ResturantsContainer = ({ searchWord, setSearchWord, randomNumber }) => {
  const tableHeader = ["اسم المطعم","تاريخ الانتهاء","الحالة","الحدث"]
  const fieldsToShow = ["name","end_date","is_active"]
  const [passedData,setPassedData] = useState()
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cityId, managerId } = useParams();
  const [debouncedSearch, setDebouncedSearch] = useState(undefined);
  const [page, setPage] = useState(1);
  const {
    data: rests,
    isError,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetRestsQuery({
    page,
    cityId,
    searchWord: debouncedSearch,
    managerId,
    randomNumber
  });
  const [deleteRest, { isLoading }] = useDeleteRestMutation();
  const [update_super_admin_restaurant_id, { isLoading: isLoadingUpdate }] = useUpdate_super_admin_restaurant_idMutation();
  const [deactivateRest, { isLoading: loadingDeactive }] =
    useDeactivateRestMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const handleShowDelete = (rest) => {
    setPassedData(rest)
    setShowDeleteModal(true)
  };
  const handleShowDeactive = (rest) => {
    setPassedData(rest)
    setShowDeactiveModal(true);
  };
  const { triggerRedirect } = useError401(isError, error);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
      setPage(1);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);


  const onPress = async (page) => {
    setPage(page);
  };

  const actions =[
    {
      icon:<FaEye/>,
      name:'view',
      onClickFunction:(rest)=>handleShowRestaurant(rest,update_super_admin_restaurant_id,triggerRedirect,navigate)
    },
    {
      icon:<EditOutlinedIcon/>,
      name:'edit',
      onClickFunction:(rest)=>navigate(`/super_admin/resturants/${rest.id}/edit`)
    },
    {
      icon:<DeleteIcon/>,
      name:'delete',
      onClickFunction:handleShowDelete
    },
    {
      icon:<BlockOutlinedIcon/>,
      name:'active',
      onClickFunction:handleShowDeactive
    },
    {
      icon:<TiStarFullOutline/>,
      name:'rates',
      onClickFunction:(rest) => {
        localStorage.setItem("prevUrl", pathname)
        navigate(`/super_admin/city/${rest.city_id}/resturants/${rest && rest.id}/rates`)
      }
    },
    {
      icon:<SupervisorAccountIcon/>,
      name:'employees',
      onClickFunction:(rest)=>{
        localStorage.setItem("prevUrl", pathname)
        navigate(`/super_admin/city/${rest.city_id}/resturants/${rest && rest.id}/admins`)
      }
    },
    {
      icon:<AddAlarmOutlinedIcon/>,
      name:'subscribtion',
      onClickFunction:(rest)=>{
        localStorage.setItem("prevUrl", pathname)
        navigate(`/super_admin/city/${rest.city_id}/resturants/${rest && rest.id}/subscriptions`)
      }
    },
    {
      icon:<IoQrCodeOutline/>,
      name:'QR',
      onClickFunction:(rest)=>navigate(`/super_admin/resturants/${rest.id}/qrInfo`)
    },
  ]
  return(
    <>
      <Table
        actions={actions}
        columns={tableHeader}
        data={rests?.data}
        error={error}
        fieldsToShow={fieldsToShow}
        isFetching={isFetching}
      />
      {rests?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={rests?.meta?.total_pages} />
      )}
      {
        showDeleteModal &&
        <AttentionModal
          handleClose={()=>setShowDeleteModal(false)}
          loading={isLoading}
          message={"هل أنت متأكد من عملية الحذف؟"}
          onIgnore={()=>setShowDeleteModal(false)}
          onOk={async()=>await handleDelete(passedData?.id,deleteRest,()=>setShowDeleteModal(false),triggerRedirect)}
          show={showDeleteModal}
          title={"حذف المطعم"}
        />
      }
      { 
        showDeactiveModal &&
        <AttentionModal
          handleClose={()=>setShowDeactiveModal(false)}
          loading={loadingDeactive}
          message={passedData?.is_active ? "هل أنت متأكد من تعطيل المطعم":"هل أنت متـكد من تنشيط المطعم"}
          onIgnore={()=>setShowDeactiveModal(false)}
          onOk={async()=>await handleDeactive(passedData?.id,deactivateRest,()=>setShowDeactiveModal(false),triggerRedirect)}
          show={showDeactiveModal}
          title={passedData?.is_active?"تعطيل المطعم":"تنشيط المطعم "}
        />
      }
    </>
  )
};
export default ResturantsContainer;