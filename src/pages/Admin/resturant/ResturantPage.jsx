// This file manages admin-related interfaces or functionality for the restaurant profile page.
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import "./ResturantPage.css";
import AccountProfileDetails from "../../../components/Admin/profile/AccountProfileDetails";
import Breadcrumb from "../../../utils/Breadcrumb";
import ava from "../../../assets/bg.png";
import { useSelector, useDispatch } from "react-redux";
import { getAdminDetailsAction } from "../../../redux/slice/auth/authSlice";
import ResturantDetails from "../../../components/Admin/restaurant/ResturantDetails";

// Breadcrumbs for navigation at the top of the page
const breadcrumbs = [
  { label: "الرئيسية", to: "/admin" },
  { label: "الملف الشخصي" },
].reverse();

/**
 * ResturantPage renders the admin's restaurant profile section.
 * It loads admin details and passes them to the `ResturantDetails` component.
 *
 * @returns {JSX.Element} The rendered restaurant profile page
 */
const ResturantPage = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  // Extract admin info from localStorage
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  // Fetch admin profile details on mount
  useEffect(() => {
    getProfileDetails();
  }, [dispatch]);

  // Fetches profile data for the current admin
  const getProfileDetails = async () => {
    await dispatch(getAdminDetailsAction({ page: "", id: adminInfo.id }));
  };

  // Get the current admin details from the Redux store
  const { details, loading, error } = useSelector(
    (state) => state.auth.adminDetails
  );

  // Update local state when new details arrive
  useEffect(() => {
    setData(details.data);
  }, [details]);
console.log(data)
  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Conditional UI: Show loading or profile details */}
      {loading ? (
        <div className="w-100 text-center mt-5">Loading...</div>
      ) : (
        <div className="profile-forms">
          <ResturantDetails item={data} getProfileDetails={getProfileDetails} />
        </div>
      )}
    </>
  );
};

export default ResturantPage;
