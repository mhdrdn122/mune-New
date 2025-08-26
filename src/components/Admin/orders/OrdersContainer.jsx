/**
 * OrdersContainer
 * 
 * This component displays and manages orders, including:
 * - Listing orders in a table
 * - Changing order statuses
 * - Adding, updating, viewing, and deleting orders
 * 
 * It also handles responsive layout for small devices and uses Redux for data fetching.
 *
 * @param {boolean} show - Whether to show the AddOrder modal
 * @param {function} handleClose - Function to close AddOrder modal
 * @param {number|string} refresh - Trigger to refetch order data
 * @param {boolean} showService - Whether to show AddService modal (unused here but passed from parent)
 * @param {function} handleCloseAddService - Closes AddService modal (unused here)
 *
 * @returns {JSX.Element} Orders UI with status changer, table, and modals
 */

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../utils/Pagination";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "../../../redux/slice/order/orderApi";
import { UpdateOrder } from "./UpdateOrder";
import notify from "../../../utils/useNotification";
import { usePermissions } from "../../../context/PermissionsContext";
import useError401Admin from "../../../hooks/useError401Admin";
import { useParams } from "react-router-dom";
import AddOrder from "./AddOrder";
import { useMediaQuery } from "@uidotdev/usehooks";
import axios from "axios";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import Table from "../../Tables/Tables";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";
import { handleDelete } from "./helpers";
import ViewOrder from "./ViewOrder";

const OrdersContainer = ({ show, handleClose, refresh, showService, handleCloseAddService }) => {
  // Table configuration
  const tableHeader = ["اسم المنتج", "السعر", "الكمية", "تاريخ انشاء الطلب", "حالة الطلب", "الحدث"];
  const fieldsToShow = ["name", "price", "count", "created_at", "status"];

  // Modal & data states
  const [passedData, setPassedData] = useState();
  const [showOrder, setShowOrder] = useState(false);
  const [page, setPage] = useState(1);
  const [showEdit, setShowEidt] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading2, setLoading2] = useState(false); // status update loading state

  // URL params
  const { tableId, invoiceId } = useParams();

  // Responsive check
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  // Admin token for manual API request
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  // Get orders from API
  const {
    data: orders,
    isError,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetOrdersQuery({ page, tableId, invoiceId, refresh });

  useEffect(()=>{
    refetch()
  },[])
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Redirect on auth error
  const { triggerRedirect } = useError401Admin(isError, error);

  // Table pagination handler
  const onPress = async (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  // Action button handlers
  const handleShowOrder = (order) => {
    setPassedData(order);
    setShowOrder(true);
  };

  const handleShowEdit = (order) => {
    setPassedData(order);
    setShowEidt(true);
  };

  const handleCloseEdit = () => {
    setShowEidt(false);
  };

  const handleShowDelete = (order) => {
    setPassedData(order);
    setShowDelete(true);
  };

  /**
   * Change status of all orders (accepted, preparation, done)
   * @param {string} status - New status to apply
   */
  const handleChangeStatus = async (status) => {
    if (!status) return;
    setLoading2(true);
    try {
      const response = await axios.put(
        `${baseURLLocalPublic}/admin_api/accept_orders?id=${tableId}&status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );
      if (response.status === 200) {
        notify("تم تحديث الحالة بنجاح", "success");
        refetch();
      } else {
        notify(response.data.message, "error");
      }
    } catch (err) {
      notify(err?.response?.data?.message || "حدث خطأ أثناء التحديث", "error");
      console.error("Error updating status:", err);
    } finally {
      setLoading2(false);
    }
  };

  const actions = [
    {
      icon: <FaEye />,
      name: "view",
      onClickFunction: handleShowOrder,
    },
    {
      icon: <EditOutlinedIcon />,
      name: "edit",
      onClickFunction: handleShowEdit,
    },
    {
      icon: <DeleteIcon />,
      name: "delete",
      onClickFunction: handleShowDelete,
    },
  ];

  return (
    <>
      {/* Status change dropdown */}
      <div
        className={isSmallDevice ? "ms-3" : "ms-5"}
        style={{ textAlign: "left", marginBottom: "5px" }}
      >
        <Form.Select
          aria-label="تغيير حالة الطلبات"
          style={{
            width: "12%",
            backgroundColor: "rgb(2 13 38 / 91%)",
            color: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "15px",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "16px",
            cursor: "pointer",
          }}
          onChange={(e) => handleChangeStatus(e.target.value)}
          disabled={loading2}
        >
          <option value="">اختر الحالة</option>
          <option value="accepted">قبول الكل</option>
          <option value="preparation">قيد التحضير</option>
          <option value="done">تم</option>
        </Form.Select>
      </div>

      {/* Main table */}
      <Table
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        data={orders?.data}
        isFetching={isFetching}
        error={error}
      />

      {/* Pagination */}
      {orders?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={orders.meta.total_pages} />
      )}

      {/* Modals */}
      {show && <AddOrder show={show} handleClose={handleClose} />}

      {showEdit && (
        <UpdateOrder show={showEdit} handleClose={handleCloseEdit} order={passedData} />
      )}

      {showDelete && (
        <AttentionModal
          handleClose={() => setShowDelete(false)}
          loading={isDeleting}
          message={"هل أنت متأكد من عملية حذف الطلب؟"}
          title={"حذف الطلب"}
          onIgnore={() => setShowDelete(false)}
          onOk={async () =>
            await handleDelete(passedData?.id, deleteOrder, () => setShowDelete(false), triggerRedirect)
          }
          show={showDelete}
        />
      )}

      {showOrder && (
        <ViewOrder
          show={showOrder}
          onHide={() => setShowOrder(false)}
          order={passedData}
        />
      )}
    </>
  );
};

export default OrdersContainer;
