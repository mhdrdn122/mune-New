// This file defines the Inventory page, which allows admins to view and refresh daily inventory records.

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import InventoryContainer from "../../../components/Admin/inventory/InventoryContainer";
import SubAppBar from "../../../utils/SubAppBar";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
  const [orders, setOrders] = useState({});

  const [endDate, setEndDate] = useState("");

  console.log(orders)

  const handleDownloadExcel = async () => {
    console.log(orders)
    if (!orders || !orders.data || orders.data.length === 0) {
      alert("No data to download.");
      return;
    }
    
     const data = orders?.data?.map((item, index) => ({
      "اسم المنتج بالعربية": item?.name_ar,
      "اسم المنتج بالانكليزي": item?.name_en,
      "السعر": item?.price,
      "الكمية": item?.count,
      "تاريخ الإنشاء": item?.created_at,
    }))
     const ws = XLSX.utils.json_to_sheet(data)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, "البيانات")
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA').replace(/\//g, '-'); // DD-MM-YYYY
    saveAs(blob, `جرد المبيعات_${dateStr}.xlsx`);
  };

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
        showDownloadButton={ !orders || !orders?.data ||  orders?.data?.length === 0 ? false : true}
        onDownloadExcel={() => handleDownloadExcel()}
      />
      <InventoryContainer
        refresh={refresh}
        setOrders={setOrders}
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
