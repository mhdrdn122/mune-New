import React, { useState } from "react";
import Header from "../../../utils/Header";
import MenuContainer from "../../../components/super_admin/menuTemplate/MenuContainer";
import Breadcrumb from "../../../utils/Breadcrumb";
import PackagesContainer from "../../../components/super_admin/packages/PackagesContainer";
import { ToastContainer } from "react-toastify";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";



const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "الحزم",
  },
].reverse();

const PackagesPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const handleShowAddMenu = () => {
    setShowAddMenu(true);
  };
  const handleCloseAddMenu = () => {
    setShowAddMenu(false);
  };

  

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header
        heading={"الحزم"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAddMenu}
        requiredPermission={SuperPermissionsEnum.PACKAGE_ADD}
        setRefresh={()=>{}}
        refreshRandomNumber={refreshRandomNumber}
      />

      <PackagesContainer show={showAddMenu} handleClose={handleCloseAddMenu} randomNumber={randomNumber} />
      
    </div>
  );
};

export default PackagesPage;
