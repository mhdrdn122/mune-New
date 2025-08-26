import { Box, Button, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useMediaQuery } from "@uidotdev/usehooks";
import { usePermissions } from "../context/PermissionsContext";
import { SlRefresh } from "react-icons/sl";
import useRandomNumber from "../hooks/useRandomNumber";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";

// eslint-disable-next-line react/prop-types
const Header = ({
  heading,
  buttonText,
  onButtonClick,
  icon,
  requiredPermission,
  setRefresh,
  refresh,
  refreshRandomNumber,
  services,
  onButtonClick2,
  downloadExcelButton , handleDownloadExcel
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { hasPermission } = usePermissions();

  // const requiredPermissions=['category.add','item.add', ]

  const styleButton = {
    "& .css-y6rp3m-MuiButton-startIcon": {
      margin: "0",
    },
  };


  return (
    <Box
      component="section"
      sx={{
        py: isSmallDevice ? 2 : 4,
        px: isSmallDevice ? 2 : 4,
        width: "100%",
        marginLeft: "auto",
      }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flexDirection={"row-reverse"}
    >
      <Typography
        variant={isSmallDevice ? "h6" : "h4"}
        sx={{ fontWeight: "700", margin: "0" }}
        gutterBottom
      >
        {heading}
      </Typography>
      
      {hasPermission(requiredPermission) && buttonText && (
        <div className="d-flex">
          {
            refresh && 
            <span
              className="p-2 mx-1 rounded"
              style={{
                display: "",
                background: "rgb(2 13 38 / 91%)",
                cursor: "pointer",
              }}
              onClick={() => {
                setRefresh(!refresh);
                refreshRandomNumber();
              }}
            >
              <SlRefresh color="white" size={22} />
            </span>
          }

          <Button
            size={isSmallDevice ? "small" : "large"}
            variant="contained"
            sx={{
              ...styleButton,
              padding: isSmallDevice ? "8px 12px" : "",
              background: "rgb(2 13 38 / 91%)",
              minWidth: isSmallDevice ? "unset" : "",
            }}
            startIcon={icon ? icon : <AddCircleIcon />}
            onClick={onButtonClick}
          >
            {!isSmallDevice && buttonText}
          </Button>
          
        {services &&  
         <Button
            size={isSmallDevice ? "small" : "large"}
            variant="contained"
            sx={{
              ...styleButton,
              padding: isSmallDevice ? "8px 12px" : "",
              background: "rgb(2 13 38 / 91%)",
              minWidth: isSmallDevice ? "unset" : "",
              marginX:'5px'
            }}
            startIcon={icon ? icon : <MdOutlineMiscellaneousServices />}
            onClick={onButtonClick2}
          >
            {!isSmallDevice && "إضافة خدمة"}
          </Button>}
          {downloadExcelButton && 
            <Button
            size={isSmallDevice ? "small" : "large"}
            variant="contained"
            sx={{
              ...styleButton,
              padding: isSmallDevice ? "8px 12px" : "",
              background: "rgb(2 13 38 / 91%)",
              minWidth: isSmallDevice ? "unset" : "",
              marginX:'5px'
            }}
            startIcon={icon ? icon : <RiFileExcel2Line  />}
            onClick={handleDownloadExcel}
          >
            {!isSmallDevice && "تحميل اكسل"}
          </Button>}
        </div>
      )}
    </Box>
  );
};

export default Header;
