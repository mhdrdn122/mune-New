// This file renders the table displaying employee request logs with pagination and filters.

import { useEffect, useState } from "react";
import Pagination from "../../utils/Pagination";
import { useGetOrdersQuery } from "../../redux/slice/tables/tablesApi";
import Table from '../../components/Tables/Tables';

/**
 * `RequestsContainer` component displays a paginated and filterable table of employee service requests.
 * It allows filtering by employee ID, type (e.g., waiter), table ID, date, and supports search input with debounce.
 * 
 * @param {string} searchWord - The keyword to search requests by name or other searchable fields.
 * @param {string} emp - Selected employee ID to filter requests.
 * @param {string} type - Selected employee type (e.g., "waiter", "shisha").
 * @param {string} tableId - Selected table ID to filter requests.
 * @param {string | null} date - Selected date to filter requests.
 * @returns {JSX.Element} Filtered requests list in a table with pagination.
 */
const RequestsContainer = ({ searchWord, emp, type, tableId, date }) => {
  // Table header labels (in Arabic)
  const tableHeader = ["الاسم", "دوره", "رقم الطاولة", "زمن الاستجابة"];

  // Fields from the API response to show in the table
  const fieldsTOShow = ["name", "type", "number_table", "response_time"];

  const [page, setPage] = useState(1);                    // Current page number for pagination
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced value for search input

  // Query hook to fetch filtered requests
  const {
    data: orders,
    isError,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetOrdersQuery({
    page,
    search: debouncedSearch,
    emp_id: emp,
    type,
    table_id: tableId,
    date
  });

  // Handles pagination page changes
  const onPress = async (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  // Debounce search input to prevent frequent API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  // Initial fetch on component mount
  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Table
        columns={tableHeader}
        fieldsToShow={fieldsTOShow}
        data={orders?.data}
        error={error}
        isFetching={isFetching}
      />

      {/* Pagination only shown if there’s more than 1 page */}
      {orders?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={orders.meta.total_pages} />
      )}
    </>
  );
};

export default RequestsContainer;
