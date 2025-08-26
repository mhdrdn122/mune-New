import { useEffect, useRef, useState } from "react";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDispatch, useSelector } from "react-redux";

import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";

import DynamicForm from "../../Modals/AddModal/AddModal";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";

import { getAdvFormField, handleDelete, handleSubmitForm } from "./helpers";
import useGetStyle from "../../../hooks/useGetStyle";

/**
 * AdvCard Component
 *
 * Represents a single advertisement card, displaying:
 * - Image
 * - Title and date range
 * - Actions (edit/delete) based on permissions
 * - Lazy loading for image visibility
 *
 * @param {Object} props
 * @param {string} props.title - Advertisement title
 * @param {string} props.from_date - Starting date of the ad
 * @param {string} props.to_date - Ending date of the ad
 * @param {string} props.img - Image URL
 * @param {number} props.id - Ad ID
 * @param {number} props.page - Current page (used for refresh)
 * @param {boolean|number} props.is_panorama - Whether the ad is panorama (0 or 1)
 * @param {boolean|number} props.hide_date - Whether to hide the date (0 or 1)
 */
const AdvCard = ({
  title,
  from_date,
  to_date,
  img,
  id,
  page,
  is_panorama,
  hide_date,
}) => {
  const [imageLoading, setImageLoading] = useState(true); // Flag to track if image is still loading
  const [showEditAdv, setShowEditAdv] = useState(false); // Edit modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal visibility
  const [visible, setVisible] = useState(false); // Lazy loading visibility flag
  const [fields, setFields] = useState(); // Form fields

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const placeholderRef = useRef(null);

  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();

  const { loading } = useSelector((state) => state.ads.deletedAdv);
  const { Color } = useGetStyle();

  // Load form fields on component mount
  useEffect(() => {
    const result = getAdvFormField();
    setFields(result);
  }, []);

  // Lazy load image using IntersectionObserver
  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio > 0) {
          setVisible(true);
        }
      });

      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible]);

  return (
    <Card
      sx={{
        maxWidth: 300,
        padding: 2,
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxHeight: "fit-content",
        backgroundColor: "#D9D9D9",
        color: "#2F4B26",
      }}
      className="w-full sm:w-72  md:w-80 lg:w-96 mx-auto"
    >
      {/* First Row: Delete Icon, Title, Edit Icon */}
      <div
        className="flex justify-around items-center "
        style={{ backgroundColor: "#D9D9D9", color: Color ? "#" + Color : "#2F4B26" }}
      >
        <IconButton
          sx={{
            color: "white",
            backgroundColor: Color ? "#" + Color : "#2F4B26",
            borderRadius: 3,
            padding: "5px",
            border: " 1px solid transparent",

            "&:hover": {
              color: Color ? "#" + Color : "#2F4B26",
              border: `1px solid ${Color ? "#" + Color : "#2F4B26"}`,
            },
          }}
          onClick={() => setShowDeleteModal(true)}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          className="flex-grow text-center font-bold"
        >
          {title}
        </Typography>
        {hasPermission(PermissionsEnum.ADVERTISEMENT_UPDATE) && (
          <IconButton
            sx={{
              color: "white",
              backgroundColor: Color ? "#" + Color : "#2F4B26",
              borderRadius: 3,
              padding: "5px",
              border: " 1px solid transparent",

              "&:hover": {
                color: Color ? "#" + Color : "#2F4B26",
                border: `1px solid ${Color ? "#" + Color : "#2F4B26"}`,
              },
            }}
            onClick={() => setShowEditAdv(true)}
            size="small"
          >
            <EditOutlinedIcon />
          </IconButton>
        )}
      </div>

      {/* Second Row: Date Range */}
      <div
        className="  py-2 flex justify-between items-center"
        style={{ backgroundColor: "#D9D9D9", color: Color ? "#" + Color : "#2F4B26" }}
      >
        <Typography variant="body2">
          <span>من</span>
          <span>{from_date}</span>
        </Typography>

        <Typography variant="body2">
          <span>إلى</span>
          <span>{to_date}</span>
        </Typography>
      </div>

      {/* Third Row: Image */}
      {visible ? (
        <CardMedia
          sx={{
            boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
            objectFit: "cover",
            position: "relative",
            aspectRatio: "4 / 3",
            backgroundColor: "#BDD358",
            borderRadius: "20px",
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
              objectPosition: "center",
              aspectRatio: "4 / 3",
              visibility: imageLoading ? "hidden" : "visible",
              borderRadius: "20px",
            }}
          />
        </CardMedia>
      ) : (
        // Placeholder if image not visible yet
        <div
          style={{
            height: isSmallDevice ? 160 : 240,
            backgroundColor: "#BDD358",
          }}
          aria-label="Product Image"
          ref={placeholderRef}
        />
      )}

      {/* Edit Advertisement Modal */}
      {showEditAdv && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={() => setShowEditAdv(false)}
          onSubmit={async (values) =>
            handleSubmitForm("edit", values, id, dispatch, page)
          }
          passedData={{
            image: img,
            from_date: new Date(from_date).toISOString().split("T")[0],
            to_date: new Date(to_date).toISOString().split("T")[0],
            is_panorama: is_panorama === 0 ? "لا" : "نعم",
            hide_date: hide_date === 0 ? "لا" : "نعم",
            title: title,
          }}
          show={showEditAdv}
          title="تعديل إعلان"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <AttentionModal
          handleClose={() => setShowDeleteModal(false)}
          loading={loading}
          message="هل انت متاكد من حذف هذا العنصر ؟"
          onIgnore={() => setShowDeleteModal(false)}
          onOk={async () =>
            await handleDelete(id, dispatch, page, () =>
              setShowDeleteModal(false)
            )
          }
          show={showDeleteModal}
          title="تأكيد عملية الحذف"
        />
      )}
    </Card>
  );
};

export default AdvCard;
