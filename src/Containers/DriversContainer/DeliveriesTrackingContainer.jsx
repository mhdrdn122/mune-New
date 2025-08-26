import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine"; // Import as side effect for L.Routing
import "./Style.css";
import { useGetDeliveriesQuery } from "../../redux/slice/deliveries/deliveriesApi";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";

// تحديد الأيقونات المخصصة
const driverIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const customerIcon = L.icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// مكون لتحريك الخريطة إلى إحداثيات محددة
const FlyToMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, 13, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

// مكون خاص بعرض المسار
const RouteMachine = ({ driverPosition, customerPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // إزالة المسار القديم إذا كان موجودًا
    if (map.routingControl) {
      map.removeControl(map.routingControl);
    }
    
    // يجب أن تكون الإحداثيات أرقامًا
    const driverLat = parseFloat(driverPosition[0]);
    const driverLon = parseFloat(driverPosition[1]);
    const customerLat = parseFloat(customerPosition[0]);
    const customerLon = parseFloat(customerPosition[1]);

    if (!isNaN(driverLat) && !isNaN(driverLon) && !isNaN(customerLat) && !isNaN(customerLon)) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(driverLat, driverLon),
          L.latLng(customerLat, customerLon),
        ],
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4, opacity: 0.7 }],
        },
        createMarker: (i, waypoint, n) => {
          const markerIcon = i === 0 ? driverIcon : customerIcon;
          return L.marker(waypoint.latLng, { icon: markerIcon });
        },
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(map);

      map.routingControl = routingControl;
    }
  }, [map, driverPosition, customerPosition]);

  return null;
};

// المكون الرئيسي لتتبع عمليات التوصيل
const DeliveriesTrackingContainer = () => {
  const {
    data: deliveries,
    isLoading: loading,
  } = useGetDeliveriesQuery({});

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDrivers, setShowDrivers] = useState(false);

  const defaultPosition = [33.5138, 36.2765];
  const zoomLevel = 10;

  // الوصول لإحداثيات السائق
  const selectedDriverPosition = selectedDriver && selectedDriver.latitude && selectedDriver.longitude
    ? [selectedDriver.latitude, selectedDriver.longitude]
    : null;

  // الوصول لإحداثيات الزبون
  const customerPosition = selectedDriver && selectedDriver.invoice && selectedDriver.invoice.length > 0 && selectedDriver.invoice[0].latitude && selectedDriver.invoice[0].longitude
    ? [selectedDriver.invoice[0].latitude, selectedDriver.invoice[0].longitude]
    : null;

    if (loading) {
        return (
          <div className="flex justify-content-center gap-1 my-5 ">
            <DynamicSkeleton
              count={1}
              variant="rounded"
              height={550}
              animation="wave"
              spacing={3}
              columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            />
          </div>
        );
      }

  return (
    <div className="relative flex flex-col min-h-[900px]">
      <div className="flex-1 w-full relative flex flex-col-reverse lg:flex-row ">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-64 h-screen bg-[#D9D9D9] shadow-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Drivers</h3>
          <ul className="space-y-2">
            {deliveries?.data?.map((driver) => (
              <li
                key={driver.id}
                className={`p-2 cursor-pointer hover:bg-gray-100 rounded-md ${
                  selectedDriver?.id === driver.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="font-semibold">{driver.name}</div>
                <div className="text-sm text-gray-600">Status: {driver.status}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Map Container */}
        <div className="flex-1 wrapper-map h-[70vh] lg:h-screen w-full relative">
          <MapContainer
            center={defaultPosition}
            zoom={zoomLevel}
            style={{ height: "100%", width: "100%", minHeight: "400px", minWidth: "300px", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* عرض المسار بين السائق والعميل */}
            {selectedDriverPosition && customerPosition && (
              <RouteMachine driverPosition={selectedDriverPosition} customerPosition={customerPosition} />
            )}

            {/* عرض نقطة السائق المختار فقط */}
            {selectedDriverPosition && (
              <Marker
                key={`driver-${selectedDriver.id}`}
                position={selectedDriverPosition}
                icon={driverIcon}
              >
                <Popup>
                  <div className="font-bold">{selectedDriver.name}</div>
                </Popup>
              </Marker>
            )}

            {/* عرض نقطة الزبون إذا تم تحديد سائق */}
            {selectedDriver && customerPosition && (
              <Marker
                key="customer-marker"
                position={customerPosition}
                icon={customerIcon}
              >
                <Popup>
                  <div className="font-bold">Customer</div>
                </Popup>
              </Marker>
            )}

            {selectedDriverPosition && <FlyToMarker position={selectedDriverPosition} />}
            
          </MapContainer>
        </div>
      </div>
      
      {/* Bottom navigation for mobile screens */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
        <div className="bg-gray-200 p-2 flex justify-center">
          <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg" onClick={() => setShowDrivers(!showDrivers)}>
            {showDrivers ? "Hide Drivers" : "Show Drivers"}
          </button>
        </div>
      </div>

      {/* Bottom Sheet for Drivers (Mobile) */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg transition-transform duration-300 ease-in-out z-[90] ${
          showDrivers ? "translate-y-0" : "translate-y-full"
        } lg:hidden`}
      >
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">Drivers</h4>
            <button onClick={() => setShowDrivers(false)} className="text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            {deliveries?.data?.map((driver) => (
              <li
                key={driver.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 rounded-md ${selectedDriver?.id === driver?.id ? "bg-gray-200" : ""}`}
                onClick={() => {
                  setSelectedDriver(driver);
                  setShowDrivers(false);
                }}
              >
                <div className="font-semibold">{driver?.name}</div>
                <div className="text-sm text-gray-600">Status: {driver?.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Driver details (fixed at the bottom center) */}
      {selectedDriver && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white shadow-xl p-4 rounded-2xl !z-[100000] w-[90%] max-w-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-semibold">Driver Details</h4>
            <button className="text-gray-500 hover:text-gray-800" onClick={() => setSelectedDriver(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Driver</th>
                  <th className="p-2 border">Invoice</th>
                  <th className="p-2 border">Pickup Date</th>
                  <th className="p-2 border">Expected Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">{selectedDriver.name || "N/A"}</td>
                  <td className="p-2 border">{selectedDriver.invoice[0]?.id || "N/A"}</td>
                  <td className="p-2 border">{selectedDriver.invoice[0]?.created_at || "N/A"}</td>
                  <td className="p-2 border">{selectedDriver.invoice[0]?.total_estimated_duration || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DeliveriesTrackingContainer;