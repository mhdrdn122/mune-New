// This file manages admin-related interfaces or functionality.

import "./ProfilePage.css";
 import ProfileDetails from "../../../components/Admin/profile/ProfileDetails";
 import SubAppBar from "../../../utils/SubAppBar";
 
 const ProfilePage = () => {
  return (
    <div> 

      <SubAppBar
      title="الملف الشخصي"
       />

      <div className="profile-forms">
        <ProfileDetails />
      </div>
    </div>
  );
};

export default ProfilePage;
