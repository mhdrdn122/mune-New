// This file defines the Inventory page, which allows admins to view and refresh daily inventory records.

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import InventoryContainer from "../../../components/Admin/inventory/InventoryContainer";
import SubAppBar from "../../../utils/SubAppBar";

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
  const [searchWord, setSearchWord] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  console.log(endDate)

  return (
    <div>
      <SubAppBar
        title=" الطلبات "
        showRefreshButton={true}
        showSearch={true}
        onSearch={(value) => setSearchWord(value)}
        showDateRangeSearch={true}
        onDateRangeSearch={(start, end) => {
          console.log(end)
          if (start) setStartDate(start);
          if (end) setEndDate(end);
        }}
        refresh={refresh}
        setRefresh={setRefresh}
        showDownloadButton={true}
        onDownloadExcel={() => setDownloadExcel(true)}
      />
      <InventoryContainer
        refresh={refresh}
        downloadExcel={downloadExcel}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <ToastContainer />{" "}
      {/* Provides toast notifications for success or error feedback */}
    </div>
  );
};

export default Inventory;
