import React, { useState } from "react";
import Header from "../../../utils/Header";
import MenuContainer from "../../../components/super_admin/menuTemplate/MenuContainer";
import Breadcrumb from "../../../utils/Breadcrumb";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";



const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "القوائم",
  },
].reverse();

const MenuTemplatePage = () => {
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
        heading={"القوائم"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAddMenu}
        requiredPermission={SuperPermissionsEnum.MENU_ADD}
        setRefresh={()=>{}}
        refreshRandomNumber={refreshRandomNumber}
      />

      <MenuContainer show={showAddMenu} handleClose={handleCloseAddMenu} randomNumber={randomNumber}/>
    </div>
  );
};

export default MenuTemplatePage;
