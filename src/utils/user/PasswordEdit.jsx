import { useContext, useState } from "react";
import { TextField, Grid, Typography, Button, Box } from "@mui/material";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { AdminContext } from "../../context/AdminProvider";
import notify from "../useNotification";
import axios from "axios";

const PasswordEdit = ({
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  userToken,
}) => {
  const [loading, setLoading] = useState(false);
  const { adminDetails } = useContext(AdminContext);

  const textFieldStyles = {
    backgroundColor: "#BDD358",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: `#${adminDetails?.color?.substring(10, 16)}`,
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: `#${adminDetails?.color?.substring(10, 16)}`,
      },
    },
  };
  const handleSubmitChangePassword = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmPassword);

    try {
      const response = await axios.post(
        `${baseURLLocalPublic}/user_api/change_password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      notify(response?.data?.message, "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      notify(error?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        تغيير كلمة المرور
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="كلمة المرور الحالية"
            variant="outlined"
            type="password"
            fullWidth
            className="bg-[#BDD358]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="كلمة المرور الجديدة"
            variant="outlined"
            type="password"
            fullWidth
            className="bg-[#BDD358]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="تأكيد كلمة المرور الجديدة"
            variant="outlined"
            type="password"
            fullWidth
            className="bg-[#BDD358]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: `#${adminDetails?.color?.substring(10, 16)}`,
              "&:hover": { backgroundColor: "#555" },
              px: 4,
              py: 1.5,
              borderRadius: "8px",
            }}
            disabled={
              loading ||
              !oldPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            onClick={handleSubmitChangePassword}
          >
            حفظ التغييرات
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordEdit;
