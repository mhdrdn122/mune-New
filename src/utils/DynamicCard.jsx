import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Grid,
  Divider,
  Box,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { usePermissions } from "../context/PermissionsContext";
import useGetStyle from "../hooks/useGetStyle";

const DynamicCard = ({
  data,
  fields = [
    { key: "name", label: "الاسم" },
    { key: "username", label: "اسم الحساب" },
    { key: "phone", label: "رقم الموبايل" },
    { key: "birthDate", label: "تاريخ الميلاد" },
    { key: "address", label: "العنوان" },
    {
      key: "is_active",
      label: "الحالة",
      format: (value) => (value == 1 ? "Active" : "Not Active"),
    },
  ],
  actions = [
    { name: "edit", icon: <EditIcon fontSize="small" />, permission: "edit" },
    {
      name: "delete",
      icon: <DeleteIcon fontSize="small" />,
      permission: "delete",
    },
    {
      name: "block",
      icon: <BlockOutlinedIcon fontSize="small" />,
      permission: "block",
    },
    {
      name: "invoice",
      icon: <ReceiptIcon fontSize="small" />,
      permission: "invoice",
    },
  ],
  onAction,
  showImage = false,
  showActionTitle = false,

  imageKey = "image",
  titleKey = "name",
  statusKey = "is_active",
}) => {
  const { hasPermission } = usePermissions();
  const { Color } = useGetStyle();

  return (
    <Card
      sx={{
        maxWidth: "500px",
        width: 310,
        margin: "auto",
        borderRadius: 2,
        boxShadow: 3,
        direction: "rtl",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Header with action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: Color ? "#" + Color :  "#2F4B26",
          padding: "8px 16px",
          borderBottom: "1px solid #e0e0e0",
          borderRadius: "10px 10px 0 0 ",
        }}
      >
        {!showActionTitle && (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold" }}
          ></Typography>
        )}

        {showActionTitle && (
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" , color:"#fff" }}>
            {titleKey}
          </Typography>
        )}

        <Box>
          {actions.map(
            (action) =>
              hasPermission(action.permission) && (
                <IconButton
                  key={action.name}
                  aria-label={action.name}
                  onClick={() => onAction && onAction(action.name, data)}
                  size="small"
                  sx={{
                    backgroundColor: Color ? "#" + Color : "#2F4B26",
                    color: "#fff",
                    marginLeft: "4px",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#f0f0f0", color: Color ? "#" + Color : "#2F4B26" },
                  }}
                >
                  {action.icon}
                </IconButton>
              )
          )}
        </Box>
      </Box>

      <CardContent sx={{ padding: "16px", backgroundColor: "#D9D9D9" }}>
        <Grid container spacing={2}>
          {/* Image column */}
          {showImage && (
            <Grid item xs={4}>
              <Avatar
                src={data[imageKey]}
                sx={{
                  width: 60,
                  height: 60,
                  margin: "0 auto",
                  boxShadow: 3,
                  border: "2px solid white",
                }}
              >
                {data[titleKey]?.charAt(0)}
              </Avatar>
            </Grid>
          )}

          {/* Info column */}
          <Grid item xs={showImage ? 8 : 12}>
            <Stack spacing={1}>
              {fields.map((field) => (
                <Box key={field.key} className="flex items-center gap-2">
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {field.format
                      ? field.format(data[field.key])
                      : data[field.key]}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DynamicCard;
