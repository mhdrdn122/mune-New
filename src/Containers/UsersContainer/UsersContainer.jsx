import { useState } from "react";
import {
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../redux/slice/users/usersApi";
import Pagination from "../../utils/Pagination";
import { FaEye } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ShowUserModal from "../../components/Admin/users/ShowUserModal";
import { ToastContainer } from "react-toastify";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Tables/Tables";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";
import {
  handleDeactive,
  handleDelete,
} from "../../components/Admin/users/helpers";
import useError401Admin from "../../hooks/useError401Admin";
import DynamicCard from "../../utils/DynamicCard";
import { PermissionsEnum } from "../../constant/permissions";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
const UsersContainer = ({ refresh, role, mode }) => {
  const tableHeader = [
    "الاسم",
    "اسم الحساب",
    "رقم الموبايل",
    "عيد الميلاد",
    "العنوان",
    "الحالة",
    "الحدث",
  ];
  const fieldsToShow = [
    "name",
    "username",
    "phone",
    "birthday",
    "address",
    "is_active",
  ];
  const [page, setPage] = useState(1);

  const [showUser, setShowUser] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);
  const navigate = useNavigate();
  const [passedData, setPassedData] = useState();
  const handleShowUser = (user) => {
    setShowUser(true);
    setPassedData(user);
  };
  const handleShowDelete = (user) => {
    setShowDelete(true);
    setPassedData(user);
  };
  const handleShowDeactive = (user) => {
    setShowDeactive(true);
    setPassedData(user);
  };
  const handleOnShowInvoices = (user) => {
    navigate(`${user.id}/invoices`);
  };
  const onPress = async (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  const {
    data: users,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetUsersQuery({ role, page, refresh });
  const { triggerRedirect } = useError401Admin(isError, error);

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [deactivateUser, { isLoading: loadingDeactive }] =
    useDeactivateUserMutation();
  const actions = [
    {
      icon: <FaEye />,
      name: "view",
      onClickFunction: handleShowUser,
    },
    {
      icon: <LiaFileInvoiceSolid />,
      name: "invoices",
      onClickFunction: handleOnShowInvoices,
    },
    {
      icon: <DeleteIcon />,
      name: "delete",
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
                key={index}
                data={user}
                fields={[
                  { key: "name", label: "الاسم" },
                  { key: "username", label: "اسم المستخدم" },
                  { key: "phone", label: "رقم الهاتف" },
                  { key: "birthday", label: "تاريخ الميلاد" },
                  { key: "address", label: "العنوان" },
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
                      handleShowUser(userData);
                      break;
                    case "invoices":
                      handleOnShowInvoices(userData);
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

      {users?.data && mode && (
        <Table
          columns={tableHeader}
          fieldsToShow={fieldsToShow}
          data={users?.data}
          isFetching={isFetching}
          error={error}
          actions={actions}
        />
      )}
      {users?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={users?.meta?.total_pages} />
      )}
      <ShowUserModal
        show={showUser}
        id={passedData?.id}
        handleClose={() => setShowUser(false)}
      />
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        loading={deleteLoading}
        message={"هل أنت متأكد من القيام بهذه العملية"}
        title={"حذف المستخدم"}
        onIgnore={() => setShowDelete(false)}
        onOk={async () =>
          await handleDelete(
            passedData?.id,
            deleteUser,
            () => setShowDelete(false),
            triggerRedirect
          )
        }
        show={showDelete}
      />
      <AttentionModal
        handleClose={() => setShowDeactive(false)}
        loading={loadingDeactive}
        message={
          passedData?.is_active
            ? "هل أنت متأكد من إلغاء التنشيط"
            : "هل أنت متأكد من التنشيط"
        }
        title={passedData?.is_active ? "إالعاء التنشيط" : " تنشيط"}
        onIgnore={() => setShowDeactive(false)}
        onOk={async () =>
          await handleDeactive(
            passedData?.id,
            deactivateUser,
            () => setShowDeactive(false),
            triggerRedirect
          )
        }
        show={showDeactive}
      />
      <ToastContainer />
    </>
  );
};

export default UsersContainer;
