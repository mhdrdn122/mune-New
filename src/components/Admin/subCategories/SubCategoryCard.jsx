// This component renders a single subcategory card for a category management system.
// It supports lazy-loading images, edit/delete/deactivate actions, and permission-based UI logic.

import { IconButton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { PermissionsEnum } from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";

/**
 * SubCategoryCard displays a card with image, title, and action buttons for a single subcategory.
 * It handles lazy-loading, permission-based rendering, and action button state management.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the subcategory to display
 * @param {string} props.title2 - (Optional) Unused in current implementation
 * @param {string} props.img - Image URL to show in the card
 * @param {number|string} props.subId - Subcategory ID used for navigation
 * @param {number} props.page - Current page (not used internally)
 * @param {number} props.is_active - Status flag to show activate/deactivate button (1 or 0)
 * @param {string} props.to - Base route to navigate on card click
 * @param {Function} props.setSubId - Callback to store selected subcategory ID
 * @param {any} props.bjj - (Optional) Unused in current implementation
 *
 * @returns {JSX.Element} The rendered card component
 */
export default function SubCategoryCard({
  title,
  title2,
  img,
  subId,
  page,
  is_active,
  to,
  setSubId,
  bjj,
}) {
  const [showEditSubCat, setShowEditSubCat] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const { id } = useParams();
  const placeholderRef = useRef(null);
  const { hasPermission } = usePermissions();

  /**
   * Handles lazy loading of the image using IntersectionObserver
   */
  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) setVisible(true);
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible]);

  // Handlers for modals
  const handleShowEditSubCat = () => setShowEditSubCat(true);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleShowDeactiveModal = () => setShowDeactiveModal(true);

  return (
    <Card sx={{ maxWidth: 260, minWidth: 150, padding: 0 }}>
      {/* Image and title area */}
      <Link
        to={`${to}/${subId}`}
        style={{ color: "inherit" }}
        onDrag={() => setSubId(subId)}
      >
        {visible ? (
          <CardMedia
            sx={{
              aspectRatio: 1,
              boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
              objectFit: "cover",
              position: "relative",
            }}
          >
            {imageLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Loading...
              </div>
            )}
            <img
              src={img}
              alt="Product Image"
              onLoad={() => setImageLoading(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                visibility: imageLoading ? "hidden" : "visible",
                aspectRatio: 1,
              }}
            />
          </CardMedia>
        ) : (
          <div
            style={{ height: 260, backgroundColor: "#EEE" }}
            aria-label="Product Image"
            ref={placeholderRef}
          />
        )}

        <CardContent sx={{ padding: "8px !important" }}>
          <Typography variant="subtitle1" component="div" textAlign="center">
            {title}
          </Typography>
        </CardContent>
      </Link>

      {/* Action buttons based on permissions */}
      <CardActions sx={{ p: 0 }}>
        {hasPermission(PermissionsEnum.CATEGORY_UPDATE) && (
          <IconButton onClick={handleShowEditSubCat}>
            <EditOutlinedIcon sx={{ color: "rgb(2 13 38 / 91%)" }} />
          </IconButton>
        )}
        {hasPermission(PermissionsEnum.CATEGORY_DELETE) && (
          <IconButton>
            <DeleteIcon
              onClick={handleShowDeleteModal}
              sx={{ color: "rgb(2 13 38 / 91%)" }}
            />
          </IconButton>
        )}
        {hasPermission(PermissionsEnum.CATEGORY_ACTIVE) &&
          (is_active === 1 ? (
            <IconButton>
              <BlockOutlinedIcon
                onClick={handleShowDeactiveModal}
                sx={{ color: "rgb(2 13 38 / 91%)" }}
              />
            </IconButton>
          ) : (
            <IconButton>
              <RemoveCircleIcon
                onClick={handleShowDeactiveModal}
                sx={{ color: "red" }}
              />
            </IconButton>
          ))}
      </CardActions>
    </Card>
  );
}
