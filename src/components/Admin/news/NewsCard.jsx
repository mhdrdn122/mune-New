/**
 * NewsCard
 * Renders a single news item in card format with support for lazy-loaded images,
 * edit/delete actions, and modal handling.
 *
 * @param {Object} item - The news item object containing id, image, name, description, and created_at.
 *
 * @returns {JSX.Element} A card UI component representing the news entry.
 */

import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import UpdateNews from "./UpdateNews";
import ModalDelete from "../../super_admin/cities/ModalDelete";
import { useDeleteNewsMutation } from "../../../redux/slice/news/newsApi";
import notify from "../../../utils/useNotification";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";

const NewsCard = ({ item }) => {
  const { hasPermission } = usePermissions();

  // Local state for managing modals and visibility
  const [showEditItem, setShowEditItem] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const placeholderRef = useRef(null);

  // Lazy-load the image when it becomes visible in the viewport
  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) {
          setVisible(true);
        }
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible]);

  // Toggle handlers for modals
  const handleShowEditItem = () => setShowEditItem(true);
  const handleCloseEditItem = () => setShowEditItem(false);
  const handleShowDeleteModal = (id) => setShowDeleteModal(id);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Mutation hook for deleting news item
  const [deleteNews, { isLoading }] = useDeleteNewsMutation();

  /**
   * handleDelete
   * Triggers the delete API and shows toast based on the result.
   * Called when user confirms deletion.
   */
  const handleDelete = async () => {
    try {
      const result = await deleteNews(showDeleteModal).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      console.error("Failed:", error);
      notify(error.message, "error");
    }
  };

  return (
    <Card sx={{ maxWidth: 260, padding: 0 }}>
      <Link to={``} style={{ color: "inherit" }}>
        {visible ? (
          <CardMedia
            sx={{
              boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
              objectFit: "cover",
              position: "relative",
              aspectRatio: 3 / 2,
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
              src={item.image}
              alt="Product Image"
              onLoad={() => setImageLoading(false)}
              style={{
                width: "100%",
                aspectRatio: 3 / 2,
                visibility: imageLoading ? "hidden" : "visible",
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

        <CardContent>
          <Typography variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2">{item.description}</Typography>
          <Typography variant="body2" color="GrayText">
            {item.created_at}
          </Typography>
        </CardContent>
      </Link>

      {/* Action buttons for edit and delete */}
      <CardActions sx={{ py: 0 }}>
        {hasPermission(PermissionsEnum.NEWS_UPDATE) && (
          <IconButton onClick={handleShowEditItem}>
            <EditOutlinedIcon sx={{ color: "rgb(2 13 38 / 91%)" }} />
          </IconButton>
        )}
        {hasPermission(PermissionsEnum.NEWS_DELETE) && (
          <IconButton>
            <DeleteIcon
              onClick={() => handleShowDeleteModal(item.id)}
              sx={{ color: "rgb(2 13 38 / 91%)" }}
            />
          </IconButton>
        )}
      </CardActions>

      {/* Update modal */}
      {showEditItem && (
        <UpdateNews
          show={showEditItem}
          handleClose={handleCloseEditItem}
          item={item}
        />
      )}

      {/* Delete confirmation modal */}
      <ModalDelete
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        loading={isLoading}
        error={""}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default NewsCard;
