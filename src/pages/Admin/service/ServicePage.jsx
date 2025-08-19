// This component manages the services page within the admin interface.
// It renders a list of services and provides functionality to add a new one.

import { useState } from 'react';
import { PermissionsEnum } from '../../../constant/permissions';
import useRandomNumber from '../../../hooks/useRandomNumber';
import ServicesContainer from '../../../Containers/Service/ServicesContainer';
import PageHeader from '../../../components/PageHeader/PageHeader';

// Breadcrumbs to be shown in the header for navigation context
const breadcrumbs = [
  {
    label: "الأصناف",
    to: "/admin",
  },
  {
    label: " الخدمات",
  },
].reverse();

/**
 * `ServicePage` is a React component responsible for displaying and managing the services section.
 * It allows the user to view and add new services, and triggers re-rendering when necessary.
 *
 * @returns {JSX.Element} The rendered services management page.
 */
const ServicePage = () => {
  const [showAdd, setShowAdd] = useState(false); // Controls visibility of the "Add Service" modal
  const [refresh, setRefresh] = useState(false); // Triggers refresh for any external state if needed
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100); // Triggers data refresh when needed

  return (
    <div>
      <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"الخدمات"}
        buttonText={"إضافة "}
        onButtonClick={() => setShowAdd(true)}
        requiredPermission={PermissionsEnum.SERVICE_ADD}
        setRefresh={setRefresh}
        refresh={refresh}
        refreshRandomNumber={refreshRandomNumber}
      />

      <ServicesContainer
        show={showAdd}
        handleClose={() => setShowAdd(false)}
        refresh={randomNumber}
      />
    </div>
  );
};

export default ServicePage;
