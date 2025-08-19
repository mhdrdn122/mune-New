/**
 * ItemCard Component
 * 
 * Represents a single item in the item grid with actions like view, edit, delete,
 * activate/deactivate, and add order. Supports lazy-loading of images.
 * 
 * Props:
 * @param {Object} item - The item object containing data like id, name, image, and status.
 * @param {number} page - Current pagination page for reload actions.
 * @param {Function} setItemId - Function to set the current item ID during drag.
 */

import { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Typography
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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
    <div className="w-[200px] max-w-[300px] bg-white rounded shadow-sm overflow-hidden">
      <Link
        style={{ color: "inherit" }}
        onDrag={() => setItemId(item.id)}
        className="block"
      >
        {visible ? (
          <div className="relative aspect-square shadow-md">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                Loading...
              </div>
            )}
            <img
              src={item.image}
              alt="Product"
              onLoad={() => setImageLoading(false)}
              className={`w-full h-full object-cover ${imageLoading ? "invisible" : "visible"}`}
            />
          </div>
        ) : (
          <div
            ref={placeholderRef}
            aria-label="Product Image"
            className="h-[260px] bg-gray-200"
          />
        )}

        <div className="px-2 py-2">
          <Typography variant="h6" component="div" className="text-center">
            {item.name}
          </Typography>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-2 pb-2">
        <IconButton onClick={() => setShowDetails(item)}>
          <RemoveRedEyeIcon className="text-[rgba(2,13,38,0.91)]" />
        </IconButton>

        {hasPermission(PermissionsEnum.ITEM_UPDATE) && (
          <IconButton onClick={handleToggle(setShowEditItem)}>
            <EditOutlinedIcon className="text-[rgba(2,13,38,0.91)]" />
          </IconButton>
        )}

        {hasPermission(PermissionsEnum.ITEM_DELETE) && (
          <IconButton onClick={handleToggle(setShowDeleteModal)}>
            <DeleteIcon className="text-[rgba(2,13,38,0.91)]" />
          </IconButton>
        )}

        {hasPermission(PermissionsEnum.ITEM_ACTIVE) && (
          <IconButton onClick={handleToggle(setShowDeactiveModal)}>
            {item.is_active === 1 ? (
              <BlockOutlinedIcon className="text-[rgba(2,13,38,0.91)]" />
            ) : (
              <RemoveCircleIcon className="text-red-600" />
            )}
          </IconButton>
        )}
      </div>

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
    </div>
  );
}
