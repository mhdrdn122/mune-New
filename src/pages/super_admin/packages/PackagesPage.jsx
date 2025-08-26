import React, { useState } from "react";
import Header from "../../../utils/Header";
import MenuContainer from "../../../components/super_admin/menuTemplate/MenuContainer";
import Breadcrumb from "../../../utils/Breadcrumb";
import PackagesContainer from "../../../components/super_admin/packages/PackagesContainer";
import { ToastContainer } from "react-toastify";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";
import SubAppBar from "../../../utils/SubAppBar";

const PackagesPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const handleShowAddMenu = () => {
    setShowAddPackage(true);
  };
  const handleCloseAddMenu = () => {
    setShowAddPackage(false);
  };

  return (
    <div>
      <SubAppBar
        title=" الحزم  "
        showAddButton={true}
        showRefreshButton={true}
        setRefresh={refreshRandomNumber}
        refresh={randomNumber}
        onAdd={handleShowAddMenu}
        requiredPermission={{
          Add: SuperPermissionsEnum.PACKAGE_ADD,
        }}
      />

      <PackagesContainer
        show={showAddPackage}
        handleClose={handleCloseAddMenu}
        randomNumber={randomNumber}
      />
    </div>
  );
};

export default PackagesPage;
