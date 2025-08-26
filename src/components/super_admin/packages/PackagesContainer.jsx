import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import {
  useDeactivatePackageMutation,
  useDeletePackageMutation,
  useGetPackagesQuery,
} from "../../../redux/slice/super_admin/packages/packagesApi";
import AddPackage from "./AddPackage";
import EditPackage from "./EditPackage";
import { usePermissions } from "../../../context/PermissionsContext";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useError401 from "../../../hooks/useError401 ";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";
import Table from "../../Tables/Tables";

const PackagesContainer = ({ show, handleClose, randomNumber }) => {
  const tableHeader = ["الاسم", "الحالة", "الحدث"];
  const fieldsToShow = ["title", "is_active"];
  const [passedData,setPassedData] = useState();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1)
  const navigate = useNavigate();
  const {
    data: packages,
    isError,
    error,
    isLoading: loading,
    isFetching
  } = useGetPackagesQuery({page, randomNumber});

  const { triggerRedirect } = useError401(isError, error);

  const [
    deletePackage,
    { isLoading, isSuccess, isError: isErrDelete, error: errorDel },
  ] = useDeletePackageMutation();
  const [deactivatePackage, { isLoading: loadingDeactive }] =
    useDeactivatePackageMutation();
  const [showEdit, setShowEidt] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  
  const handleShowEdit = (pack) => {
    setPassedData(pack)
    setShowEidt(true);
  };
  const handleShowDeleteModal = (pack) => {
    setPassedData(pack)
    setShowDeleteModal(true);
  };
  const handleShowDeactiveModal = (pack) => {
    setPassedData(pack)
    setShowDeactiveModal(true);
  };
  const handleDelete = async (id) => {
    try {
      const result = await deletePackage(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        setShowDeleteModal(false);
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
  };
  const handleDeactive = async (id) => {
    try {
      const result = await deactivatePackage(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        setShowDeactiveModal(false);
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
  };
  const actions = [
    (hasPermission(SuperPermissionsEnum.PACKAGE_UPDATE)
      &&{ icon: <EditOutlinedIcon />, name: "edit", onClickFunction: handleShowEdit }
      ),
    (hasPermission(SuperPermissionsEnum.PACKAGE_DELETE)
      &&{ icon: <DeleteIcon />, name: "delete", onClickFunction: handleShowDeleteModal }
      ),
    (hasPermission(SuperPermissionsEnum.PACKAGE_ACTIVE)
      &&{
          icon: <BlockOutlinedIcon /> ,
          name: "active",
          onClickFunction: handleShowDeactiveModal,
        }
      ),
  ];
  return (
    <>
      <Table
        data={packages?.data}
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        error={error}
        isFetching={isFetching}
      />

      <AddPackage show={show} handleClose={handleClose} />
      <EditPackage show={showEdit} pack={passedData} handleClose={() => setShowEidt(false)} />

      <AttentionModal
        show={showDeleteModal}
        title="حذف الباقة"
        message="هل أنت متاكد من عملية الحذف؟"
        loading={isLoading}
        handleClose={() => setShowDeleteModal(false)}
        onOk={()=>handleDelete(passedData?.id)}
        onIgnore={() => setShowDeleteModal(false)}
      />

      <AttentionModal
        show={showDeactiveModal}
        title={passedData?.is_active ? "إلغاء تنشيط الباقة" : "تنشيط الباقة"}
        message={
          passedData?.is_active
            ? "هل أنت متأكد من إلغاء تنشيط هذه الباقة؟"
            : "هل أنت متأكد من تنشيط هذه الباقة؟"
        }
        loading={loadingDeactive}
        handleClose={() => setShowDeactiveModal(false)}
        onOk={()=>handleDeactive(passedData?.id)}
        onIgnore={() => setShowDeactiveModal(false)}
      />

      <ToastContainer />
    </>
  );
 
};

export default PackagesContainer;
