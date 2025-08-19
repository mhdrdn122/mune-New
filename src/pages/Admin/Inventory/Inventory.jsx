// This file defines the Inventory page, which allows admins to view and refresh daily inventory records.

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import InventoryContainer from "../../../components/Admin/inventory/InventoryContainer";
import PageHeader from "../../../components/PageHeader/PageHeader";
import SubAppBar from "../../../utils/SubAppBar";

// Breadcrumbs for navigation displayed in the header
const breadcrumbs = [
  {
    label: "الأصناف",
    to: "/admin",
  },
  {
    label: "الجرد اليومي",
  },
].reverse();

/**
 * @component Inventory
 *
 * Renders the daily inventory page for admin users.
 * Allows refreshing the inventory data through the `PageHeader` component.
 * Displays inventory items using `InventoryContainer`.
 *
 * @returns {JSX.Element} Inventory management interface for the admin panel.
 */
const Inventory = () => {
  const [refresh, setRefresh] = useState(false); // State to trigger data refresh in child components
  const [downloadExcel, setDownloadExcel] = useState(false); // State to trigger data refresh in child components

   

  return (
    <div>
      {/* <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"الطلبات"}
        refresh={refresh}
        setRefresh={setRefresh}
      /> */}
      <SubAppBar
        title=" الطلبات "
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        showDownloadButton={true}
        onDownloadExcel={() => setDownloadExcel(true)}
       
      />
      <InventoryContainer refresh={refresh} downloadExcel={downloadExcel} />
      <ToastContainer />{" "}
      {/* Provides toast notifications for success or error feedback */}
    </div>
  );
};

export default Inventory;
