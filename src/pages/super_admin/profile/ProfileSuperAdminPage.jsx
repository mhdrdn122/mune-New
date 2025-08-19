import Breadcrumb from '../../../utils/Breadcrumb';
import Header from '../../../utils/Header';
import ProfileData from '../../../components/super_admin/profile/ProfileData';


const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/super_admin",
  },
  {
    label: "الملف الشخصي",
  },
].reverse();

const ProfileSuperAdminPage = () => {
  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header
        heading={"تعديل الملف الشخصي"}
      />
      <ProfileData />
    </div>
  )
}

export default ProfileSuperAdminPage
