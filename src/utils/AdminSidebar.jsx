import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { MdOutlineInventory2 } from "react-icons/md";
import { useMediaQuery } from "@uidotdev/usehooks";

import { Link, useLocation, useNavigate } from "react-router-dom";
import imageMenu from "../assets/logo.png";
import { RiAdvertisementFill, RiInformationLine } from "react-icons/ri";
import PersonIcon from "@mui/icons-material/Person";
import StarsIcon from "@mui/icons-material/Stars";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { SiMicrosoftexcel } from "react-icons/si";
import LogoutIcon from "@mui/icons-material/Logout";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  getRatesExcelAction,
  getSmsRechargeAction,
  getSmsWithdrawalsAction,
  resetRatesExcel,
  resetSmsRecharge,
  resetSmsWithdrawals,
} from "../redux/slice/rates/ratesSlice";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaChartLine, FaCommentSms } from "react-icons/fa6";
import notify from "./useNotification";
import store from "../redux/store/store";
import { MdOutlineWeb } from "react-icons/md";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { FaCartPlus, FaUsers } from "react-icons/fa";
import { usePermissions } from "../context/PermissionsContext";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import { PermissionsEnum } from "../constant/permissions";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { object } from "yup";
import { BsSkipBackwardCircleFill } from "react-icons/bs";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { resetAuthState } from "../redux/slice/auth/authSlice";
import { Link as LinkMui } from "@mui/material";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { PiUsersFourThin } from "react-icons/pi";
import { FaMotorcycle } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCouponLine } from "react-icons/ri";
import { baseURLLocalPublic } from "../Api/baseURLLocal";
import { useShowSidebar } from "../context/ShowSidebarProvider";
import useGetStyle from "../hooks/useGetStyle";
import { Apps } from "@mui/icons-material";

const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  loading,
  handleClick,
}) => {
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useShowSidebar();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { Color } = useGetStyle();

  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        localStorage.setItem("selected", title);
        setSelected(title);
        handleClick?.();
        navigate(to);
        if (isSmallDevice) setIsCollapsed(true);
      }}
      icon={icon}
      rootStyles={{ backgroundColor: "transparent" }}
    >
      <Typography
        sx={{
          color: Color ? "#" + Color : "#2f4b2b",
        }}
        className=" !font-extrabold p-2"
      >
        {title} {loading && <Spinner animation="border" size="sm" />}
      </Typography>
    </MenuItem>
  );
};

