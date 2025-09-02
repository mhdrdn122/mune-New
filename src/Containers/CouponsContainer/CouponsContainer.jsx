/**
 * CouponsContainer.jsx
 *
 * This file provides a container component for managing coupon CRUD operations.
 * It handles:
 * - Fetching coupon data from the API
 * - Showing modals for adding, editing, deleting, and deactivating coupons
 * - Displaying the coupons in a table with action buttons
 */

import { useEffect, useState } from "react";
import {
  useAddNewCouponMutation,
  useDeactivateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from "../../redux/slice/coupons/couponsApi";
import Pagination from "../../utils/Pagination";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import { ToastContainer } from "react-toastify";
import Table from "../../components/Tables/Tables";
import {
  getCouponFormFields,
  handleDeactive,
  handleDelete,
  onAddCouponSubmit,
  onUdateCouponSubmit,
} from "./helpers";

import DynamicForm from "../../components/Modals/AddModal/AddModal";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";
import CouponCard from "../../components/Admin/Coupons/CouponCard";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
import useGetStyle from "../../hooks/useGetStyle";

/**
 * CouponsContainer
 *
 * Props:
 * - show: boolean — whether the add modal is visible
 * - handleClose: function — function to close the modal
 * - refresh: number — value used to trigger data re-fetch
 * - role: string — used to filter coupons by role
 */
const CouponsContainer = ({ show, handleClose, refresh, role, mode }) => {
  const tableHeader = ["الكود", "الخصم", "من", "إلى", "الحالة", "الحدث"];
  const fieldsToShow = ["code", "percent", "from_date", "to_date", "is_active"];

  const [passedData, setPassedData] = useState();
  const [fields, setFields] = useState();
  const [page, setPage] = useState(1);

  const [addNewCoupon] = useAddNewCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();
  
  const [deactivateCoupon, { isLoading: loadingDeactive }] =
    useDeactivateCouponMutation();

  const {
    data: coupons,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetCouponsQuery({ role, page, refresh });

  const [showEdit, setShowEidt] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);

   /**
   * Handles pagination change
   * @param {number} page - New page number
   */
  const onPress = async (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  // Updates form fields depending on add/edit modal visibility
  useEffect(() => {
    let result;
    if (show) {
      result = getCouponFormFields();
    } else if (showEdit) {
      result = getCouponFormFields();
      delete result[0]; // Usually remove 'code' field for edit mode
    }
    setFields(result);
  }, [show, showEdit]);

  useEffect(() => {} , [refresh])

  // Handlers for showing modals with selected coupon data
  const handleShowEdit = (data) => {
    setShowEidt(true);
    setPassedData(data);
  };

  const handleShowDelete = (data) => {
    setShowDelete(true);
    setPassedData(data);
  };

  const handleShowDeactive = (data) => {
    setShowDeactive(true);
    setPassedData(data);
  };

  const actions = [
    {
      icon: <EditOutlinedIcon />,
      name: "showEdit",
      onClickFunction: handleShowEdit,
    },
    {
      icon: <DeleteIcon />,
      name: "showDelete",
      onClickFunction: handleShowDelete,
    },
    {
      icon: <BlockOutlinedIcon />,
      name: "active",
      onClickFunction: handleShowDeactive,
    },
  ];

  if (loading) {
      return (
        <div className="flex justify-content-center gap-1 my-5 ">
          <DynamicSkeleton
            count={5}
            variant="rounded"
            height={250}
            animation="wave"
            spacing={3}
            columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          />
        </div>
      );
    }

  return (
    <div>
      <div className="w-full flex flex-wrap items-center gap-3 justify-start">
        {coupons &&
          !mode &&
          coupons?.data?.map((coupon, index) => {
            return (
              <CouponCard
                key={index}
                index={index}
                onEdit={handleShowEdit}
                onDelete={handleShowDelete}
                onBlock={handleShowDeactive}
                data={coupon}
              />
            );
          })}
      </div>
      {mode && (
        <Table
          columns={tableHeader}
          fieldsToShow={fieldsToShow}
          data={coupons?.data}
          isFetching={isFetching}
          error={error}
          actions={actions}
        />
      )}

      {/* Add Coupon Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={handleClose}
        onSubmit={async (values) =>
          await onAddCouponSubmit(values, addNewCoupon, handleClose)
        }
        passedData={{}}
        show={show}
        title={"إضافة كوبون"}
      />

      {/* Edit Coupon Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowEidt(false)}
        onSubmit={async (values) =>
          await onUdateCouponSubmit(
            values,
            updateCoupon,
            () => setShowEidt(false),
            passedData?.id
          )
        }
        passedData={passedData}
        show={showEdit}
        title={"تعديل كوبون"}
      />

      {/* Delete Coupon Modal */}
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        loading={isLoading}
        message={"هل أنت متأكد من عملية الحذف"}
        title={"حذف الكوبون"}
        onIgnore={() => setShowDelete(false)}
        onOk={async () =>
          await handleDelete(
            passedData?.id,
            () => setShowDelete(false),
            deleteCoupon
          )
        }
        show={showDelete}
      />

      {/* Activate/Deactivate Coupon Modal */}
      <AttentionModal
        handleClose={() => setShowDeactive(false)}
        loading={loadingDeactive}
        message={
          passedData?.is_active
            ? "هل أنت متأكد من إالفاء التنشيط"
            : "هل أنت متأكد من التنشيط"
        }
        title={passedData?.is_active ? "إالغاء تنشيط الكوبون" : "تنشيط الكوبون"}
        onIgnore={() => setShowDeactive(false)}
        onOk={async () =>
          await handleDeactive(passedData?.id, deactivateCoupon, () =>
            setShowDeactive(false)
          )
        }
        show={showDeactive}
      />

        {/* Pagination Controls */}
      {coupons?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={coupons.meta.total_pages} />
      )}
      <ToastContainer />
    </div>
  );
};

export default CouponsContainer;
