/**
 * This component `AdminsContainer` is responsible for displaying and managing the list of admins
 * for the super admin interface.
 * 
 * Functionalities include:
 * - Viewing admin details.
 * - Adding, editing, deleting, activating/deactivating admins.
 * - Filtering admins by role.
 * - Pagination support.
 * - Permission-based action rendering.
 * 
 * @param {boolean} show - Controls visibility of the add admin modal.
 * @param {function} handleClose - Closes the add admin modal.
 * @param {boolean | number} refresh - Trigger to force re-fetching the admins list.
 * 
 * @returns {JSX.Element} Admin management table with controls and modals.
 */

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { CgUnblock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import ModalAddAdmin from "./ModalAddAdmin";
import {
  useDeactivateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from "../../../redux/slice/super_admin/super_admins/superAdminsApi";
import { ToastContainer } from "react-toastify";
import ModalEditAdmin from "./ModalEditAdmin";
import notify from "../../../utils/useNotification";
import ModalDeactive from "../cities/ModalDeactive";
import ModalDelete from "../cities/ModalDelete";
import ModalShowAdmin from "./ModalShowAdmin";
import { usePermissions } from "../../../context/PermissionsContext";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useError401 from "../../../hooks/useError401 ";
import Pagination from "../../../utils/Pagination";

const AdminsContainer = ({ show, handleClose, refresh }) => {
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [role, setRole] = useState("all");

  const {
    data: admins,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetAdminsQuery({ role, page, refresh }, { refetchOnMountOrArgChange: true });

  const [
    deleteAdmin,
    { isLoading: isDeleting },
  ] = useDeleteAdminMutation();

  const [deactivateAdmin, { isLoading: loadingDeactive }] = useDeactivateAdminMutation();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showEdit, setShowEidt] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);

  const { triggerRedirect } = useError401(isError, error);

  // Modal control handlers
  const handleShowAdmin = (data) => setShowAdmin(data);
  const handleCloseShowAdmin = () => setShowAdmin(false);
  const handleShowEdit = (id) => setShowEidt(id);
  const handleCloseEdit = () => setShowEidt(false);
  const handleShowDelete = (id) => setShowDelete(id);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDeactive = (id) => setShowDeactive(id);
  const handleCloseDeactive = () => setShowDeactive(false);

  // API interaction handlers
  const handleDelete = async () => {
    try {
      const result = await deleteAdmin(showDelete).unwrap();
      if (result.status === true) {
        notify(result.msg, "success");
        handleCloseDelete();
      } else {
        notify(result.msg, "error");
      }
    } catch (error) {
      if (error?.status === 401) triggerRedirect();
      else notify(error?.data?.message, "error");
    }
  };

  const handleDeactive = async () => {
    try {
      const result = await deactivateAdmin(showDeactive).unwrap();
      if (result.status === true) {
        notify(result.msg, "success");
        handleCloseDeactive();
      } else {
        notify(result.msg, "error");
      }
    } catch (error) {
      if (error?.status === 401) triggerRedirect();
      else notify(error?.data?.message, "error");
    }
  };

  const onPress = (page) => setPage(page);

  return (
    <div>
     

      {/* Admins Table */}
      <div className="table-responsive table_container ">
        <table className="table" dir="rtl">
          <thead>
            <tr >
              <th className="!bg-[#2F4B26]"> الاسم </th>
              <th className="!bg-[#2F4B26]" > اسم المستخدم </th>
              <th className="!bg-[#2F4B26]" > المدينة </th>
              <th className="!bg-[#2F4B26]" > role </th>
              <th className="!bg-[#2F4B26]" > الحالة </th>
              <th className="!bg-[#2F4B26]" > الحدث </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  <p className="mb-2">جار التحميل</p>
                  <Spinner animation="border" role="status" />
                </td>
              </tr>
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  <p className="my-5">{error.data?.message}</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {admins?.data?.length ? admins.data.map((admin, i) => (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>{admin.name}</td>
                  <td style={{ textAlign: "center" }}>{admin.user_name}</td>
                  <td style={{ textAlign: "center" }}>{admin.city?.name || "..."}</td>
                  <td style={{ textAlign: "center" }}>{admin.roles}</td>
                  <td style={{ textAlign: "center" }}>
                    {admin.is_active === 1 ? (
                      <span className="text-white bg-success p-1 rounded">Active</span>
                    ) : (
                      <span className="text-white bg-danger p-1 rounded">Inactive</span>
                    )}
                  </td>
                  <td >
                    <IconButton onClick={() => handleShowAdmin(admin)}><FaEye  className="!text-[#2F4B26]" /></IconButton>
                    {hasPermission(SuperPermissionsEnum.ADMIN_RESTAURANT_UPDATE) && (
                      <IconButton onClick={() => handleShowEdit(admin.id)}><EditOutlinedIcon className="!text-[#2F4B26]"  /></IconButton>
                    )}
                    {hasPermission(SuperPermissionsEnum.ADMIN_RESTAURANT_DELETE) && (
                      <IconButton onClick={() => handleShowDelete(admin.id)}><DeleteIcon className="!text-[#f00]" /></IconButton>
                    )}
                    {hasPermission(SuperPermissionsEnum.ADMIN_RESTAURANT_ACTIVE) && (
                      <IconButton onClick={() => handleShowDeactive(admin.id)}>
                        {admin.is_active === 1 ? <BlockOutlinedIcon className="!text-[#2F4B26]" /> : <CgUnblock />}
                      </IconButton>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">لا توجد بيانات</td></tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {admins?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={admins.meta.total_pages} />
      )}

      {/* Modals */}
      <ModalShowAdmin show={showAdmin} handleClose={handleCloseShowAdmin} />
      <ModalAddAdmin show={show} handleClose={handleClose} />
      <ModalEditAdmin show={showEdit} handleClose={handleCloseEdit} />
      <ModalDelete show={showDelete} handleClose={handleCloseDelete} loading={isDeleting} handleDelete={handleDelete} />
      <ModalDeactive show={showDeactive} handleClose={handleCloseDeactive} loading={loadingDeactive} handleDeactive={handleDeactive} />

      {/* Notification */}
      <ToastContainer />
    </div>
  );
};

export default AdminsContainer;
