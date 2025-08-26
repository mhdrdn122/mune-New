import React, { useContext, useEffect, useState } from 'react'
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { Box, TextField, Unstable_Grid2 as Grid, IconButton } from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { LuPlus } from 'react-icons/lu';
import axios from 'axios';
import { baseURLLocalPublic } from '../../../Api/baseURLLocal';
import { AdminContext } from '../../../context/AdminProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, Typography } from "@mui/material";
import { Modal, Spinner } from 'react-bootstrap';
import notify from '../../../utils/useNotification';
import { ToastContainer } from 'react-toastify';
import { IoQrCodeOutline } from 'react-icons/io5';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { FaShareAlt } from 'react-icons/fa';

const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#E0E3E7",
              "--TextField-brandBorderHoverColor": "#B2BAC2",
              "--TextField-brandBorderFocusedColor": "#6F7E8C",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
                fontWeight: 700,
                // color: "var(--dark-100)",
              },
              "& label.MuiInputLabel-root": {
                fontWeight: 700,
                color: "var(--dark-100)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              [`.${outlinedInputClasses.notchedOutline}`]: {
                borderRadius: 8,
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 14,
                fontWeight: 400,
                color: "var(--gray-100)",
              },
            },
          },
        },
      },
    });

const QrInformation = () => {
    const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));

    const [QrInfo,setQrInfo]=useState({});
    const [qrId,setQrId]=useState(null)
    const [qrImg,setQrImg]=useState(null)
    const {id}=useParams();
    const {cityId}=useParams();
    const [fetchResponse,setFetchResponse]=useState()
    const [loading,setLoading]=useState(false)
  
    const [showQR, setShowQR] = useState(false);
    const handleShowQR = (item) => {
      setShowQR(item);
      console.log('item : ',item)
    };
    const handleCloseQR = () => {
      setShowQR(false);
    };
    const navigate=useNavigate()
  useEffect(()=>{
      console.log('adminDetailsasd Id: ',id)
    const getQrInf= async()=>{
      try {
        let response = await axios.get(`${baseURLLocalPublic}/superAdmin_api/show_qr?restaurant_id=${id}`,{
          headers:{
            'Authorization': `Bearer ${superAdminInfo.token}`
          }
        }).then((response)=>{
            console.log('response inside : ',response)
            setQrId(response?.data?.data?.id)
            setQrImg(response?.data?.data?.qr_code)
            formik.setValues({
              name: response?.data?.data?.name,
              email: response?.data?.data?.email,
              phone: response?.data?.data?.phone,
              facebook_url: response?.data?.data?.facebook_url,
              instagram_url: response?.data?.data?.instagram_url,
              whatsapp_phone: response?.data?.data?.whatsapp_phone,
              address: response?.data?.data?.address,
              restaurant_url:response?.data?.data?.restaurant_url,
              website:response?.data?.data?.website,
            //   admin_id:id,
            restaurant_id:id,
              id:response?.data?.id
            });
          })
      } catch (error) {
        console.log('error : ',error)
      }
    }
    getQrInf();

  },[])
  const formik =useFormik({
    initialValues: {
      name:'',
      email:'',
      phone:'',
      facebook_url:'',
      instagram_url:'',
      whatsapp_phone:'',
      address:'',
      restaurant_url:'',
      website:'',
    //   admin_id:id??'',
      restaurant_id:id??'',
      id:qrId??''
    },
    onSubmit:async(values)=>{
        console.log('values : ',values)
        const filteredValues = {};
        Object.entries(values).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            filteredValues[key] = value;
          }})   
          console.log('filteredValues : ',filteredValues)
        try{
          setLoading(true)
        let response =await axios.post(`${baseURLLocalPublic}/superAdmin_api/add_qr`,filteredValues,{
          headers:{
            'Authorization': `Bearer ${superAdminInfo.token}`
          },
        }).then((response)=>{
          console.log('response after edit : ',response)
          if(response?.data?.status==true ){
              notify(response?.data?.message,"success");
            setTimeout(()=>{
                console.log('you made it ')
                navigate(`/super_admin/city/${localStorage.getItem('cityId')}/resturants`)
            },1000)
          }
        });

      }catch(error){  
        console.error('Error:', error.response?.data || error.message);      
      }finally{
        setLoading(false)
      }
    }
  })

  const outerTheme = useTheme(); 

  useEffect(()=>{
    console.log('superAdminInfo : ',superAdminInfo)
  },2000)
  
  return (
    <div>
      <form noValidate onSubmit={formik.handleSubmit}>
          <Box
        sx={{
          width: "100%",
          display: "grid",
          paddingTop: 0,
          marginLeft: 0,
        }}
      >
        <ThemeProvider theme={customTheme(outerTheme)}>

            <h1 className='text-center mb-5 mt-5'>Create QR Offline</h1>
            {formik?.values?.qr_offline!==null &&
               <div className=" m-auto">
                  <Grid >
                    <IconButton size="large"
                        sx={{ color: "#000" }}
                        onClick={() => handleShowQR(qrImg)}>
                        <IoQrCodeOutline  onClick={() => {}} />
                      </IconButton>
                    </Grid>
                </div>}
        <div className="m-5" /*profile-section-container */  >
        <Grid container spacing={3} sx={{ paddingTop: "15px" }}>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="NameRestaurant"
                    name="name"
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="CablePhone"
                    name="phone"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="whatsapp_phone"
                    name="whatsapp_phone"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.whatsapp_phone}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="facebook_url"
                    name="facebook_url"
                    onChange={formik.handleChange}
                    value={formik.values.facebook_url}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="instagram_url"
                    name="instagram_url"
                    onChange={formik.handleChange}
                    value={formik.values.instagram_url}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="address"
                    name="address"
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="url menu"
                    name="restaurant_url"
                    onChange={formik.handleChange}
                    value={formik.values.restaurant_url}
                    onBlur={formik.handleBlur}
                 
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="website"
                    name="website"
                    onChange={formik.handleChange}
                    value={formik.values.website}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
        </Grid>
      <Box mt={3}>
          <Button
            variant="outlined"
            sx={{ marginRight: "5px" }}
            onClick={() => navigate(-1)}
          >
            تجاهل
          </Button>        

           
        {loading === true ? (
          <Button variant="outlined" className="">
            <Spinner
              className="m-auto"
              animation="border"
              role="status"
            ></Spinner>
          </Button>
        ) : (
          <Button type="submit" variant="outlined">
            حفظ
          </Button>
        )}
        </Box>
        </div>
        <ToastContainer/>
        </ThemeProvider>
      </Box>
        </form>
        <Modal show={showQR} onHide={handleCloseQR} centered size="">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>QR Offline</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          display={"flex"}
          // flexDirection={isSmallDevice ? "column" : "row"}
          justifyContent={"center"}
          alignItems={"center"}
          m={"20px"}
        >
          <img
            src={qrImg}
            alt="click"
            width="70%"
            // height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>
           <IconButton>
              <a style={{color:'#111',fontSize:'50px'}}
               href={qrImg} download={qrImg}>
                  <DownloadForOfflineIcon fontSize="190px" />  
              </a>
          </IconButton>
          {/* Share Button */}
    <IconButton
      onClick={async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Share QR Code",
              text: "Check out this QR code!",
              url: qrImg, // QR image URL
            });
            console.log("QR code shared successfully!");
          } catch (error) {
            console.error("Error sharing QR code:", error.message);
          }
        } else {
          alert("Web Share API is not supported in your browser.");
        }
      }}
    >
      <FaShareAlt style={{ fontSize: "30px", color: "#000" }} />
    </IconButton>
        </Box>
      </Modal.Body>
    </Modal>

    </div>
  )
}

export default QrInformation