const AdminSidebar = ({ className }) => {
  // Hooks and state management
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { isCollapsed, setIsCollapsed } = useShowSidebar();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { Color } = useGetStyle();

  // Redux selectors
  const { excelData, loading, error } = useSelector(
    (state) => state.rates.ratesExcel
  );
  const { smsRechargeData, loadingSms, errorSms } = useSelector(
    (state) => state.rates.smsRecharge
  );
  const { smsWithdrawalsData, loadingSmsWith, errorSmsWith } = useSelector(
    (state) => state.rates.smsWithdrawals
  );

  // Local state
  const [selected, setSelected] = useState(localStorage.getItem("selected"));
  const [isExcelRequested, setIsExcelRequested] = useState(false);
  const [isSmsRechargeRequested, setIsSmsRechargeRequested] = useState(false);
  const [isSmsWithdrawalsRequested, setIsSmsWithdrawalsRequested] =
    useState(false);
  const userData = JSON.parse(localStorage.getItem("adminInfo"));

  // Helper functions
  const generateExcel = useCallback((data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, fileName);
  }, []);

  const generateExc = useCallback((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Excel.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Effects
  useEffect(() => {
    if (isExcelRequested && !loading) {
      if (excelData) {
        generateExc(excelData);
      } else if (error) {
        notify(error.message, "warn");
      }
      setIsExcelRequested(false);
      dispatch(resetRatesExcel());
    }
  }, [isExcelRequested, error, dispatch, loading, excelData, generateExc]);

  useEffect(() => {
    if (isSmsRechargeRequested) {
      if (smsRechargeData?.data) {
        setIsSmsRechargeRequested(false);
        dispatch(resetSmsRecharge());
      } else if (errorSms) {
        notify("لا يوجد رسائل مشحونة", "warn");
        dispatch(resetSmsRecharge());
      }
    }
  }, [isSmsRechargeRequested, smsRechargeData, errorSms, dispatch]);

  useEffect(() => {
    if (isSmsWithdrawalsRequested) {
      if (smsWithdrawalsData?.data) {
        setIsSmsWithdrawalsRequested(false);
        dispatch(resetSmsWithdrawals());
      } else if (errorSmsWith) {
        notify("لا يوجد عمليات سحب", "warn");
        dispatch(resetSmsWithdrawals());
      }
    }
  }, [isSmsWithdrawalsRequested, smsWithdrawalsData, errorSmsWith, dispatch]);

  // Action handlers
  const handleClickExcel = async () => {
    setIsExcelRequested(true);
    await dispatch(getRatesExcelAction());
  };

  const handleClickSmsRecharge = async () => {
    setIsSmsRechargeRequested(true);
    await dispatch(getSmsRechargeAction(userData?.id));
  };

  const handleClickSmsWithdrawals = async () => {
    setIsSmsWithdrawalsRequested(true);
    await dispatch(getSmsWithdrawalsAction(userData?.id));
  };

  const handleLogout = async () => {
    await dispatch(resetAuthState());
    localStorage.clear();
    navigate("/admin/login");
  };

  // Menu items configuration
  const menuItems = [
    {
      title: "الأصناف",
      to: "/admin",
      icon: <HomeOutlinedIcon />,
      show: hasPermission(PermissionsEnum.CATEGORY_INDEX),
    },
    {
      title: "الطلبات الخارجية",
      to: "/admin/takeoutOrders",
      icon: <TbTruckDelivery />,
      show:
        hasPermission(PermissionsEnum.ORDER_INDEX) &&
        userData?.restaurant?.is_takeout === 1,
    },
    {
      isDivider: true,
      show: true,
    },
    {
      title: "المستخدمين",
      to: "/admin/users",
      icon: <PiUsersFourThin />,
      show:
        hasPermission(PermissionsEnum.USER_INDEX) &&
        userData.restaurant.is_takeout === 1,
    },
    {
      title: "التقييمات",
      to: "/admin/rates",
      icon: <RateReviewIcon />,
      show:
        location.pathname !== "/admin/rests" &&
        hasPermission(PermissionsEnum.RATE_INDEX) &&
        userData.restaurant.is_rate === 1,
    },

    {
      title: "الإعلانات",
      to: "/admin/ads",
      icon: <RiAdvertisementFill />,
      show:
        hasPermission(PermissionsEnum.ADVERTISEMENT_INDEX) &&
        userData?.restaurant?.is_advertisement === 1,
    },

    {
      isDivider: true,
      show: true,
    },

    {
      title: "السائقين",
      to: "/admin/deliveries",
      icon: <FaMotorcycle />,
      show:
        hasPermission(PermissionsEnum.DELIVERY_INDEX) &&
        userData.restaurant.is_delivery === 1,
    },

    {
      title: "الموظفين",
      to: "/admin/admins",
      icon: <FaUsers />,
      show: hasPermission(PermissionsEnum.USER_INDEX),
    },

    {
      title: "الرسم البياني",
      to: "/admin/charts",
      icon: <FaChartLine />,
      show:
        hasPermission(PermissionsEnum.USER_INDEX) &&
        userData.restaurant.is_order === 1,
    },

    {
      isDivider: true,
      show: true,
    },

    {
      title: "الفواتير",
      to: "/admin/invoices",
      icon: <LiaFileInvoiceSolid />,
      show:
        hasPermission(PermissionsEnum.ORDER_INDEX) &&
        userData?.restaurant?.is_order === 1,
    },
    {
      title: "جرد المبيعات",
      to: "/admin/inventory",
      icon: <MdOutlineInventory2 />,
      show: userData?.restaurant?.is_order === 1,
    },

    {
      isDivider: true,
      show: true,
    },

    {
      title: "الملف الشخصي",
      to: "/admin/profile",
      icon: <PersonIcon />,
      show: !userData?.super,
    },
    {
      title: " التطبيقات الملحقة",
      to: "/admin/apps",
      icon: <Apps />,
      show: !userData?.super,
    },

    {
      title: "    واجهة المستخدم",
      to: `/${userData?.restaurant?.name_url}`,
      icon: <MdOutlineWeb />,
      show: true,
    },
    {
      title: "تسجيل الخروج",
      to: "/admin/login",
      icon: <LogoutIcon />,
      show: true,
      handleClick: handleLogout,
    },
  ];

  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      // Skip hidden items (including hidden dividers)
      if (!item.show) return null;

      // Handle divider items
      if (item.isDivider) {
        return (
          <Divider
            key={`divider-${index}`}
            sx={{
              mx: 2,
              backgroundColor: Color ? Color : "#2f4b2b",
              borderBottomWidth: 1,
              opacity: 0.6,
            }}
          />
        );
      }

      // Handle submenu items
      if (item.type === "submenu") {
        return (
          <SubMenu
            key={index}
            icon={item.icon}
            label={item.title}
            sx={{
              color: Color ? "#" + Color : "#2f4b2b",
              fontWeight: 800,
              "&:hover": {
                color: "green",
                backgroundColor: "rgba(47, 75, 38, 0.1)", // Light green hover
              },
            }}
          >
            {item.items.map((subItem, subIndex) => (
              <Item
                key={subIndex}
                title={subItem.title}
                to={subItem.to}
                icon={subItem.icon}
                selected={selected}
                setSelected={setSelected}
                handleClick={subItem.handleClick}
                loading={subItem.loading}
              />
            ))}
          </SubMenu>
        );
      }

      // Handle regular menu items
      return (
        <Item
          key={index}
          title={item.title}
          to={item.to}
          icon={item.icon}
          selected={selected}
          setSelected={setSelected}
          handleClick={item.handleClick}
          loading={item.loading}
        />
      );
    });
  };

  return (
    <Sidebar
      collapsed={isCollapsed && !isSmallDevice}
      toggled={isSmallDevice ? !isCollapsed : false}
      onBackdropClick={() => setIsCollapsed(true)}
      backgroundColor="#D9D9D9"
      rootStyles={{
        minHeight: "100% !important",
        maxHeight: "100% !important",
        height: "100% !important",
        zIndex: 20,
        overflow: isSmallDevice ? "scroll" : "",
        position: isSmallDevice ? "fixed" : "static",
        [isSmallDevice ? "right" : "static"]: isSmallDevice ? 0 : "auto",
        transform:
          isSmallDevice && isCollapsed ? "translateX(100%)" : "translateX(0)",
      }}
      rtl={true}
      className={className}
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
                background: Color ? "#" + Color : "#2f4b2b",
                cursor: "pointer"

              }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Link
                to="/admin/restaurant_details">
                <img
                  alt="profile-user"
                  src={userData?.restaurant?.logo || imageMenu}
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
                <span style={{
                  display: "inline-block",
                  transform: "rotate(90deg)",
                  fontSize: "20px",
                  color: "#fff",
                  textTransform: "normal"
                }} className="">{userData?.restaurant?.name_url || "name"}</span>
              </Link>
            </Box>
          </Box>
        )}
        <Box>{renderMenuItems()}</Box>
      </Menu>
    </Sidebar>
  );
};

export default AdminSidebar;
