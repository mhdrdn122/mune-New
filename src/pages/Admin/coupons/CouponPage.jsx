/**
 * CouponPage.jsx
 *
 * This file manages admin-related interfaces or functionality.
 * It is responsible for rendering the main coupon management page.
 * The page includes:
 * - Page header with breadcrumbs and a button to add a new coupon.
 * - A container for viewing and managing coupons.
 */

import { useState } from "react";
import { PermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";
import CouponsContainer from "../../../Containers/CouponsContainer/CouponsContainer";
 import SubAppBar from "../../../utils/SubAppBar";

 
/**
 * CouponPage
 *
 * This is the main component for displaying and managing coupons.
 * It includes the ability to:
 * - Open the add coupon dialog
 * - Refresh coupon data on demand
 * - Pass user role for filtering (if required)
 */
const CouponPage = () => {
  const [showAddCoupon, setShowAddCoupon] = useState(false); // Modal visibility
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100); // Used to trigger data refresh
  const [refresh, setRefresh] = useState(false); // Global refresh state
  const [role, setRole] = useState("");
  const [mode, setMode] = useState(false); // Role filter (currently not used actively)

  return (
    <div>
      

      <SubAppBar
        title=" الكوبونات "
        showAddButton={true}
        showViewToggle={true}
        onViewToggle={() => setMode((prev) => !prev)}
        viewMode={mode}
        onAdd={() => setShowAddCoupon(true)}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add: PermissionsEnum.USER_ADD,
        }}
      />

      <CouponsContainer
        show={showAddCoupon}
        handleClose={() => setShowAddCoupon(false)}
        refresh={randomNumber}
        role={role}
        mode={mode}
      />
    </div>
  );
};

export default CouponPage;
