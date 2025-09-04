import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import LoginUserModal from "./LoginUserModal";
import { Box, Tabs, Tab, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdminContext } from "../../context/AdminProvider";
import NavBarUser from "./NavBarUser";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { ToastContainer } from "react-toastify";
import { LanguageContext } from "../../context/LanguageProvider";
import { UserProfileCard } from "./UserProfileCard";
import PasswordEdit from "./PasswordEdit";
import ProfileDetailsForm from "./ProfileDetailsForm";
import { MdLanguage } from "react-icons/md";
import DynamicSkeleton from "../DynamicSkeletonProps";

const TabCard = styled(Card)(({ theme }) => ({
  maxWidth: "600px",
  width: "90%",
  margin: "auto",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  padding: theme.spacing(3),
}));

const UserProfile = () => {
  const { userToken } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { adminDetails } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const [userInf, setUserInf] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });
  const [name1, setName1] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const getProfileInf = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${baseURLLocalPublic}/user_api/show_profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const userInf = response?.data?.data;
      setUserInf(userInf);
      setName1(userInf?.name);
      setUserName(userInf?.username);
      setEmail(userInf?.email);
      setNumber(userInf?.phone);
      setLoading(false)

    } catch (error) {
      console.log("error of received Profile info : ", error);
      setLoading(false)

    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    setShowLoginModal(!userToken);
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      getProfileInf();
    }
  }, [userToken]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className=" ">
      <NavBarUser />
      <div
        className="h-[1200px]  pt-20 md:h-auto"
        style={{
          minHeight: "100vh",
          width: "100%",
          // padding: "20px 0",
          ...(adminDetails?.background_image_category &&
            adminDetails?.image_or_color
            ? {
              backgroundImage: `url(${adminDetails?.background_image_category})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
            : {
              backgroundColor: `#${adminDetails?.background_color?.substring(
                10,
                16
              )}`,
            }),
        }}
      >
        {userToken ? (
          <Box sx={{ p: 2 }}>
            {
              loading ?
                (
                  <div className="m-auto w-full md:w-[50%]">

                    <DynamicSkeleton
                      count={1}
                      variant="rounded"
                      height={50}
                      animation="wave"
                      spacing={3}
                      columns={{ xs: 12, sm: 12, md: 12 }}

                    />
                  </div>
                ) : (
                  <div className="flex justify-between items-center  capitalize   w-full md:w-[50%] m-auto  my-2 p-2 ">
                    <h3>personal profile</h3>

                    <span className="flex items-center">
                      <button
                        onClick={() =>
                          toggleLanguage(language === "en" ? "ar" : "en")
                        }
                        className="p-0 border-0 bg-transparent cursor-pointer flex items-center"
                        aria-label="Toggle language"
                      >
                        <MdLanguage size={24} className="text-black mr-1" />
                        <span className="text-black font-medium">
                          {language === "en" ? "EN" : "AR"}
                        </span>
                      </button>
                    </span>
                  </div>
                )
            }


            <UserProfileCard
              userInfo={userInf}
              adminDetails={adminDetails}
              loading={loading}
            />

            {
              loading ? (<div className="m-auto my-2 w-full md:w-[50%]  ">

                <DynamicSkeleton
                  count={1}
                  variant="rounded"
                  height={350}
                  animation="wave"
                  spacing={3}
                  columns={{ xs: 12, sm: 12, md: 12 }}

                />


              </div>) : (
                <TabCard
                  sx={{
                    backgroundColor: "#b1afaf",
                    width: "100%",
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: `#${adminDetails?.color?.substring(
                          10,
                          16
                        )}`,
                        height: 0,
                      },
                      mb: 3,
                    }}
                  >
                    <Tab
                      label="تعديل الملف الشخصي"
                      sx={{
                        fontWeight: "bold",
                        borderRadius: "50px",
                        "&.Mui-selected": {
                          backgroundColor: `#${adminDetails?.color?.substring(
                            10,
                            16
                          )}`,
                          color: "#fff",
                          textDecoration: "none",
                        },
                      }}
                    />
                    <Tab
                      label="تغيير كلمة المرور"
                      sx={{
                        fontWeight: "bold",
                        borderRadius: "50px",

                        "&.Mui-selected": {
                          backgroundColor: `#${adminDetails?.color?.substring(
                            10,
                            16
                          )}`,
                          color: "#fff",
                          textDecoration: "none",
                        },
                      }}
                    />
                  </Tabs>

                  {tabValue === 0 && (
                    <ProfileDetailsForm
                      setNumber={setNumber}
                      name1={name1}
                      setName1={setName1}
                      userToken={userToken}
                      username={userName}
                      email={email}
                      number={number}
                      setUserName={setUserName}
                      setEmail={setEmail}
                      getProfileInf={getProfileInf}
                    />
                  )}

                  {tabValue === 1 && (
                    <PasswordEdit
                      userToken={userToken}
                      oldPassword={oldPassword}
                      newPassword={newPassword}
                      confirmPassword={confirmPassword}
                      setOldPassword={setOldPassword}
                      setNewPassword={setNewPassword}
                      setConfirmPassword={setConfirmPassword}
                    />
                  )}
                </TabCard>)
            }


          </Box>
        ) : (
          <LoginUserModal
            show={showLoginModal}
            handleClose={handleCloseModal}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
