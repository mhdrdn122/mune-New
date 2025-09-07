import { useEffect, useMemo, useRef, useState } from "react";

import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const Icon = L.icon({
   iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
   shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
// Component to handle marker placement and address fetching on the map
function LocationMarker({
  setCity,
  setRegion,
  setLongitude,
  setLatitude,
  setLoading,
}) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("Fetching location...");
  const markerRef = useRef(null);
  const map = useMap();

  // Fetch address from coordinates using Nominatim API
  const getAddressFromCoordinates = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.address) {
        const { city, state, country, road, house_number, suburb } =
          data.address;
        const formattedAddress = `${house_number ? house_number + ", " : ""}${
          road || ""
        }, ${city || state || ""}, ${country || ""}`;
        setAddress(formattedAddress);
        setCity(city || state || "");
        setRegion(suburb || "غير متوفر");
      } else {
        setAddress("Address not found");
        notify("Address not found", "error");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
      notify("Error fetching address", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle map events for location detection
  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      setLongitude(e.latlng.lng);
      setLatitude(e.latlng.lat);
      getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
    },
  });

  // Initialize map location on component mount
  useEffect(() => {
    map.locate();
  }, [map]);

  // Handle marker drag events
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPosition = marker.getLatLng();
          setPosition(newPosition);
          setLongitude(newPosition.lng);
          setLatitude(newPosition.lat);
          getAddressFromCoordinates(newPosition.lat, newPosition.lng);
        }
      },
    }),
    []
  );

  if (!position) return null;

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      icon={Icon}

      position={position}
      ref={markerRef}
    >
      <Popup>
        Current Location: <br />
        <b>{address || "Loading..."}</b>
      </Popup>
    </Marker>
  );
}

export default LocationMarker;
