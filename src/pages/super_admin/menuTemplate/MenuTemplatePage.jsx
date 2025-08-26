import React, { useState } from "react";
import Header from "../../../utils/Header";
import MenuContainer from "../../../components/super_admin/menuTemplate/MenuContainer";
import Breadcrumb from "../../../utils/Breadcrumb";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";
import SubAppBar from "../../../utils/SubAppBar";

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
      <SubAppBar
        title=" القوائم  "
        showAddButton={true}
        showRefreshButton={true}
        setRefresh={refreshRandomNumber}
        refresh={randomNumber}
        onAdd={handleShowAddMenu}
        requiredPermission={{
          Add: SuperPermissionsEnum.MENU_ADD,
        }}
      />

      <MenuContainer
        show={showAddMenu}
        handleClose={handleCloseAddMenu}
        randomNumber={randomNumber}
      />
    </div>
  );
};

export default MenuTemplatePage;
