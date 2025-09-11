import { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BlockIcon from "@mui/icons-material/Block";
import { useMediaQuery } from "@uidotdev/usehooks";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";
import coupon from "../../../assets/coupon.png";
import useGetStyle from "../../../hooks/useGetStyle";

/**
 * CouponCard Component
 * Displays a coupon card with details and action buttons.
 * @param {Object} props
 * @param {Object} props.data - Contains coupon information
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onBlock - Function to handle block action
 * @param {Function} props.onDelete - Function to handle delete action
 */
const CouponCard = ({ data, onEdit, onBlock, onDelete, index }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { hasPermission } = usePermissions();
  const { Color } = useGetStyle();

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("ar-EG");

  return (
    <Card
      sx={{
        maxWidth: 300,
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#E8F5E9",

      }}
      className="w-full sm:w-72 md:w-80 lg:w-96 mx-auto"
    >
      {/* Upper Section: Coupon Details */}
      <CardContent
        sx={{
          p: 2,
          background: `url(${coupon}) no-repeat 25%`,
          backgroundSize: "contain",
          backgroundColor: "#D9D9D9",
          position: "relative",
          textAlign: "right",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="absolute top-7 text-2xl left-30 text-white">
          0{index + 1}
        </div>

        <div
          style={{
            fontWight: "800 !important",
          }}
          className="absolute bottom-3 right-3 "
        >
          <Typography variant="body1" color="#000" gutterBottom>
            رمز الكوبون: {data?.code}
          </Typography>
          <Typography variant="body1" color="#000" gutterBottom>
            من: {formatDate(data?.from_date)}
          </Typography>
          <Typography variant="body1" color="#000" gutterBottom>
            إلى: {formatDate(data?.to_date)}
          </Typography>
          <Typography variant="body1" color="#000" gutterBottom>
            الحالة: {data?.is_active ? "فعال" : "غير فعال"}
          </Typography>
        </div>

        <div className="absolute left-13 bottom-13 rotate-z-[-400deg] ">
          {data?.percent} %
        </div>
      </CardContent>

      {/* Lower Section: Action Buttons */}
      <div style={{ padding: "5px", backgroundColor: Color ? "#" + Color : "#2F4B26" }}>
        <div className="flex justify-around">
          {hasPermission(PermissionsEnum.USER_ADD) && (
            <IconButton onClick={onDelete}>
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          {hasPermission(PermissionsEnum.USER_ADD) && (
            <IconButton onClick={onEdit}>
              <EditOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          {hasPermission(PermissionsEnum.USER_ADD) && (
            <IconButton onClick={onBlock}>
              <BlockIcon sx={{ color: "white" }} />
            </IconButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CouponCard;
