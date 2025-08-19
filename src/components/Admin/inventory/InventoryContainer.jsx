// This file defines the InventoryContainer component that fetches and displays daily inventory data
// with support for pagination, search, filters, and Excel export.

import { useEffect, useState } from 'react';
import Pagination from '../../../utils/Pagination';
import { Col, Row } from 'react-bootstrap';
import { useGetOrdersQuery } from "../../../redux/slice/order/orderApi";
import SearchComponent from '../../../utils/super_admin/SearchInput';
import { Grid } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import DateFilter from '../../../utils/DateFilter';
import axios from 'axios';
import { baseURLLocalPublic } from '../../../Api/baseURLLocal';
import Table from '../../Tables/Tables';

/**
 * InventoryContainer Component
 * 
 * @param {Object} props 
 * @param {boolean} props.refresh - A boolean that triggers a re-fetch when toggled
 * 
 * @returns {JSX.Element} A paginated, filterable, and downloadable inventory table
 */
const InventoryContainer = ({ refresh , downloadExcel }) => {
  // Table configuration
  const tableHeader = ["اسم المنتج", "السعر", "الكمية", "تاريخ انشاء الطلب"];
  const fieldsToShow = ["name_ar", "price", "count", "created_at"];

  // Component state
  const [page, setPage] = useState(1);
  const [status] = useState('done'); // Fixed status for daily inventory
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
  } = useGetOrdersQuery({ page, status, refresh, searchWord: debouncedSearch, startDate, endDate });

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
    if(downloadExcel==true)
    handleDownloadExcel();
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
      console.error('Error downloading Excel:', error);
      alert('حدث خطأ أثناء تحميل الملف');
    }
  };

  return (
    <>
     

      {/* Filter Toggle Button */}
      <Row className="d-flex justify-content-between container" style={{ flexDirection: "row-reverse" }}>
        <Col className="d-flex align-items-center px-4 gap-2">
          <div
            className="p-2 rounded d-flex align-items-center justify-content-center mb-3"
            style={{ cursor: "pointer", background: "#1F2A40" }}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <FaFilter color="#FFF" size={20} />
          </div>
        </Col>
      </Row>

      {/* Search & Filter Inputs */}
      <Grid container flexDirection="row-reverse" spacing={2} marginBottom={2}>
        {showFilter && (
          <>
            <Grid container item xs={12} sm={4} md={3}>
              <SearchComponent searchWord={searchWord} setSearchWord={setSearchWord} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <DateFilter value={startDate} setValue={setStartDate} name="startDate" label="Start Date" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <DateFilter value={endDate} setValue={setEndDate} name="endDate" label="End Date" />
            </Grid>
          </>
        )}
      </Grid>

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
