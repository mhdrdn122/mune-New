// This file manages admin-related interfaces or functionality.

import "./ProfilePage.css";
import Breadcrumb from "../../../utils/Breadcrumb";
import ProfileDetails from "../../../components/Admin/profile/ProfileDetails";
import Header from "../../../utils/Header";

const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: "الملف الشخصي",
  },
].reverse();

// This function `ProfilePage` handles a specific functionality in this module.
const ProfilePage = () => {
  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header heading={"تعديل الملف الشخصي"} />

      <div className="profile-forms">
        <ProfileDetails />
      </div>
    </div>
  );
};

export default ProfilePage;
