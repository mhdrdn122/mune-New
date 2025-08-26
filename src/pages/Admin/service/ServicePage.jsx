// This component manages the services page within the admin interface.
// It renders a list of services and provides functionality to add a new one.

import { useState } from "react";
import { PermissionsEnum } from "../../../constant/permissions";
 import ServicesContainer from "../../../Containers/Service/ServicesContainer";
import SubAppBar from "../../../utils/SubAppBar";

 
/**
 * `ServicePage` is a React component responsible for displaying and managing the services section.
 * It allows the user to view and add new services, and triggers re-rendering when necessary.
 *
 * @returns {JSX.Element} The rendered services management page.
 */
const ServicePage = () => {
  const [showAdd, setShowAdd] = useState(false); // Controls visibility of the "Add Service" modal
  const [refresh, setRefresh] = useState(false); // Triggers refresh for any external state if needed

  return (
    <div>
      <SubAppBar
        title=" الخدمات"
        showAddButton={true}
        showRefreshButton={true}
        onAdd={() => setShowAdd(true)}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add: PermissionsEnum.USER_ADD,
        }}
      />

      <ServicesContainer
        show={showAdd}
        handleClose={() => setShowAdd(false)}
        refresh={refresh}
      />
    </div>
  );
};

export default ServicePage;
