import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuthState } from "../../redux/slice/super_admin/auth/authSlice";
import DynamicSkeleton from "../DynamicSkeletonProps";

export const UserProfileCard = ({ userInfo, adminDetails, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const username = localStorage.getItem("name_url");
    console.log(username);
    if (username) {
      await dispatch(resetAuthState());
      navigate(`/${username}/takeout/register`);
    }
  };

  if (loading) {
    return (
      <div className="m-auto my-2 w-full md:w-[50%]  ">

        <DynamicSkeleton
          count={1}
          variant="rounded"
          height={350}
          animation="wave"
          spacing={3}
          columns={{ xs: 12, sm: 12, md: 12 }}

        />


      </div>
    )
  }

  return (
    <div
      style={{
        border: "1px solid green",
        borderRadius: "20px",
        fontStyle: "italic",
      }}
      className="w-full max-w-2xl mx-auto   rounded-3xl my-4 p-4 md:p-6 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center sm:items-start gap-4 w-full sm:w-1/3">
          <img
            className="w-24 h-24 rounded-full object-cover"
            src="https://img.icons8.com/fluency/48/user-female-circle.png"
            alt="user-profile"
          />

          <button
            style={{
              border: "1px solid red",
              borderRadius: "20px",
              fontStyle: "italic",
              color: `#${adminDetails?.color?.substring(10, 16)}`,
              borderColor: `#${adminDetails?.color?.substring(10, 16)}`,
            }}
            className={`px-6 py-2   hover:bg-red-500  hover:text-white transition-colors duration-300 w-full sm:w-auto`}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-2">
              <Typography
                variant="body2"
                color="text.secondary"
                className="!text-sm md:!text-base min-w-[80px]"
              >
                Full Name:
              </Typography>
              <Typography variant="body1" className="!text-sm md:!text-base">
                {userInfo?.name}
              </Typography>
            </div>

            <div className="flex items-start gap-2">
              <Typography
                variant="body2"
                color="text.secondary"
                className="!text-sm md:!text-base min-w-[80px]"
              >
                Username:
              </Typography>
              <Typography variant="body1" className="!text-sm md:!text-base">
                {userInfo?.username}
              </Typography>
            </div>

            <div className="flex items-start gap-2">
              <Typography
                variant="body2"
                color="text.secondary"
                className="!text-sm md:!text-base min-w-[80px]"
              >
                Email:
              </Typography>
              <Typography
                variant="body1"
                className="!text-sm md:!text-base break-all"
              >
                {userInfo?.email}
              </Typography>
            </div>

            <div className="flex items-start gap-2">
              <Typography
                variant="body2"
                color="text.secondary"
                className="!text-sm md:!text-base min-w-[80px]"
              >
                Phone:
              </Typography>
              <Typography variant="body1" className="!text-sm md:!text-base">
                {userInfo?.phone}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
