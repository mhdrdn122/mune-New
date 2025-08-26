// This file manages admin-related interfaces or functionality for the restaurant profile page.
import { useEffect, useState } from "react";
import "./ResturantPage.css";
import { useSelector, useDispatch } from "react-redux";
import { getAdminDetailsAction } from "../../../redux/slice/auth/authSlice";
import ResturantDetails from "../../../components/Admin/restaurant/ResturantDetails";
import SubAppBar from "../../../utils/SubAppBar";
import DynamicSkeleton from "../../../utils/DynamicSkeletonProps";
import { Skeleton } from "@mui/material";

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
    setData(adminInfo || details.data);
  }, [details]);

  if (loading) {
    return (
      <div className="flex flex-col justify-start gap-3  my-5 ">
        <div className="flex  justify-between gap-2 flex-wrap">
          <div className="w-full md:w-[65%]">
            <Skeleton
              variant={"rounded"}
              height={250}
              animation={"wave"}
              width={"100%"}
            />
          </div>

          <div className="w-full md:w-[33%]">
            <Skeleton
              variant={"rounded"}
              height={250}
              animation={"wave"}
              width={"100%"}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2  flex-wrap">
          <div className="w-full md:w-[32%]">
            <Skeleton
              variant={"rounded"}
              height={450}
              animation={"wave"}
              width={"100%"}
            />
          </div>

          <div className="w-full md:w-[32%]">
            <Skeleton
              variant={"rounded"}
              height={450}
              animation={"wave"}
              width={"100%"}
            />
          </div>

          <div className="w-full md:w-[32%]">
            <Skeleton
              variant={"rounded"}
              height={450}
              animation={"wave"}
              width={"100%"}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubAppBar title=" معلومات المطعم" />
      <div className="profile-forms">
        <ResturantDetails item={data} getProfileDetails={getProfileDetails} />
      </div>
      
    </>
  );
};

export default ResturantPage;
