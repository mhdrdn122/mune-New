import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { CgUnblock } from "react-icons/cg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ModalAddRest from "./AddRest";
import {
  useDeactivateRestMutation,
  useDeleteRestMutation,
  useGetRestsQuery,
  useUpdate_super_admin_restaurant_idMutation,
} from "../../../redux/slice/super_admin/resturant/resturantsApi";
import ModalDelete from "../cities/ModalDelete";
import ModalDeactive from "../cities/ModalDeactive";
import notify from "../../../utils/useNotification";
import { TiStarFullOutline } from "react-icons/ti";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddAlarmOutlinedIcon from "@mui/icons-material/AddAlarmOutlined";
import { usePermissions } from "../../../context/PermissionsContext";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useError401 from "../../../hooks/useError401 ";
import Pagination from "../../../utils/Pagination";
import { IoQrCodeOutline } from "react-icons/io5";

const ResturantsContainer = ({ searchWord, setSearchWord, randomNumber }) => {
  const { hasPermission } = usePermissions();
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
  console.log(cityId);
  const [deleteRest, { isLoading }] = useDeleteRestMutation();
  const [update_super_admin_restaurant_id, { isLoading: isLoadingUpdate }] =
    useUpdate_super_admin_restaurant_idMutation();
  const [deactivateRest, { isLoading: loadingDeactive }] =
    useDeactivateRestMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const handleShowDeleteModal = (id) => {
    setShowDeleteModal(id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowDeactiveModal = (id) => {
    setShowDeactiveModal(id);
  };

  const handleCloseDeactiveModal = () => {
    setShowDeactiveModal(false);
  };

  console.log(error);

  const { triggerRedirect } = useError401(isError, error);

  // Parse and categorize error message
  const getErrorMessage = (error) => {
    if (error?.status === "FETCH_ERROR") {
      return "Network error: Please check your internet connection.";
    } else if (error?.status >= 500) {
      return "Server error: Please try again later.";
    } else if (error?.status === 404) {
      return "Data not found: The requested resource was not found.";
    } else {
      return error?.data?.message;
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteRest(showDeleteModal).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDeleteModal();
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
      const result = await deactivateRest(showDeactiveModal).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDeactiveModal();
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
      setPage(1);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  // useEffect(() => {
  //   refetch();
  // }, [debouncedSearch, refetch]);

  const handleClick = async (rest) => {
    try {
      const result = await update_super_admin_restaurant_id(rest.id).unwrap();
      console.log('result after login from super admin : ',result);
      console.log('rest after login from super admin : ',rest);
      if (result.status === true) {
        notify(result.message, "success");
        const superAdminInfo = JSON.parse(
          localStorage.getItem("superAdminInfo")
        );
        localStorage.setItem(
          "adminInfo",
          JSON.stringify({
            restaurant: {
              is_advertisement: rest.is_advertisement,
              is_news: rest.is_news,
              is_order: rest.is_order,
              is_rate: rest.is_rate,
              is_table: rest.is_table,
              name_url: rest.name_url,
            },
            token: superAdminInfo.token,
            restaurant_id: rest.id,
            super: true,
            id: superAdminInfo.id,
            menu_id:rest.menu_template_id,
          })
        );
        localStorage.setItem('selected', 'الأصناف')
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        notify(result.message, "error");
      }
    } catch (e) {
      console.log(e);
      // notify(e?.data?.message, "error");
      if (e?.status === 401) {
        triggerRedirect();
      } else {
        notify(e?.data?.message, "error");
      }
    }
  };

  const onPress = async (page) => {
    setPage(page);
  };

  console.log(searchWord);

  return (
    <div>
      <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="col"> اسم المطعم </th>
              <th className="col"> تاريخ الانتهاء </th>
              <th className="col"> الحالة </th>
              <th className="col">الحدث </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="4">
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
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan="4">
                  <div className="my-5 text-center">
                    <p>{getErrorMessage(error)}</p>
                    <button className="rounded border" onClick={refetch}>
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {rests && rests.data && rests.data.length > 0 ? (
                rests.data.map((rest) => (
                  <tr key={rest.id}>
                    <td style={{ textAlign: "center" }}>{rest.name || rest.name_en}</td>
                    <td style={{ textAlign: "center" }}>{rest.end_date}</td>
                    <td style={{ textAlign: "center" }}>
                      {rest.is_active === 1 ? (
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
                      {
                        <IconButton
                          sx={{ color: "#000" }}
                          onClick={() => handleClick(rest)}
                          disabled={isLoadingUpdate}
                        >
                          <FaEye />
                        </IconButton>
                      }
                      {hasPermission(
                        SuperPermissionsEnum.RESTAURANT_UPDATE
                      ) && (
                        <IconButton
                          sx={{ color: "#000" }}
                          onClick={() =>
                            navigate(`/super_admin/resturants/${rest.id}/edit`)
                          }
                        >
                          <EditOutlinedIcon onClick={() => {}} />
                        </IconButton>
                      )}
                      {hasPermission(
                        SuperPermissionsEnum.RESTAURANT_DELETE
                      ) && (
                        <IconButton sx={{ color: "#000" }}>
                          <DeleteIcon
                            onClick={() => handleShowDeleteModal(rest.id)}
                          />
                        </IconButton>
                      )}
                      {hasPermission(SuperPermissionsEnum.RESTAURANT_ACTIVE) &&
                        (rest.is_active === 1 ? (
                          <IconButton sx={{ color: "#000" }}>
                            <BlockOutlinedIcon
                              onClick={() => {
                                handleShowDeactiveModal(rest.id);
                              }}
                            />
                          </IconButton>
                        ) : (
                          <IconButton sx={{ color: "#000" }}>
                            <CgUnblock
                              onClick={() => {
                                handleShowDeactiveModal(rest.id);
                              }}
                            />
                          </IconButton>
                        ))}
                      {hasPermission(SuperPermissionsEnum.RATE_INDEX) && (
                        <Link
                          to={`/super_admin/city/${rest.city_id}/resturants/${
                            rest && rest.id
                          }/rates`}
                          onClick={() =>
                            localStorage.setItem("prevUrl", pathname)
                          }
                        >
                          <Tooltip title="التقييمات">
                            <IconButton sx={{ color: "#000" }}>
                              <TiStarFullOutline />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      )}

                      {hasPermission(
                        SuperPermissionsEnum.ADMIN_RESTAURANT_INDEX
                      ) && (
                        <Link
                          to={`/super_admin/city/${rest.city_id}/resturants/${
                            rest && rest.id
                          }/admins`}
                          onClick={() =>
                            localStorage.setItem("prevUrl", pathname)
                          }
                        >
                          <Tooltip title="المشرفين">
                            <IconButton sx={{ color: "#000" }}>
                              <SupervisorAccountIcon />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      )}
                      {hasPermission(
                        SuperPermissionsEnum.PACKAGE_SHOW_RESTAURANT_SUBSCRIPTION
                      ) && (
                        <Link
                          to={`/super_admin/city/${rest.city_id}/resturants/${
                            rest && rest.id
                          }/subscriptions`}
                          onClick={() =>
                            localStorage.setItem("prevUrl", pathname)
                          }
                        >
                          <Tooltip title="الاشتراكات">
                            <IconButton sx={{ color: "#000" }}>
                              <AddAlarmOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      )}
                         <IconButton sx={{ color: "#000" }}>
                        <IoQrCodeOutline 
                        onClick={()=>{
                          navigate(`/super_admin/resturants/${rest.id}/qrInfo`)
                        }} />                      
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <p className="my-5">لا توجد بيانات</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {rests?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={rests?.meta?.total_pages} />
      )}

      <ModalDelete
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        loading={isLoading}
        error={""}
        handleDelete={handleDelete}
      />

      <ModalDeactive
        show={showDeactiveModal}
        handleClose={handleCloseDeactiveModal}
        loading={loadingDeactive}
        error={""}
        handleDeactive={handleDeactive}
      />
    </div>
  );
};

export default ResturantsContainer;
