// This file manages the admin interface for displaying and paginating restaurant managers (RestsManager).

import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import RestsManagerContainer from "../../../components/Admin/RestsManager/RestsManagerContainer";
import { useSelector, useDispatch } from "react-redux";
import { getAllRestsManagerAction } from "../../../redux/slice/restsManager/ratesManagerSlice";
import { ToastContainer } from "react-toastify";
import { PermissionsEnum } from "../../../constant/permissions";

// Breadcrumb navigation path for the page
const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: "المطاعم",
  },
].reverse();

/**
 * `RestsManager` component is the main container for listing restaurant managers.
 * It dispatches Redux actions to fetch paginated restaurant manager data,
 * handles page changes, displays breadcrumbs, page headers, and notifies on errors.
 * 
 * @returns {JSX.Element} Admin interface for managing and viewing restaurant managers.
 */
const RestsManager = () => {
  const [page, setPage] = useState(1);  // Current page number for pagination
  const dispatch = useDispatch();       // Redux dispatcher

  // Extracts restaurant manager state from Redux store
  const { restsManager, loading, error, status } = useSelector(
    (state) => state.restsManager
  );

  /**
   * Fetches the restaurant manager data for the current page.
   * This action is dispatched only if the Redux state is idle.
   */
  const fetchData = async () => {
    await dispatch(getAllRestsManagerAction(page));
  };

  // On mount or when `page` changes, fetch the data if status is idle
  useEffect(() => {
    if (status === "idle") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  return (
    <div style={{ padding: '20px' }}>
      {/* Display error alert if there's an error */}
      {error && (
        <div
          className="alert alert-danger"
          style={{ textAlign: " left" }}
          role="alert"
        >
          {error.message}
        </div>
      )}

      {/* Breadcrumb navigation bar */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Page header */}
      <Header heading={"المطاعم"} />
 
      {/* Renders the container with restaurant manager cards or list */}
      <RestsManagerContainer
        restsManager={restsManager}
        loading={loading}
        setPage={setPage}
        page={page}
      />

      {/* Toast container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default RestsManager;
