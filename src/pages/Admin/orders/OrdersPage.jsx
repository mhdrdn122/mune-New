/**
 * OrdersPage
 *
 * This component is responsible for managing the orders page in the admin panel.
 * It includes functionalities to:
 * - Display existing orders
 * - Add a new order
 * - Add a new service
 *
 * It fetches the list of services and refreshes the data using a custom random number hook.
 * It dynamically sets breadcrumbs depending on the context (invoice vs. tables).
 *
 * @returns {JSX.Element} A fully functional admin page for managing orders.
 */

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import OrdersContainer from "../../../components/Admin/orders/OrdersContainer";
import { PermissionsEnum } from "../../../constant/permissions";
import { useParams } from "react-router-dom";
import useRandomNumber from "../../../hooks/useRandomNumber";
 import SubAppBar from "../../../utils/SubAppBar";

const OrdersPage = () => {
  // Local state management
  const [showAdd, setShowAdd] = useState(false); // toggles order form
  const [showAddService, setShowAddService] = useState(false); // toggles service form
  const [refresh, setRefresh] = useState(false); // forces refetch
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100); // custom hook for random refresh token
  const { tableId, invoiceId } = useParams();


  

  /** Opens the order form modal */
  const handleShowAdd = () => setShowAdd(true);

  /** Opens the add service modal */
  const handleShowAddService = () => setShowAddService(true);

  /** Closes the add service modal */
  const handleCloseAddService = () => setShowAddService(false);

  /** Closes the order form modal */
  const handleCloseAdd = () => setShowAdd(false);

  return (
    <div>
      <SubAppBar
        title=" الطلبات "
        titleBtn="إضافة خدمة"
        
        showAddButton={true}
        onAdd={handleShowAdd}
        showRefreshButton={true}
        setRefresh={setRefresh}
        requiredPermission={{ Add: PermissionsEnum.ORDER_ADD }}
      />

      <OrdersContainer
        show={showAdd}
        handleClose={handleCloseAdd}
        showService={showAddService}
        handleCloseAddService={handleCloseAddService}
        refresh={randomNumber}
      />

      <ToastContainer />
    </div>
  );
};

export default OrdersPage;
