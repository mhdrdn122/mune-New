import { Box, Typography, useMediaQuery } from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";
import imageMenu from "../../assets/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Spinner } from "react-bootstrap";
import { MdEmojiEmotions } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import { SuperPermissionsEnum } from "../../constant/permissions";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BackupIcon from "@mui/icons-material/Backup";
import { AdminSidebarHook } from "../../hooks/superAdmin/adminSidebarHook";
import { FaFileContract } from "react-icons/fa6";
import { useShowSidebar } from "../../context/ShowSidebarProvider";

const Item = ({ title, to, icon, selected, setSelected, handleClick, loading }) => {
  const navigate = useNavigate();
  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        setSelected(title);
        handleClick();
        navigate(to);
      }}
      icon={icon}
      rootStyles={{ backgroundColor: "transparent" }}
    >
      <Typography className="!text-[#2F4B26] !font-extrabold p-2">
        {title} {loading && <Spinner animation="border" size="sm" />}
      </Typography>
    </MenuItem>
  );
};

const SuperAdminSidebar = () => {
  const [
    hasPermission,
    pathname,
    selected,
    setSelected,
    superAdminRoles,
    handleBackupDB,
    handleBackupImages,
    handleLogout,
    loadImgs,
    loadingBackupDb,
    loadingBackupImgs,
    loading2,
    handleContracts,
  ] = AdminSidebarHook();
  
  const { isCollapsed, setIsCollapsed } = useShowSidebar();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  // تعريف عناصر القائمة
  const menuItems = [
    {
      title: "المدن",
      to: "/super_admin",
      icon: <HomeOutlinedIcon />,
      permission: SuperPermissionsEnum.CITY_INDEX,
    },
    {
      title: "المشرفين",
      to: "/super_admin/admins",
      icon: <FaUsers />,
      permission: SuperPermissionsEnum.SUPER_ADMIN_INDEX,
    },
    {
      title: "مدراء المطاعم",
      to: "/super_admin/restaurants_managers",
      icon: <ManageAccountsOutlinedIcon />,
      permission: null, // لا يوجد شرط إذن لهذا العنصر
    },
    {
      title: "الرموز التعبيرية",
      to: "/super_admin/emojis",
      icon: <MdEmojiEmotions />,
      permission: SuperPermissionsEnum.EMOJI_INDEX,
    },
    {
      title: "القوائم",
      to: "/super_admin/menu_template",
      icon: <IoListSharp />,
      permission: SuperPermissionsEnum.MENU_INDEX,
    },
    {
      title: "الملف الشخصي",
      to: "/super_admin/profile",
      icon: <PersonIcon />,
      permission: null, // لا يوجد شرط إذن لهذا العنصر
    },
    {
      title: "الحزم",
      to: "/super_admin/packages",
      icon: <ClearAllOutlinedIcon />,
      permission: SuperPermissionsEnum.PACKAGE_INDEX,
    },
  ];

  // عناصر خاصة بـ superAdmin فقط
  const superAdminItems = [
    {
      title: "نسخة احتياطية للداتا بيز",
      to: pathname,
      icon: <BackupIcon />,
      handleClick: handleBackupDB,
      loading: loadingBackupDb,
    },
    {
      title: "نسخة احتياطية للصور",
      to: pathname,
      icon: <BackupIcon />,
      handleClick: handleBackupImages,
      loading: loadingBackupImgs,
    },
    {
      title: "عرض العقود",
      to: pathname,
      icon: <FaFileContract />,
      handleClick: () => handleContracts("show_contracts", "Contracts"),
      loading: loading2,
    },
  ];

  return (
    <Sidebar
      collapsed={isCollapsed && !isSmallDevice}
      toggled={isSmallDevice ? !isCollapsed : false}
      onBackdropClick={() => setIsCollapsed(true)}
      backgroundColor="#D9D9D9"
      rootStyles={{
        minHeight: "100vh",
        zIndex: 20,
        position: isSmallDevice ? "fixed" : "static",
        [isSmallDevice ? "right" : "static"]: isSmallDevice ? 0 : "auto",
        transform:
          isSmallDevice && isCollapsed ? "translateX(100%)" : "translateX(0)",
      }}
      rtl={true}
    >
      <Menu>
       <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            margin: "10px 0 20px 0",
            color: "#e0e0e0",
            textAlign: "center",
          }}
        >
          {/* {" "}
          <Typography variant="h5">SUPER AD0MIN</Typography> */}
        </MenuItem>
        {!isCollapsed && (
          <Box mb="25px">
            <Box
              sx={{
                borderRadius: "50% 0 0 50%",
                width: "170px !important",
                height: "148px !important",
                position: "relative",
              }}
              display="flex"
              className="bg-[#2F4B26]  "
              justifyContent="flex-start"
              alignItems="center"
            >
              <div>
                <img
                  alt="profile-user"
                  src={imageMenu}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    objectFit: "cover",
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    border: "3px solid #fff",
                    width: "100px ",
                    height: "100px",
                  }}
                />
              </div>
            </Box>
          </Box>
        )}
        <Box>
          {menuItems.map((item) => (
            (!item.permission || hasPermission(item.permission)) && (
              <Item
                key={item.title}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                handleClick={() => {}}
              />
            )
          ))}

          {superAdminRoles && superAdminRoles[0]?.name === "superAdmin" && (
            superAdminItems.map((item) => (
              <Item
                key={item.title}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                handleClick={item.handleClick}
                loading={item.loading}
              />
            ))
          )}

          <Item
            title="تسجيل الخروج"
            to="/super_admin/login"
            icon={<LogoutIcon />}
            selected={selected}
            setSelected={setSelected}
            handleClick={handleLogout}
          />
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default SuperAdminSidebar;