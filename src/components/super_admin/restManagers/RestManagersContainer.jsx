import { IconButton } from "@mui/material";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { CgUnblock } from "react-icons/cg";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
// import ModalDelete from "../cities/ModalDelete";
// import ModalDeactive from "../cities/ModalDeactive";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// import ShowResAdmin from "./ShowResAdmin";
// import { usePermissions } from "../../../context/PermissionsContext";
// import { SuperPermissionsEnum } from "../../../constant/permissions";
import {
  useDeactivateRestManagerMutation,
  useDeleteRestManagerMutation,
  useGetRestManagersQuery,
} from "../../../redux/slice/super_admin/restManagers/restManagerApi";
import AddResManager from "./AddResManager";
import EditResManager from "./EditResManager";
import ModalDelete from "../cities/ModalDelete";
import ModalDeactive from "../cities/ModalDeactive";
import ShowResManager from "./ShowResManager";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import useError401 from "../../../hooks/useError401 ";
import Pagination from "../../../utils/Pagination";
import useRandomNumber from "../../../hooks/useRandomNumber";

const RestManagersContainer = ({ show, handleClose,randomNumber }) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  console.log(randomNumber)
  const [page, setPage] = useState(1);
  const {
    data: managers,
    isError,
    error,
    isLoading: loading,
    refetch,
    isFetching
  } = useGetRestManagersQuery({ page, randomNumber });
  const [
    deleteRestManager,
    { isLoading, isSuccess, isError: isErrDelete, error: errorDel },
  ] = useDeleteRestManagerMutation();
  const [deactivateRestManager, { isLoading: loadingDeactive }] =
    useDeactivateRestManagerMutation();
  const { triggerRedirect } = useError401(isError, error);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showEdit, setShowEidt] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);

  const handleShowAdmin = (data) => {
    setShowAdmin(data);
  };
  const handleCloseShowAdmin = () => {
    setShowAdmin(false);
  };
  const handleShowEdit = (id) => {
    setShowEidt(id);
  };
  const handleCloseEdit = () => {
    setShowEidt(false);
  };
  const handleShowDelete = (id) => {
    setShowDelete(id);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleShowDeactive = (id) => {
    setShowDeactive(id);
  };

  const handleCloseDeactive = () => {
    setShowDeactive(false);
  };

  const handleDelete = async () => {
    try {
      const result = await deleteRestManager(showDelete).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDelete();
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      // console.error("Failed:", error);
      // notify(error.message, "error");
      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
  };
  const handleDeactive = async () => {
    try {
      const result = await deactivateRestManager(showDeactive).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDeactive();
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
  const handleShowRestaurants = (id) => {
    navigate(`/super_admin/restaurants_managers/${id}/restaurants`);
  };

  // Parse and categorize error message
  const getErrorMessage = (error) => {
    if (error?.status === "FETCH_ERROR") {
      return "Network error: Please check your internet connection.";
    } else if (error?.status >= 500) {
      return "Server error: Please try again later.";
    } else if (error?.status === 404) {
      return "Data not found: The requested resource was not found.";
    } else if (error?.data?.message) {
      return error.data.message;
    } else if (error?.data?.errors) {
      return Object.values(error.data.errors).join(", ");
    }
  };

  const onPress = async (page) => {
    setPage(page);
  };


  // console.log(error);
  return (
    <div>
      <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="co !bg-[#2F4B26] "  > الاسم </th>
              <th className="col !bg-[#2F4B26]"> اسم المستخدم </th>
              <th className="col !bg-[#2F4B26]"> رقم الموبايل </th>
              <th className="col !bg-[#2F4B26]"> الحالة </th>
              <th className="col-3 !bg-[#2F4B26]">الحدث </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="5">
                  <div className="my-4 text-center">
                    <p className="mb-2">جار التحميل</p>
                    <Spinner
                      className="m-auto"
                      animation="border"
                      role="status"
                    ></Spinner>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="5">
                  <p className="mt-5 mb-1">{getErrorMessage(error)}</p>
                  <button className="rounded border mb-5" onClick={refetch}>
                    Retry
                  </button>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {managers && managers.data && managers.data.length > 0 ? (
                managers.data.map((admin, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: "center" }}>{admin.name}</td>
                    <td style={{ textAlign: "center" }}>{admin.user_name}</td>
                    <td style={{ textAlign: "center" }}>{admin.mobile}</td>
                    <td style={{ textAlign: "center" }}>
                      {admin.is_active === 1 ? (
                        <span className="text-white bg-success p-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-white bg-danger p-1 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="">
                      <IconButton
                        onClick={() => handleShowRestaurants(admin.id)}
                      >
                        <RestaurantOutlinedIcon
                          sx={{ color: "#2F4B26" }}
                        />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#2F4B26" }}
                        onClick={() => handleShowAdmin(admin)}
                      >
                        <FaEye />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#2F4B26" }}
                        onClick={() => handleShowEdit(admin)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#f00" }}
                        onClick={() => handleShowDelete(admin.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {admin.is_active === 1 ? (
                        <IconButton
                          onClick={() => handleShowDeactive(admin.id)}
                        >
                          <BlockOutlinedIcon
                            sx={{ color: "#2F4B26" }}
                          />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleShowDeactive(admin.id)}
                        >
                          <RemoveCircleIcon sx={{ color: "red" }} />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p className="my-5">لا توجد بيانات</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {managers?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={managers?.meta?.total_pages} />
      )}
      <AddResManager show={show} handleClose={handleClose} />
      <EditResManager show={showEdit} handleClose={handleCloseEdit} />
      <ModalDelete
        show={showDelete}
        handleClose={handleCloseDelete}
        loading={isLoading}
        error={""}
        handleDelete={handleDelete}
      />
      <ModalDeactive
        show={showDeactive}
        handleClose={handleCloseDeactive}
        loading={loadingDeactive}
        error={""}
        handleDeactive={handleDeactive}
      />
      <ShowResManager show={showAdmin} handleClose={handleCloseShowAdmin} />

      <ToastContainer />
    </div>
  );
};

export default RestManagersContainer;
