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
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";
import {
  handleDeactivate,
  handleDelete,
  getCategoryFormFields,
  handleUpdateCategory
} from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import DynamicForm from "../../Modals/AddModal/AddModal";

// Props: receives metadata about a single category
const CategoryCard = ({ title, title2, img, id, page, is_active, to, setMasterId, is_sub, parentCategory }) => {
  const [showEditCat, setShowEditCat] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [visible, setVisible] = useState(false);  // Used for lazy image loading
  const [fields, setFields] = useState();         // Form fields for DynamicForm

  const placeholderRef = useRef(null);
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();

  // Set up lazy loading for the image
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
  }, [visible, placeholderRef]);

  // Fetch dynamic form field structure
  useEffect(() => {
    const result = getCategoryFormFields();
    setFields(result);
  }, []);

  // Get loading states from Redux
  const { loading: deleteLoading } = useSelector((state) =>
    !is_sub ? state.categories.deletedCategory : state.subCategories.deletedSubCategory
  );
  const { loading: deactiveLoading } = useSelector((state) =>
    !is_sub ? state.categories.deactiveCategory : state.subCategories.deactiveSubCategory
  );

  console.log(img)
  return (
    <Card
      className="p-0 "
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#D3D3D3",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth:"300px"
      }}
    >
      {/* Link wraps the image and title */}
      <Link to={to} style={{ color: "inherit" }} onDrag={() => setMasterId(id)}>
        {/* Lazy load image only when in view */}
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
            {/* Loading overlay */}
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

            {/* Image */}
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

        {/* Category name */}
        <CardContent sx={{ padding: "8px !important", textAlign: "center" }}>
          <Typography variant="subtitle1" color="#2F4F4F">
            {title}
          </Typography>
        </CardContent>
      </Link>

      {/* Action buttons: edit, delete, toggle active */}
      <CardActions
        sx={{
          py: 0,
          justifyContent: "space-between",
          backgroundColor: "#D3D3D3",
          padding: "8px 16px",
          borderTop: "1px solid #B0B0B0",
        }}
      >
        {hasPermission(PermissionsEnum.CATEGORY_UPDATE) && (
          <IconButton
            sx={{ padding: "8px" }}
            onClick={() => setShowEditCat(true)}
            style={{ backgroundColor: "#9ACD32", borderRadius: "8px" }}
          >
            <EditOutlinedIcon sx={{ color: "#FFFFFF" }} />
          </IconButton>
        )}

         {hasPermission(PermissionsEnum.CATEGORY_ACTIVE) &&
          (is_active === 1 ? (
            <IconButton
              sx={{ color: "#9ACD32", padding: "10px" }}
              onClick={() => setShowDeactiveModal(true)}
              style={{ backgroundColor:  is_active == 1 ? "#FFFFFF" : "#f00" , borderRadius: "20px", padding: "4px 12px" }}
            >
              <MdToggleOn size={35} />
            </IconButton>
          ) : (
            <IconButton
              sx={{ color: "#9ACD32", padding: "0" }}
              onClick={() => setShowDeactiveModal(true)}
              style={{ backgroundColor:  is_active == 1 ? "#FFFFFF" : "#f00", borderRadius: "20px", padding: "4px 12px" }}
            >
              <MdToggleOff size={35} />
            </IconButton>
          ))}

        {hasPermission(PermissionsEnum.CATEGORY_DELETE) && (
          <IconButton
            sx={{ padding: "8px" }}
            onClick={() => setShowDeleteModal(true)}
            // disabled={is_active === 1 ? true : false}
            style={{ backgroundColor: "#9ACD32", borderRadius: "8px" }}
          >
            <DeleteIcon sx={{ color: is_active ? "gray" : "#FFFFFF" }} />
          </IconButton>
        )}

       
      </CardActions>

      {/* Edit Modal */}
      {showEditCat && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={() => setShowEditCat(false)}
          show={showEditCat}
          onSubmit={async (values) =>
            await handleUpdateCategory(id, dispatch, values, page, is_sub, parentCategory)
          }
          passedData={{
            name_ar: title2?.ar?.name,
            name_en: title2?.en?.name,
            image: img,
          }}
          title={"تعديل الصنف"}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <AttentionModal
          handleClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          message={"هل انت متاكد من حذف هذا العنصر ؟"}
          title={"تأكيد عملية الحذف"}
          onOk={async () =>
            await handleDelete(id, dispatch, page, () => setShowDeactiveModal(false), is_sub, parentCategory)
          }
          onIgnore={() => setShowDeleteModal(false)}
          show={showDeleteModal}
        />
      )}

      {/* Deactivate/Activate Confirmation Modal */}
      {showDeactiveModal && (
        <AttentionModal
          handleClose={() => setShowDeactiveModal(false)}
          loading={deactiveLoading}
          message={"هل أنت متأكد من هذه العملية"}
          title={is_active ? "تأكيد عملية إلغاء التنشيط" : "تأكيد عمليةالتنشيط"}
          onOk={async () =>
            await handleDeactivate(id, dispatch, page, () => setShowDeactiveModal(false), is_active, is_sub, parentCategory)
          }
          onIgnore={() => setShowDeactiveModal(false)}
          show={showDeactiveModal}
        />
      )}
    </Card>
  );
};

export default CategoryCard;