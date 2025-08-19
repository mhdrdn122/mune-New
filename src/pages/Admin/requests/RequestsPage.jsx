// Specifically, it renders the Requests page that displays employee request details with filtering options.

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import RequestsContainer from "../../../Containers/RequestsContainer/RequestsContainer";
import SearchComponent from "../../../utils/super_admin/SearchInput";
import SelectFilter from "../../../utils/SelectFilter";
import { useGetAdminsQuery } from "../../../redux/slice/admins/adminsApi";
import { useGetTablesQuery } from "../../../redux/slice/tables/tablesApi";
import { Row, Col, Container } from "react-bootstrap";
import { FaFilter } from "react-icons/fa6";
import DateFilter from "../../../utils/DateFilter";
import PageHeader from "../../../components/PageHeader/PageHeader";

/**
 * This function `RequestsPage` displays employee request logs with filtering options.
 * It fetches data for admins and tables from the backend and allows the user to:
 * - Search requests by a keyword.
 * - Filter by employee ID, type (e.g., waiter), table ID, and date.
 * 
 * @returns {JSX.Element} The rendered page component for admin to view and filter employee requests.
 */
const RequestsPage = () => {
  // Fetching list of admins and tables for filter options
  const { data: admins } = useGetAdminsQuery({ page: 1, role: "" });
  const { data: tables } = useGetTablesQuery({ page: 1 });

  // States for filtering/searching
  const [searchWord, setSearchWord] = useState(""); // Search term input
  const [emp, setEmp] = useState("");               // Selected employee ID
  const [type, setType] = useState("");             // Selected employee type (e.g., waiter)
  const [tableId, setTableId] = useState("");       // Selected table ID
  const [date, setDate] = useState(null);           // Selected date
  const [showFilter, setShowFilter] = useState(false); // Toggle filter panel visibility

  const breadcrumbs = [
    { label: " تفاصيل الموظفين" },
    { label: " الرئيسية", to: "/admin" },
  ];

  // Hardcoded filter options for employee types
  const types = [
    { id: "waiter", name: "نادل" },
    { id: "shisha", name: "موظف أراكيل" },
  ];

  // Mapping table data to format accepted by <SelectFilter />
  const optionsTable = tables?.data?.map((item) => ({
    id: item.id,
    name: item.number_table,
  }));

  return (
    <Container fluid>
      <PageHeader breadcrumbs={breadcrumbs} heading={"تفاصيل الموظفين"} />

      {/* Filter toggle button */}
      <Row className="justify-content-between flex-row-reverse my-3">
        <Col xs="auto" className="d-flex align-items-center gap-2 px-4">
          <div
            className="p-2 rounded d-flex align-items-center justify-content-center"
            style={{ cursor: "pointer", backgroundColor: "#1F2A40" }}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <FaFilter color="#FFF" size={20} />
          </div>
        </Col>
      </Row>

      {/* Filter panel */}
      {showFilter && (
        <Row className="mb-3 g-3 flex-row-reverse">
          <Col xs={12} sm={6} md={4} lg={3}>
            <SearchComponent searchWord={searchWord} setSearchWord={setSearchWord} />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <SelectFilter
              value={emp}
              setValue={setEmp}
              name={"emp_id"}
              label={"الموظفين"}
              options={admins?.data}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <SelectFilter
              value={type}
              setValue={setType}
              name={"type"}
              label={"النوع"}
              options={types}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <SelectFilter
              value={tableId}
              setValue={setTableId}
              name={"tableId"}
              label={"الطاولات"}
              options={optionsTable}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <DateFilter
              value={date}
              setValue={setDate}
              name="date"
              label="Date"
            />
          </Col>
        </Row>
      )}

      {/* Requests list container with applied filters */}
      <RequestsContainer
        searchWord={searchWord}
        emp={emp}
        type={type}
        tableId={tableId}
        date={date}
      />

      {/* Notification container */}
      <ToastContainer />
    </Container>
  );
};

export default RequestsPage;
