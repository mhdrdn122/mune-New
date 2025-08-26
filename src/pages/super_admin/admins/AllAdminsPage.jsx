// This file manages the Super Admin's view for managing other admin accounts.
// It provides an interface to list all admins, refresh the list, and add new admins.

import { useState } from "react";
import AdminsContainer from "../../../components/super_admin/admins/AdminsContainer";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import PageHeader from "../../../components/PageHeader/PageHeader";
import SubAppBar from "../../../utils/SubAppBar";
import { transformToArrayOptions } from "../../../utils/transformToArrayOptions";

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
      <SubAppBar
        title=" المشرفين "
        showAddButton={true}
        showRefreshButton={true}
        setRefresh={setRefresh}
        refresh={refresh}
        onAdd={() => setShowAddAdmin(true)}
        requiredPermission={{
          Add: SuperPermissionsEnum.SUPER_ADMIN_ADD,
        }}
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
