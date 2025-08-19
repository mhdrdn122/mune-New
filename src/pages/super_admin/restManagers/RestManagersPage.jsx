import React, { useId, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import RestManagersContainer from "../../../components/super_admin/restManagers/RestManagersContainer";
import { ToastContainer } from "react-toastify";
import useRandomNumber from "../../../hooks/useRandomNumber";

const RestManagersPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const handleShowAddAdmin = () => {
    setShowAddAdmin(true);
  };
  const handleCloseAddAdmin = () => {
    setShowAddAdmin(false);
  };
  const breadcrumbs = [
    {
      label: "الرئيسية",
      to: "/super_admin",
    },
    {
      label: "مدراء المطاعم",
    },
  ].reverse();

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header
        heading={"مدراء المطاعم"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAddAdmin}
        requiredPermission={SuperPermissionsEnum.USER_ADD}
        setRefresh={()=>{}}
        refreshRandomNumber={refreshRandomNumber}
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
