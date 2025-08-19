/**
 * This component represents the "Emojis Page" for the super admin dashboard.
 * It allows viewing and adding emoji items through the `EmojisContainer` component.
 * 
 * Features:
 * - Displays breadcrumb navigation and page header
 * - Supports permission-based rendering of the "Add Emoji" button
 * - Manages modal visibility for adding new emoji
 * - Uses a random number hook to trigger data refreshes
 */

import React, { useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import EmojisContainer from "../../../components/super_admin/emojis/EmojisContainer";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";

// Breadcrumb navigation for the emojis page
const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "الرموز التعبيرية",
  },
].reverse();

// This component renders the Emojis management interface for super admins.
const EmojisPage = () => {
  // Hook to generate a random number for triggering refreshes
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);

  // Local state to control visibility of the add emoji modal
  const [showAddEmoji, setShowAddEmoji] = useState(false);

  // Show the add emoji modal
  const handleShowAddEmoji = () => {
    setShowAddEmoji(true);
  };

  // Close the add emoji modal
  const handleCloseAddEmoji = () => {
    setShowAddEmoji(false);
  };

  return (
    <div>
      {/* Breadcrumb navigation component */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Page header with action button */}
      <Header
        heading={"الرموز التعبيرية"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAddEmoji}
        requiredPermission={SuperPermissionsEnum.EMOJI_ADD}
        setRefresh={() => {}} // not used in this page
        refreshRandomNumber={refreshRandomNumber}
      />

      {/* Main emoji list and add modal container */}
      <EmojisContainer
        show={showAddEmoji}
        handleClose={handleCloseAddEmoji}
        randomNumber={randomNumber}
      />
    </div>
  );
};

export default EmojisPage;
