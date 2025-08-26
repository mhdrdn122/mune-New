import { useEffect, useState } from "react";
import useRandomNumber from "../../hooks/useRandomNumber";
import PageHeader from "../../components/PageHeader/PageHeader";
import { Grid } from "@mui/material";
import SelectFilter from "../../utils/SelectFilter";
import DateFilter from "../../utils/DateFilter";
import { PermissionsEnum } from "../../constant/permissions";
import EmployeesContainer from "../../Containers/EmployeesContainer/EmployeesContainer";
import SubAppBar from "../../utils/SubAppBar";
import { getTypes } from "../../Containers/EmployeesContainer/helpers";

/**
 * Page Component - Employee Management View
 *
 * Renders a full employee management page with:
 * - Page header (breadcrumb, button, permissions)
 * - Filters (role, date range)
 * - Employee list container
 *
 * @param {Object} props
 * @param {boolean} props.isSuperAdmin - Whether the user is a super admin
 * @param {Array} props.breadCrumbs - Array of breadcrumb navigation elements
 */
const Page = ({ isSuperAdmin, breadCrumbs }) => {
  // Controls visibility of the "Add Employee" modal
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // Generates a random number to trigger refresh of EmployeesContainer
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);

  // Explicit flag to trigger refresh (used for PageHeader)
  const [refresh, setRefresh] = useState(false);

  // Filters
  const [role, setRole] = useState(""); // Role filter
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter

  const [mode, setMode] = useState(false);

  // Debugging: Log when modal open state changes
  useEffect(() => {
    console.log("showAddEmployeeModal", showAddEmployeeModal);
  }, [showAddEmployeeModal]);

  const { data: types } = getTypes(false);
  const optionTypes = types?.data?.map((type, ind) => {
    return {
      value: type?.id,
      label: type?.name,
    };
  });

  return (
    <div>
      <SubAppBar
        title=" معلومات الموظفين"
        showViewToggle={true}
        showFilter={true}
        filters={[
          {
            id: "type",
            label: "النوع",
            options: optionTypes && optionTypes,
            initialValue: "",
          },
        ]}
        onFilterChange={(filterValues) => {
          setRole(filterValues?.type);
        }}
        onViewToggle={() => setMode((prev) => !prev)}
        viewMode={mode}
        showAddButton={true}
        onAdd={() => setShowAddEmployeeModal(true)}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add: PermissionsEnum.USER_ADD,
        }}
      />

      {/* Filter Section */}
      {/* <Grid
        container
        flexDirection={"row-reverse"}
        spacing={2}
        marginBottom={2}
      >
        <Grid item xs={12} sm={4} md={3}>
          <DateFilter
            value={startDate}
            setValue={setStartDate}
            name="startDate"
            label="Start Date"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <DateFilter
            value={endDate}
            setValue={setEndDate}
            name="endDate"
            label="End Date"
          />
        </Grid>
      </Grid> */}

      {/* Employee List with filters and modal state passed down */}
      <EmployeesContainer
        showForm={showAddEmployeeModal}
        handleClose={() => setShowAddEmployeeModal(false)}
        refresh={randomNumber}
        role={role}
        startDate={startDate}
        endDate={endDate}
        isSuperAdmin={isSuperAdmin}
        mode={mode}
      />
    </div>
  );
};

export default Page;
