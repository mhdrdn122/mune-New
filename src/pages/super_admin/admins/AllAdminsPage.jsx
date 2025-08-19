// This file manages the Super Admin's view for managing other admin accounts.
// It provides an interface to list all admins, refresh the list, and add new admins.

import { useState } from "react";
import AdminsContainer from "../../../components/super_admin/admins/AdminsContainer";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import PageHeader from "../../../components/PageHeader/PageHeader";

// Breadcrumbs for navigation header
const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "المشرفين",
  },
].reverse();

// This function `AllAdminsPage` handles viewing and managing all system admins.
// It provides a header with action buttons and renders the AdminsContainer.
const AllAdminsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  return (
    <div>
      <PageHeader
        heading={"المشرفين"}
        buttonText={"إضافة "}
        onButtonClick={() => setShowAddAdmin(true)}
        requiredPermission={SuperPermissionsEnum.SUPER_ADMIN_ADD}
        setRefresh={setRefresh}
        refresh={refresh}
        breadcrumbs={breadcrumbs}
      />
      <AdminsContainer
        show={showAddAdmin}
        handleClose={() => setShowAddAdmin(false)}
        refresh={refresh}
      />
    </div>
  );
};

export default AllAdminsPage;
