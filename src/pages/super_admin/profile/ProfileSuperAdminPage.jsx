import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import ProfileData from "../../../components/super_admin/profile/ProfileData";
import SubAppBar from "../../../utils/SubAppBar";

 

const ProfileSuperAdminPage = () => {
  return (
    <div>
    
      <SubAppBar title=" تعديل الملف الشخصي  " />
      <ProfileData />
    </div>
  );
};

export default ProfileSuperAdminPage;
