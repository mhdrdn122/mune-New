// This file manages admin-related interfaces or functionality related to news management.
// It renders a page for administrators to view, add, and refresh news content.

import { useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import NewsContainer from "../../../components/Admin/news/NewsContainer";
import AddNews from "../../../components/Admin/news/AddNews";
import { ToastContainer } from "react-toastify";
import { PermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";

// Breadcrumbs array to display navigation hierarchy at the top of the page
const breadcrumbs = [
  {
    label: "الأصناف",
    to: "/admin",
  },
  {
    label: "الاخبار",
  },
].reverse();

/**
 * NewsPage
 * React component that renders the News management interface for admins.
 * Includes:
 * - Breadcrumb navigation
 * - Header with "Add News" button
 * - NewsContainer to show all news
 * - Modal to add news
 * - Toast notifications
 * 
 * @returns {JSX.Element} The rendered News management page
 */
const NewsPage = () => {
  // randomNumber is used to trigger refresh of NewsContainer content
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);

  // Controls visibility of the AddNews modal
  const [showAdd, setShowAdd] = useState(false);

  // Controls refresh logic (optional for more specific control)
  const [refresh, setRefresh] = useState(false);

  /**
   * handleShowAdd
   * Opens the "Add News" modal
   */
  const handleShowAdd = () => {
    setShowAdd(true);
  };

  /**
   * handleCloseAdd
   * Closes the "Add News" modal
   */
  const handleCloseAdd = () => {
    setShowAdd(false);
  };

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />

      <Header
        heading={"الاخبار"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAdd}
        requiredPermission={PermissionsEnum.NEWS_ADD}
        setRefresh={setRefresh}
        refresh={refresh}
        refreshRandomNumber={refreshRandomNumber}
      />

      <NewsContainer
        show={showAdd}
        handleClose={handleCloseAdd}
        refresh={randomNumber}
      />

      <ToastContainer />
    </div>
  );
};

export default NewsPage;
