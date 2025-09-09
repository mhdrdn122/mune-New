// This file defines the InventoryContainer component that fetches and displays daily inventory data
// with support for pagination, search, filters, and Excel export.

import { useEffect, useState } from "react";
import Pagination from "../../../utils/Pagination";
 import { useGetOrdersQuery } from "../../../redux/slice/order/orderApi"; 
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
  searchWord,
  startDate,
  endDate,
  setOrders
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
     if(orders){
    setOrders(orders)
    }
    refetch();
  }, [orders]);

 
  /**
   * Handles pagination change
   * @param {number} page - New page number
   */
  const onPress = async (page) => {
    setPage(page);
    window.scroll(0, 0);
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
