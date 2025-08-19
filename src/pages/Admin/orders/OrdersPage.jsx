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
import { useGetServicesQuery } from "../../../redux/slice/service/serviceApi";
import PageHeader from "../../../components/PageHeader/PageHeader";

const OrdersPage = () => {
  // Local state management
  const [showAdd, setShowAdd] = useState(false); // toggles order form
  const [showAddService, setShowAddService] = useState(false); // toggles service form
  const [refresh, setRefresh] = useState(false); // forces refetch
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100); // custom hook for random refresh token
  const { tableId, invoiceId } = useParams();

  /**
   * Fetches services from the backend with caching and error states.
   * @param {Object} queryArgs - Contains the `refresh` token to force refetching.
   */
  const {
    data: services,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching
  } = useGetServicesQuery({ refresh });

  /**
   * Dynamically generated breadcrumbs for navigation
   * Based on whether the page is accessed from invoices or tables.
   */
  const breadcrumbs = [
    ...(invoiceId !== undefined
      ? [
          {
            label: "الفواتير",
            to: `/admin/invoices`,
          },
        ]
      : [
          {
            label: "الطاولات",
            to: "/admin/tables",
          },
        ]),
    {
      label: "الطلبات",
    },
  ].reverse();

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
      <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"الطلبات"}
        buttonText={"إضافة طلب"}
        onButtonClick={handleShowAdd}
        requiredPermission={PermissionsEnum.ORDER_ADD}
        setRefresh={setRefresh}
        refresh={refresh}
        refreshRandomNumber={refreshRandomNumber}
        services={services}
        onButtonClick2={handleShowAddService}
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
