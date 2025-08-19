import { HiMiniPlusCircle } from "react-icons/hi2";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LanguageContext } from "../../context/LanguageProvider";
import { AdminContext } from "../../context/AdminProvider";
import { useRequestOrderMutation } from "../../redux/slice/tables/tablesApi";
import notify from "../useNotification";
import { ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";

const PlusButton = ({ change }) => {
  const { language } = React.useContext(LanguageContext);
  const { adminDetails } = React.useContext(AdminContext);
  const [requestOrder, { isLoading }] = useRequestOrderMutation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [showButton, setShowButton] = React.useState(false);
  const [loading, setLoading] = React.useState({
    waiter: false,
    arakel: false,
    invoice: false,
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // React.useEffect(() => {
  //   window.scroll(0, 0);
  // }, []);

  const handleRequest = async (type) => {
    try {
      setLoading((prev) => ({ ...prev, [type]: true }));
      const result = await requestOrder({
        type,
        tableId: adminDetails.table_id,
      }).unwrap();
      console.log("Service added successfully:", result);
      if (result.status === true) {
        notify(result.message, "success");
        handleClose();
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      if (error.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else {
        notify(error.data.message, "error");
      }
    } finally {
      // Reset the loading state for the specific type
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // console.log(adminDetails);

  const bgColor = `rgba(${parseInt(
    adminDetails?.background_color?.substring(10, 12),
    16
  )}, 
    ${parseInt(adminDetails?.background_color?.substring(12, 14), 16)}, 
    ${parseInt(adminDetails?.background_color?.substring(14, 16), 16)}, 
    0.8)`;

  const color = `#${adminDetails?.color?.substring(10, 16)}`;

  const style = {
    padding: "6px 16px !important",
    direction: language === "en" ? "ltr" : "rtl",
  };
  const styleBorder = {
    borderBottom: "1px solid",
    borderColor: color,
  };

  return (
    // <button
    //   className="btn "
    //   style={{
    //     position: "fixed",
    //     bottom: "30px",
    //     right: "30px",
    //     zIndex: 1000,
    //     backgroundColor:bgColor,
    //     padding: '9px'
    //   }}
    // >
    //   <HiMiniPlusCircle size={30} color={color} />
    // </button>

    <div>
      {showButton && adminDetails?.is_table === 1 && adminDetails?.table_id && (
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{
            position: "fixed",
            bottom: "60px",
            right: change ? (language === "en" ? "20px" : "unset") : "20px",
            left: change ? (language === "ar" ? "20px" : "unset") : "unset",
            zIndex: 1000,
            backgroundColor: bgColor,
            // padding: "9px",
            border: "1px solid",
            borderColor: color,
            borderRadius: "50%",
            boxShadow: `0px 4px 6px rgba(0, 0, 0, 0.1)`,
          }}
          className="hell"
        >
          <HiMiniPlusCircle size={30} color={color} />
        </Button>
      )}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: change && language === "ar" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: change && language === "ar" ? "left" : "right",
        }}
      >
        <MenuItem
          onClick={() => handleRequest("waiter")}
          sx={{ ...style, ...styleBorder }}
          disabled={loading.waiter}
          className="font"
        >
          {language === "en" ? "Request a Waiter" : "طلب نادل"}{" "}
          {loading.waiter && (
            <CircularProgress size={20} sx={{ margin: "5px" }} />
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleRequest("arakel")}
          sx={{ ...style, ...styleBorder }}
          disabled={loading.arakel}
          className="font"
        >
          {language === "en" ? "Request Shisha" : "طلب أركيلة"}
          {loading.arakel && (
            <CircularProgress size={20} sx={{ margin: "5px" }} />
          )}
        </MenuItem>
        <MenuItem
          onClick={() => handleRequest("invoice")}
          sx={style}
          disabled={loading.invoice}
          className="font"
        >
          {language === "en" ? "Request the Bill" : "طلب الفاتورة"}
          {loading.invoice && (
            <CircularProgress size={20} sx={{ margin: "5px" }} />
          )}
        </MenuItem>
      </Menu>

      <ToastContainer />
    </div>
  );
};

export default PlusButton;
