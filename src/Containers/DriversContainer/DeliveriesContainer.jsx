// This container manages the deliveries (drivers) table with pagination, CRUD actions, and modals.

import { useEffect, useState } from "react";
import Pagination from "../../utils/Pagination";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ShowDeliveriesModal from "../../components/Admin/deliveries/ShowDeliveriesModal";
import {
  useAddNewDeliveryMutation,
  useDeactivateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetDeliveriesQuery,
  useUpdateDeliveryMutation,
} from "../../redux/slice/deliveries/deliveriesApi";
import { ToastContainer } from "react-toastify";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Tables/Tables";
import {
  getDriverFormFields,
  handleDelete,
  handleAddDriverSubmit,
  handleDeactive,
  handleUpdateDriverSubmit,
} from "../../components/Admin/deliveries/helpers";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";
import useError401Admin from "../../hooks/useError401Admin";
import DynamicCard from "../../utils/DynamicCard";
import { PermissionsEnum } from "../../constant/permissions";
import { FaEdit } from "react-icons/fa";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";

const DeliveriesContainer = ({ role, refresh, show, handleClose, mode }) => {
  // Table columns and fields
  const tableHeader = [
    "الاسم",
    "اسم الحساب",
    "رقم الموبايل ",
    "عيد الميلاد",
    "الحالة",
    "الحدث",
  ];
  const fieldsToShow = ["name", "username", "phone", "birthday", "is_active"];
  const [fields, setFields] = useState();

  // Form-related mutations
  const [addNewDelivery, { isLoading: isLoadingAdd, error: errorAdd }] =
    useAddNewDeliveryMutation();
  const [updateDelivery, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateDeliveryMutation();
  const [deleteDelivery, { isLoading: loadingDelete }] =
    useDeleteDeliveryMutation();
  const [deactivateDelivery, { isLoading: loadingDeactive }] =
    useDeactivateDeliveryMutation();

  // On component mount: set form fields
  useEffect(() => {
    const result = getDriverFormFields();
    setFields(result);
  }, []);

  // State management
  const [page, setPage] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);
  const [passedData, setPassedData] = useState();
  const [showDriver, setShowDriver] = useState(false);

  // Navigation and error handling
  const navigate = useNavigate();
  const { triggerRedirect } = useError401Admin();

  // Fetch drivers list
  const {
    data: users,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetDeliveriesQuery({ role, page, refresh });

  // Handle pagination click
  const onPress = (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  // Action handlers
  const handleShowDriver = (driver) => {
    setPassedData(driver);
    setShowDriver(true);
  };

  const handleShowEdit = (driver) => {
    setPassedData(driver);
    setShowEdit(true);
  };

  const handleShowDelete = (driver) => {
    setPassedData(driver);
    setShowDelete(true);
  };
  const handleShowInvoices = (driver) => {
    navigate(`${passedData?.id}/invoices`)
  };

  const handleShowDeactive = (driver) => {
    setPassedData(driver);
    setShowDeactive(true);
  };

  // Actions list passed to Table
  const actions = [
    {
      icon: <FaEye />,
      name: "view",
      onClickFunction: handleShowDriver,
    },
    {
      icon: <LiaFileInvoiceSolid />,
      name: "showInvoices",
      handleShowInvoices,
    },
    {
      icon: <EditOutlinedIcon />,
      name: "editdriver",
      onClickFunction: handleShowEdit,
    },
    {
      icon: <DeleteIcon />,
      name: "deleteDriver",
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
            columns={{ xs: 12, sm: 6, md: 6, lg: 4 }}
          />
        </div>
      );
    }
  return (
    <>
      <div className="w-full flex flex-wrap items-center gap-3 justify-center">
        {users &&
          !mode &&
          users?.data?.map((user, index) => {
            return (
              <DynamicCard
                key={user.id}
                data={user}
                showImage={true}
                showActionTitle={true}
                titleKey={`السائق  ${index + 1}`}
                imageKey={"image"}
                fields={[
                  { key: "name", label: "الاسم" },
                  { key: "username", label: "اسم الحساب" },
                  { key: "phone", label: "رقم الموبايل" },
                  { key: "birthday", label: "تاريخ البدء" },
                  {
                    key: "is_active",
                    label: "الحالة",
                    format: (value) => (value == 1 ? "نشط" : "غير نشط"),
                  },
                ]}
                actions={[
                  {
                    name: "view",
                    icon: <FaEye fontSize="large" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "invoices",
                    icon: <LiaFileInvoiceSolid fontSize="large" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "edit",
                    icon: <FaEdit fontSize="large" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "delete",
                    icon: <DeleteIcon fontSize="small" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "active",
                    icon: <BlockOutlinedIcon fontSize="small" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                ]}
                onAction={(action, userData) => {
                  switch (action) {
                    case "view":
                      handleShowDriver(userData);
                      break;
                    case "invoices":
                      handleShowInvoices();
                      break;
                    case "edit":
                      handleShowEdit(userData);
                      break;
                    case "delete":
                      handleShowDelete(userData);
                      break;
                    case "active":
                      handleShowDeactive(userData);
                      break;
                    default:
                      break;
                  }
                }}
              />
            );
          })}
      </div>

      {/* Main Table */}
      {users?.data && mode && (
        <Table
          actions={actions}
          columns={tableHeader}
          fieldsToShow={fieldsToShow}
          data={users?.data}
          isFetching={isFetching}
          error={error}
        />
      )}

      {/* Pagination */}
      {users?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={users?.meta?.total_pages} />
      )}

      {/* Add Driver Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={handleClose}
        onSubmit={async (values) =>
          await handleAddDriverSubmit(
            values,
            addNewDelivery,
            triggerRedirect,
            errorAdd
          )
        }
        passedData={{}}
        show={show}
        title={"إضافة سائق جديد"}
      />

      {/* Delete Confirmation Modal */}
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        loading={loadingDelete}
        message={"هل أنت متأكد من القيام بهذه العملية"}
        title={"حذف السائق"}
        onIgnore={() => setShowDelete(false)}
        onOk={async () =>
          await handleDelete(
            passedData?.id,
            deleteDelivery,
            () => setShowDelete(false),
            triggerRedirect
          )
        }
      />

      {/* Deactivate/Activate Confirmation Modal */}
      <AttentionModal
        handleClose={() => setShowDeactive(false)}
        show={showDeactive}
        loading={loadingDeactive}
        message={
          passedData?.is_active
            ? "هل أنت متأكد من إلغاء التنشيط"
            : "هل أنت متأكد من التنشيط"
        }
        title={passedData?.is_active ? "إلغاء التنشيط" : "تنشيط"}
        onIgnore={() => setShowDeactive(false)}
        onOk={async () =>
          await handleDeactive(
            passedData?.id,
            deactivateDelivery,
            () => setShowDeactive(false),
            triggerRedirect
          )
        }
      />

      {/* Show Driver Info Modal */}
      <ShowDeliveriesModal
        show={showDriver}
        id={passedData?.id}
        handleClose={() => setShowDriver(false)}
      />

      {/* Edit Driver Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowEdit(false)}
        onSubmit={async (values) =>
          await handleUpdateDriverSubmit(
            values,
            passedData?.id,
            updateDelivery,
            () => setShowEdit(false),
            triggerRedirect
          )
        }
        passedData={passedData}
        show={showEdit}
        title={"تعديل السائق"}
      />

      <ToastContainer />
    </>
  );
};

export default DeliveriesContainer;
