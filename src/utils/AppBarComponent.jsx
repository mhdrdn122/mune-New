import { AppBar, IconButton, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useShowSidebar } from "../context/ShowSidebarProvider";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { RiCouponLine } from "react-icons/ri";
import { FaTruckFast } from "react-icons/fa6"; // Changed icon to a more fitting one for 'Drivers'
import { PermissionsEnum } from "../constant/permissions";
import { usePermissions } from "../context/PermissionsContext";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import useGetStyle from "../hooks/useGetStyle";

const AppBarComponent = ({ Role }) => {
  const { isCollapsed, setIsCollapsed } = useShowSidebar();
  const { hasPermission } = usePermissions();
  const userData = JSON.parse(localStorage.getItem("adminInfo")) || {};
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const {Color} = useGetStyle()
  // Menu items configuration
  const menuItems = [
    {
      title: "إضافة طلب",
      to: "/admin/addOrder",
      icon: <IoAddCircleOutline />,
      show: hasPermission(PermissionsEnum.ORDER_INDEX) && userData?.restaurant?.is_order === 1,
    },
    {
      title: "الطاولات",
      to: "/admin/tables",
      icon: <TableRestaurantIcon />,
      show: hasPermission(PermissionsEnum.TABLE_INDEX) && userData?.restaurant?.is_table === 1 && Role == "ADMIN",
    },
    {
      title: "متابعة السائقين",
      to: "/admin/driver-tracking",
      icon: <FaTruckFast />,
      show:   Role == "ADMIN",
    },
    {
      title: "الخدمات",
      to: "/admin/service",
      icon: <MdOutlineMiscellaneousServices />,
      show: hasPermission(PermissionsEnum.SERVICE_INDEX) && userData?.restaurant?.is_order === 1 && Role == "ADMIN" ,
    },
    {
      title: "كوبونات",
      to: "/admin/coupon",
      icon: <RiCouponLine />,
      show: userData?.restaurant?.is_order === 1 && Role == "ADMIN",
    },
  ];

  console.log(Color)
   return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "transparent !important",
        zIndex: 100,
      }}
      className="!bg-none shadow-none"
    >
      <Toolbar
        sx={{
          boxShadow: "0px 8px 8px 0px #0000004D",
          background : Color ? "#" + Color : "#2F4B26"
        }}
        className={`flex justify-between md:justify-start   rounded-b-3xl py-2 px-4`}
        dir="rtl"
      >
        {/* Right side group: Menu icon and Logo/Role text */}
        <div className="flex items-center gap-3 md:w-1/3 !w-full ">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ p: 0.5, color: "white" }}
          >
            <MenuIcon />
          </IconButton>
          {/* Menu Logo/Text as shown in the image */}
          <Typography
          
            variant="h5"
            sx={{
              color: "#FFF",
               fontWeight: 900,
              fontSize: "1.75rem",
              textTransform: "uppercase",
              userSelect: "none",
              flex:isSmallDevice ? "1" : "auto"
            }}
          >
            {Role}
          </Typography>
        </div>

        {/* Center/Left group: Menu items */}
        <div
          className={`flex items-center   ${
            isSmallDevice ? "justify-end gap-1" : "justify-center gap-4"
          }`}
        >
          {menuItems.filter((item) => item.show).map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center gap-2 text-white"
              style={{
                textDecoration: "none",
                transition: "background-color 0.3s, transform 0.2s",
                borderRadius: "8px",
                padding: isSmallDevice ? " 4px 6px " : "8px 12px",
                whiteSpace: "nowrap",
                fontSize: "1rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = Color ?   Color : "#3D5C2E";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {item.icon}
              <span className={isSmallDevice ? "sr-only" : ""}>{item.title}</span>
            </Link>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;