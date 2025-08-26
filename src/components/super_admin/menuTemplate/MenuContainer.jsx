import React, { useState } from "react";
import {
  useDeactivateMenuMutation,
  useDeleteMenuMutation,
  useGetMenusQuery,
} from "../../../redux/slice/super_admin/menu/menusApi";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ModalAddMenu from "./ModalAddMenu";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import { usePermissions } from "../../../context/PermissionsContext";
import useError401 from "../../../hooks/useError401 ";
import Table from "../../Tables/Tables";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";

const MenuContainer = ({ show, handleClose , randomNumber}) => {
  const tableHeader = ["الاسم", "الحالة", "الحدث"];
  const fieldsToShow = ["name", "is_active"];
  const [passedData, setPassedData] = useState();
  const [page, setPage] = useState(1)
  const {
    data: menus,
    isError,
    error,
    isLoading: loading,
    isFetching
  } = useGetMenusQuery({page, randomNumber});

  console.log(randomNumber)

  const { triggerRedirect } = useError401(isError, error);

  const [
    deleteMenu,
    { isLoading, isSuccess, isError: isErrDelete, error: errorDel },
  ] = useDeleteMenuMutation();
  const [deactivateMenu, { isLoading: loadingDeactive }] =
    useDeactivateMenuMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);



  const handleShowDeleteModal = (menu) => {
    setPassedData(menu)
    setShowDeleteModal(true);
  };
  const handleShowDeactiveModal = (menue) => {
    setPassedData(menue)
    setShowDeactiveModal(true);
  };
  const handleDelete = async (id) => {
    try {
      const result = await deleteMenu(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        setShowDeleteModal(false)
      } else {
        notify(result.message, "error");
      }
    } catch (e) {
      console.error("Failed:", e);
      if (e?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", e);
        notify(e?.data?.message, "error");
        setShowDeleteModal(false)
      }
    }
  };
  const handleDeactive = async (id) => {
    try {
      const result = await deactivateMenu(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        setShowDeactiveModal(false)
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

  const onPress = async (page) => {
    setPage(page);
  };

  const actions = [
    {
      icon: <DeleteIcon />,
      name: "delete",
      onClickFunction: handleShowDeleteModal,
    },
    {
      icon: <BlockOutlinedIcon />,
      name: "active",
      onClickFunction: handleShowDeactiveModal,
    },
  ];
   return (
    <>
      <Table
        data={menus?.data}
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        error={error}
        isFetching={loading}
      />

      {show && (
        <ModalAddMenu show={show} handleClose={handleClose} />
      )}

      {showDeleteModal && (
        <AttentionModal
          handleClose={() => setShowDeleteModal(false)}
          loading={isLoading}
          message={"هل أنت متاكد من عملية الحذف"}
          onIgnore={() => setShowDeleteModal(false)}
          onOk={() => handleDelete(passedData?.id)}
          show={showDeleteModal}
          title={"حذف القائمة"}
        />
      )}

      {showDeactiveModal && (
        <AttentionModal
          handleClose={() => setShowDeactiveModal(false)}
          loading={loadingDeactive}
          message={
            passedData?.is_active
              ? "هل أنت متاكد من عملية إلغاء التنشيط"
              : "هل أنت متأكد من عملية التنشيط"
          }
          onIgnore={() => setShowDeactiveModal(false)}
          onOk={() => handleDeactive(passedData?.id)}
          show={showDeactiveModal}
          title={
            passedData?.is_active
              ? "إلغاء تنشيط القائمة"
              : "تنشيط القائمة"
          }
        />
      )}

      <ToastContainer />
    </>
  );
};

export default MenuContainer;
