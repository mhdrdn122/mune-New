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
 import { ToastContainer } from "react-toastify";
 import SubAppBar from "../../../utils/SubAppBar";

 
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
    

      <SubAppBar
        title=" المدن "
        showAddButton={true}
        onAdd={() => setShowAddCity(true)}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add: true,
        }}
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
