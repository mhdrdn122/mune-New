import { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useMediaQuery } from "@uidotdev/usehooks";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";
import tableImage from "./table.svg";
import useGetStyle from "../../../hooks/useGetStyle";

/**
 * TableCard Component
 * Displays a table card with actions based on table status.
 * @param {Object} props
 * @param {Object} props.data - Contains table information
 * @param {Function} props.onClick - Function to handle card click
 * @param {string} props.status - Status of the table ('reserved' or 'empty')
 */
const TableCard = ({ data, onClick, onReceipt, onDelete, onAdd, onEdit }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { hasPermission } = usePermissions();
    const {Color} = useGetStyle()

  const getBackgroundColor = () => {
    return data?.new === 1
      ? "#ff00007c"
      : data?.new === 2
      ? "#fffb0091"
      : "rgba(0, 255, 0, 0.53)";
  };

  console.log(data.new);
  return (
    <Card
      sx={{
        maxWidth: 300,
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#E8F5E9",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
      className="w-full sm:w-72 md:w-80 lg:w-96 mx-auto"
    >
      {/* Upper Section: Table Image with Status Background */}
      <CardContent
        onClick={onClick}
        sx={{
          p: 2,
          //     background: `url(${tableImage}) no-repeat center`,
          //   backgroundSize: "contain",
          backgroundColor: getBackgroundColor(),
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
        <img
          src={tableImage}
          className="max-w-[200px] w-[200px] m-auto  "
          alt="img-table"
        />

        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="absolute text-2xl  text-white"
        >
          0{data?.id || "1"}
        </div>
      </CardContent>

      {/* Lower Section: Action Buttons */}
      <div style={{ padding: "5px", backgroundColor: Color ? "#" + Color : "#2F4B26" }}>
        <div className="flex justify-around">
          {hasPermission(PermissionsEnum.TABLE_ADD) && (
            <IconButton onClick={onAdd}>
              <AddIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          {hasPermission(PermissionsEnum.TABLE_UPDATE) && (
            <IconButton onClick={onEdit}>
              <EditOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          {hasPermission(PermissionsEnum.TABLE_DELETE) && (
            <IconButton onClick={onDelete}>
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          {hasPermission(PermissionsEnum.TABLE_DELETE) && (
            <IconButton onClick={() => onReceipt({id : data?.id})}>
              <ReceiptIcon sx={{ color: "white" }} />
            </IconButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TableCard;
