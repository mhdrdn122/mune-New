// This component renders the deliveries (drivers) management page for the admin panel.
// It allows adding new drivers and displays a list of current ones with support for refresh logic.

import { useState } from "react";
import useRandomNumber from "../../../hooks/useRandomNumber";
import DeliveriesContainer from "../../../Containers/DriversContainer/DeliveriesContainer";
import { PermissionsEnum } from "../../../constant/permissions";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { ToastContainer } from "react-toastify";
import SubAppBar from "../../../utils/SubAppBar";

 
// Renders the main deliveries (drivers) management interface for admin users
const DeliveriesPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100); // For triggering refresh
  const [refresh, setRefresh] = useState(false); // Tracks manual refresh toggling
  const [showAddDriver, setShowAddDriver] = useState(false); // Controls visibility of add driver modal
  const [role, setRole] = useState(""); // Holds the selected user role if needed for filtering
  const [mode, setMode] = useState(false);

  return (
    <div>
     

      <SubAppBar
        title=" معلومات السائقين"
        showViewToggle={true}
        onViewToggle={() => setMode((prev) => !prev)}
        viewMode={mode}
        showAddButton={true}
        onAdd={() => setShowAddDriver(true)}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add:PermissionsEnum.USER_ADD
        }}
      />
      <DeliveriesContainer
        show={showAddDriver}
        handleClose={() => setShowAddDriver(false)}
        refresh={randomNumber}
        role={role}
        mode={mode}
      />
      <ToastContainer />
    </div>
  );
};

export default DeliveriesPage;
