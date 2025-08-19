import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { MapContainer, TileLayer } from "react-leaflet";
import notify from "../../utils/useNotification";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { UserContext } from "../../context/UserProvider";
import { AdminContext } from "../../context/AdminProvider";
import LocationMarker from "../../components/user/LocationMarker";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const AddAddressModal = ({
  show,
  handleClose,
  setIsSelectedAddress,
  setLongitude,
  setLatitude,
  longitude,
  latitude,
  setIsDeliveryModal,
  setDelivery_price,
  isDelivery,
  setIsDelivery,
  address,
  setAddress,
}) => {
  const { adminDetails } = useContext(AdminContext);
  const { userToken } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [apartment, setApartment] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [position, setPosition] = useState([33.505, 35]);

  const fetchAddresses = async () => {
    if (!userToken) return;
    try {
      const response = await axios.get(
        `${baseURLLocalPublic}/user_api/show_address`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setAddresses(response?.data?.data);
    } catch (error) {
      notify("Failed to fetch addresses.", "error");
    }
  };

  useEffect(() => {
    fetchAddresses();
    if (tabValue === 0) {
      setAddress("");
    }
  }, [userToken, tabValue]);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (tabValue === 0 && (!longitude || !latitude)) {
        notify("يجب عليك تحديد موقعك", "warn");
        return;
      }

      const payload =
        tabValue === 1
          ? { address }
          : {
              longitude,
              latitude,
              city,
              region,
              description: apartment,
            };

      const response = await axios.post(
        `${baseURLLocalPublic}/user_api/add_address`,
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setDelivery_price(response.data?.data?.delivery_price);
      setIsSelectedAddress(true);
      setIsDeliveryModal(true);
      handleClose();
      notify("لقد تم تحديد الموقع بنجاح", "success");
    } catch (error) {
      notify(error?.response?.data?.message || "Error saving address", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCity("");
    setRegion("");
    setApartment("");
    setAddress("");
    setLongitude(null);
    setLatitude(null);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="m-auto text-center">
          {" "}
          إضافة العنوان الخاص بك
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="address selection tabs"
          className="flex w-full"
        >
          <Tab className="flex-1" label="اختر عنوان من الخريطة " {...a11yProps(0)} />
          <Tab className="flex-1" label="اختر عنوان من عناوينك السابقة" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {isDelivery && (
            <div className="fade-in">
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  setCity={setCity}
                  setRegion={setRegion}
                  setLongitude={setLongitude}
                  setLatitude={setLatitude}
                  setLoading={setLoading}
                />
              </MapContainer>
              <div className="my-3">
                <TextField
                  className="my-2"
                  label="المدينة"
                  fullWidth
                  variant="outlined"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  className="my-2"
                  label="المنطقة"
                  fullWidth
                  variant="outlined"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  className="my-2"
                  label="تفاصيل"
                  fullWidth
                  variant="outlined"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <div className="address-box p-3 mb-3 shadow-sm rounded">
            <h5 className="text-end">اختر من عناوينك السابقة </h5>
            <select
              className="form-select"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <option value="" disabled>
                اختر عنوان
              </option>
              {addresses?.map((addr, index) => (
                <option key={addr.id || index} value={addr.id}>
                  {addr.region || "Unspecified Address"}
                </option>
              ))}
            </select>
          </div>
        </TabPanel>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column">
        <FormControlLabel
          control={
            <Switch
              checked={isDelivery}
              onChange={() => setIsDelivery(!isDelivery)}
              color="primary"
            />
          }
          label={isDelivery ? "توصيل الطلب" : "استلام ذاتي"}
          className="mb-3"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        />
        <Button
          className="w-100 text-white shadow-sm"
          style={{
            backgroundColor: `#${adminDetails?.color?.substring(10, 16)}`,
          }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "تأكيد"}
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shadow-sm {
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Modal>
  );
};

export default AddAddressModal;
