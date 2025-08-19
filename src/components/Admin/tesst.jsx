import ThreeSixty from "react-360-view";
import { Box } from "@mui/material";
import ReactPannellum, { getConfig } from "react-pannellum";
 import { useEffect, useState } from "react";


export function Counter() {
  const [longitude,setLongitude]=useState('');
  const [latitude,setLatitude]=useState('');
  const getLocation =()=>{
    console.log('geolocation render ')
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);
          setLongitude(position.coords.longitude)
          setLatitude(position.coords.latitude)
        },
        (error) => {
          console.error("Error Code: ", error.code, " - ", error.message);
        },
        {
          enableHighAccuracy: true, // تحاول استخدام GPS بدقة عالية
          timeout: 5000,
          maximumAge: 0, // لا تعتمد على بيانات قديمة
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  useEffect(()=>{
    console.log('hello from geolocation')
    setLongitude(0)
    setLatitude(0)
    getLocation()
  },[])
  
  const handleClick = () => {
    getLocation()
  };

  return (
    <div style={{
      height:'50vh',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      border:'none',
      outline:'none'
    }}>
      <div>
        <p className="mt-2">longitude : {longitude}</p>
        <p className="mt-2">latitude : {latitude}</p>
      </div>
      <div>
      <button className="mt-5" onClick={handleClick}>Click me</button>
      </div>
    </div>
  );
}
