// This file manages the Admin's invoices page, including filtering, downloading as Excel,
// and viewing invoice containers. It also supports waiter and table selection filters.

import { useEffect, useState } from "react";
import { PermissionsEnum } from "../../../constant/permissions";
import InvoicesContainer from "../../../components/Admin/invoices/InvoicesContainer";
import useRandomNumber from "../../../hooks/useRandomNumber";
import { useGetServicesQuery } from "../../../redux/slice/service/serviceApi";
import DateFilter from "../../../utils/DateFilter";
import { Grid, MenuItem, Select } from "@mui/material";
import notify from "../../../utils/useNotification";
import axios from "axios";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import { useGetTablesQuery } from "../../../redux/slice/tables/tablesApi";
import { baseURLPublicName } from "../../../Api/baseURL";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { Col, Row } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import SubAppBar from "../../../utils/SubAppBar";
import { transformToArrayOptions } from "../../../utils/transformToArrayOptions";
import { getEmployee } from "../../../Containers/EmployeesContainer/helpers";

/**
 * Admin Invoices Page Component
 *
 * @returns {JSX.Element} Component for viewing, filtering, and exporting invoice records.
 */
const InviocesPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [waiters, setWaiters] = useState([]);
  const [page, setPage] = useState(1);
  const [downloadExcelLoading, setDownloadExcelLoading] = useState(false);

  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);

  // Fetch waiters list from the API on mount
  useEffect(() => {
    /**
     * Fetches waiters from the backend and stores them in local state.
     */
    const fetchWaiters = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        const response = await axios.get(
          `${baseURLPublicName}/admin_api/show_waiters`,
          {
            headers: {
              Authorization: `Bearer ${adminInfo.token}`,
            },
          }
        );
        setWaiters(response.data); // Assumes response.data is an array of waiters
      } catch (error) {
        console.error("Error fetching waiters:", error);
      }
    };

    fetchWaiters();
  }, []);

  const { data: tables } = useGetTablesQuery({ page, refresh });
  const { data: employees } = getEmployee();
  /**
   * Handles downloading the filtered invoices as an Excel file.
   */
  const handleDownloadExcel = async () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const token = adminInfo?.token;

    if (!token) {
      notify("لم يتم العثور على التوكن. يرجى تسجيل الدخول مرة أخرى.", "error");
      return;
    }

    try {
      setDownloadExcelLoading(true);

      const response = await axios.get(
        `${baseURLLocalPublic}/admin_api/excel_invoice?date=${date}`,
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
      link.setAttribute("download", `Invoices_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      notify("فشل تحميل الملف", "error");
    } finally {
      setDownloadExcelLoading(false);
    }
  };

  const { data: services } = useGetServicesQuery({ refresh });
  console.log(employees);
  return (
    <div>
      <SubAppBar
        title=" الفواتير "
        showAddButton={true}
        showFilter={true}
        filters={[
          {
            id: "tables",
            label: "رقم الطاولة",
            options:
              tables?.data &&
              transformToArrayOptions(tables?.data, {
                label: "number_table",
                value: "id",
              }),
            initialValue: "",
          },
          {
            id: "admins",
            label: "الموظف ",
            options:
              tables?.data &&
              transformToArrayOptions(employees?.data, {
                label: "name",
                value: "id",
              }),
            initialValue: "",
          },
        ]}
        onFilterChange={(filterValues) => {
          if (filterValues?.tables) setSelectedTableId(filterValues?.tables);

          if (filterValues?.admins) setSelectedAdminId(filterValues?.admins);
        }}
        showSingleDateSearch={true}
        onSingleDateSearch={(date) => setDate(date)}
        onAdd={() => setShowAdd(true)}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        showDownloadButton={true}
        onDownloadExcel={handleDownloadExcel}
        requiredPermission={{
          Add: PermissionsEnum.ORDER_ADD,
        }}
      />

      {/* Filter Toggle */}
      {/* <Row
        className="d-flex justify-content-between container"
        style={{ flexDirection: "row-reverse" }}
      >
        <Col className="d-flex align-items-center px-4 gap-2">
          <div
            className="p-2 rounded d-flex align-items-center justify-content-center mb-3"
            style={{ cursor: "pointer", background: "#1F2A40" }}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <FaFilter color="#FFF" size={20} />
          </div>
        </Col>
      </Row> */}

    

      {/* Invoices Container */}
      <InvoicesContainer
        show={showAdd}
        handleClose={() => setShowAdd(false)}
        refresh={refresh}
        services={services}
        date={date}
        selectedTableId={selectedTableId}
        selectedAdminId={selectedAdminId}
        tables={tables}
      />
    </div>
  );
};

export default InviocesPage;
