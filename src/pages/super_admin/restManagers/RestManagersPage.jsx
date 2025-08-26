import React, { useId, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import RestManagersContainer from "../../../components/super_admin/restManagers/RestManagersContainer";
import { ToastContainer } from "react-toastify";
import useRandomNumber from "../../../hooks/useRandomNumber";
import SubAppBar from "../../../utils/SubAppBar";

const RestManagersPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const handleShowAddAdmin = () => {
    setShowAddAdmin(true);
  };
  const handleCloseAddAdmin = () => {
    setShowAddAdmin(false);
  };
  
  return (
    <div> 

      <SubAppBar
        title=" مدراء المطاعم "
        showAddButton={true}
        showRefreshButton={true}
        setRefresh={refreshRandomNumber}
        refresh={randomNumber}
        onAdd={handleShowAddAdmin}
        requiredPermission={{
          Add: SuperPermissionsEnum.USER_ADD,
        }}
      />

      <RestManagersContainer
        show={showAddAdmin}
        handleClose={handleCloseAddAdmin}
        randomNumber={randomNumber}
      />
    </div>
  );
};

export default RestManagersPage;
