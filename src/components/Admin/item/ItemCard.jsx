import { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";
import { ModalAddItem } from "./ModalAddItem";
import { handleDeactivate, handleDelete } from "./helpers";
import { useDispatch, useSelector } from "react-redux";

export default function ItemCard({ item, page, setItemId }) {
  const dispatch = useDispatch();
  const { loading: loadingDelete } = useSelector((state) => state.items.deletedItem);
  const { loading: deactiveLoading } = useSelector((state) => state.items.deactiveItem);

  // Local state for modals and image visibility 
  const [showEditItem, setShowEditItem] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const { hasPermission } = usePermissions();
  const { id, subId } = useParams();
  const placeholderRef = useRef(null);

  // Lazy-load image when in viewport
  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio > 0) setVisible(true);
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible]);

  const handleToggle = (setter) => () => setter((prev) => !prev);

  return (
    <Card
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#D3D3D3",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "300px"
      }}
    >
      <Link
        style={{ color: "inherit" }}
        onDrag={() => setItemId(item.id)}
        to="#"
      >
        {visible ? (
          <CardMedia
            sx={{
              aspectRatio: 1,
              boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
              objectFit: "cover",
              position: "relative",
              backgroundColor: "#2F4F4F",
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
              alt="Product"
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

        <CardContent sx={{ padding: "8px !important", textAlign: "center" }}>
          <Typography variant="subtitle1" color="#2F4F4F">
            {item.name}
          </Typography>
        </CardContent>
      </Link>

      {/* Action buttons */}
      <CardActions
        sx={{
          py: 0,
          justifyContent: "space-between",
          backgroundColor: "#D3D3D3",
          padding: "8px 16px",
          borderTop: "1px solid #B0B0B0",
        }}
      >
        <IconButton
          sx={{ padding: "8px" }}
          onClick={() => setShowDetails(true)}
          style={{ backgroundColor: "#9ACD32", borderRadius: "8px" }}
        >
          <RemoveRedEyeIcon sx={{ color: "#FFFFFF" }} />
        </IconButton>

        {hasPermission(PermissionsEnum.ITEM_UPDATE) && (
          <IconButton
            sx={{ padding: "8px" }}
            onClick={handleToggle(setShowEditItem)}
            style={{ backgroundColor: "#9ACD32", borderRadius: "8px" }}
          >
            <EditOutlinedIcon sx={{ color: "#FFFFFF" }} />
          </IconButton>
        )}

        {hasPermission(PermissionsEnum.ITEM_DELETE) && (
          <IconButton
            sx={{ padding: "8px" }}
            onClick={handleToggle(setShowDeleteModal)}
            style={{ backgroundColor: "#9ACD32", borderRadius: "8px" }}
          >
            <DeleteIcon sx={{ color: "#FFFFFF" }} />
          </IconButton>
        )}

        {hasPermission(PermissionsEnum.ITEM_ACTIVE) && (
          <IconButton
            sx={{ color: "#9ACD32", padding: "0" }}
            onClick={handleToggle(setShowDeactiveModal)}
            style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "4px 12px" }}
          >
            {item.is_active === 1 ? (
              <MdToggleOn size={35} />
            ) : (
              <MdToggleOff size={35} />
            )}
          </IconButton>
        )}
      </CardActions>

      {/* Modals */}
      {showEditItem && (
        <ModalAddItem
          handleClose={handleToggle(setShowEditItem)}
          show={showEditItem}
          initialValues={item}
          masterId={id}
          mode="edit"
          page={page}
          subId={subId}
        />
      )}

      {showDeleteModal && (
        <AttentionModal
          handleClose={handleToggle(setShowDeleteModal)}
          loading={loadingDelete}
          message={"هل أنت متأكد من عملية الحذف؟"}
          onIgnore={handleToggle(setShowDeleteModal)}
          onOk={async () =>
            await handleDelete(item.id, dispatch, page, handleToggle(setShowDeleteModal), subId, id)
          }
          show={showDeleteModal}
          title={"حذف العنصر"}
        />
      )}

      {showDeactiveModal && (
        <AttentionModal
          handleClose={handleToggle(setShowDeactiveModal)}
          loading={deactiveLoading}
          message={
            item?.is_active
              ? "هل أنت متأكد من عملية إلغاء التنشيط؟"
              : "هل أنت متأكد من عملية تنشيط المنتج؟"
          }
          onIgnore={handleToggle(setShowDeactiveModal)}
          onOk={async () =>
            await handleDeactivate(item.id, dispatch, page, handleToggle(setShowDeleteModal), subId, id, item.is_active)
          }
          show={showDeactiveModal}
          title={item?.is_active ? "إلغاء التنشيط" : "تنشيط المنتج"}
        />
      )}

      {showDetails && (
        <ModalAddItem
          handleClose={handleToggle(setShowDetails)}
          show={showDetails}
          initialValues={item}
          masterId={id}
          mode="view"
          page={page}
          subId={subId}
        />
      )}
    </Card>
  );
}