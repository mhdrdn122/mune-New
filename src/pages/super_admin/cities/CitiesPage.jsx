/**
 * This component `CitiesPage` serves as the main page for managing cities
 * within the Super Admin dashboard.
 *
 * Functionalities include:
 * - Viewing the list of cities.
 * - Adding a new city (based on permission).
 * - Refreshing the data after changes (e.g., add/delete).
 *
 * @returns {JSX.Element} Rendered page containing the city management interface.
 */

import { useState } from "react";
import CitiesContainer from "../../../Containers/CitiesContainer/CitiesContainer";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import { ToastContainer } from "react-toastify";
import PageHeader from "../../../components/PageHeader/PageHeader";

// Breadcrumb navigation shown at the top of the page
const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "المدن",
  },
].reverse();

const CitiesPage = () => {
  // Trigger re-fetching of cities when needed
  const [refresh, setRefresh] = useState(false);

  // Controls the visibility of the "Add City" modal
  const [showAddCity, setShowAddCity] = useState(false);

  // Show the Add City modal
  const handleShowAddCity = () => {
    setShowAddCity(true);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"المدن"}
        buttonText={"إضافة مدينة"}
        onButtonClick={handleShowAddCity}
        requiredPermission={SuperPermissionsEnum.CITY_ADD}
        setRefresh={setRefresh}
        refresh={refresh}
      />

      <CitiesContainer
        show={showAddCity}
        handleClose={() => setShowAddCity(false)}
        refresh={refresh}
      />

      <ToastContainer />
    </div>
  );
};

export default CitiesPage;
