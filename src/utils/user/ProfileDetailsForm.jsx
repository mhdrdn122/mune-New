import  { useContext,  useState } from "react";
import { TextField, Grid, Typography, Button, Box } from "@mui/material";
import { AdminContext } from "../../context/AdminProvider";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import notify from "../useNotification";

const ProfileDetailsForm = ({
  name1,
  username,
  email,
  number,
  setNumber,
  setUserName,
  setName1,
  setEmail,
  userToken,
  getProfileInf,
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

  const handleEditProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name1);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", number);
    try {
      const response = await axios.post(
        `${baseURLLocalPublic}/user_api/update_profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      notify(response?.data?.message, "success");
      getProfileInf();
    } catch (error) {
      notify(error?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        تعديل الملف الشخصي
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={name1}
            label="الاسم الكامل"
            onChange={(e) => setName1(e.target.value)}
            // variant="outlined"
            className="bg-[#BDD358]"
            fullWidth
            autoFocus={true}
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={username}
            label="اسم المستخدم"
            onChange={(e) => setUserName(e.target.value)}
            variant="outlined"
            className="bg-[#BDD358]"
            fullWidth
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={email}
            label="البريد الإلكتروني"
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            className="bg-[#BDD358]"
            fullWidth
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={number}
            label="رقم الهاتف"
            onChange={(e) => setNumber(e.target.value)}
            variant="outlined"
            className="bg-[#BDD358]"
            fullWidth
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
            onClick={handleEditProfile}
            disabled={loading || !name1 || !username || !email || !number}
          >
            حفظ التغييرات
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileDetailsForm;
