// This file defines the InventoryContainer component that fetches and displays daily inventory data
// with support for pagination, search, filters, and Excel export.

import { useEffect, useState } from "react";
import Pagination from "../../../utils/Pagination";
import { Col, Row } from "react-bootstrap";
import { useGetOrdersQuery } from "../../../redux/slice/order/orderApi";
import SearchComponent from "../../../utils/super_admin/SearchInput";
import { Grid } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import DateFilter from "../../../utils/DateFilter";
import axios from "axios";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import Table from "../../Tables/Tables";

/**
 * InventoryContainer Component
 *
 * @param {Object} props
 * @param {boolean} props.refresh - A boolean that triggers a re-fetch when toggled
 *
 * @returns {JSX.Element} A paginated, filterable, and downloadable inventory table
 */
const InventoryContainer = ({
  refresh,
  downloadExcel,
  searchWord,
   startDate,
   endDate,
 }) => {
  // Table configuration
  const tableHeader = ["اسم المنتج", "السعر", "الكمية", "تاريخ انشاء الطلب"];
  const fieldsToShow = ["name_ar", "price", "count", "created_at"];
  console.log(endDate);

  // Component state
  const [page, setPage] = useState(1);
  const [status] = useState("done"); // Fixed status for daily inventory
   const [debouncedSearch, setDebouncedSearch] = useState("");
 
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token;

  // Fetch orders from backend using Redux RTK Query
  const {
    data: orders,
    isError,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetOrdersQuery({
    page,
    status,
    refresh,
    searchWord: debouncedSearch,
    startDate,
    endDate,
  });

  /**
   * Updates the `debouncedSearch` after a delay to avoid rapid re-requests
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchWord]);

  /**
   * Initial refetch on component mount
   */
  useEffect(() => {
    refetch();
  }, []);

  /**
   * download Excel
   */
  useEffect(() => {
    if (downloadExcel == true) handleDownloadExcel();
  }, [downloadExcel]);
  /**
   * Handles pagination change
   * @param {number} page - New page number
   */
  const onPress = async (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  /**
   * Downloads the inventory as an Excel file with applied filters
   */
  const handleDownloadExcel = async () => {
    try {
      const params = new URLSearchParams();
      params.append("status", "done");
      if (debouncedSearch) params.append("searchWord", debouncedSearch);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(
        `${baseURLLocalPublic}/admin_api/excel_sales_inventory?${params.toString()}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoices.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("حدث خطأ أثناء تحميل الملف");
    }
  };

  return (
    <>
      {/* Inventory Table */}
      <Table
        columns={tableHeader}
        data={orders?.data}
        error={error}
        fieldsToShow={fieldsToShow}
        isFetching={isFetching}
      />

      {/* Pagination Controls */}
      {orders?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={orders.meta.total_pages} />
      )}
    </>
  );
};

export default InventoryContainer;
