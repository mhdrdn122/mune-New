import { useEffect, useState } from "react";

const useGetStyle = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const res = localStorage.getItem("adminInfo") || '{}';
    try {
      const parsedData = JSON.parse(res);
      setStyle(parsedData?.restaurant || parsedData);
    } catch (error) {
      console.error("Failed to parse adminInfo:", error);
      setStyle({});
    }
  }, []);

  const Color = style?.color ? style?.color?.substring(10, 16) : "2F4B26";
  const BackgroundColor = style?.background_color?.substring(10, 16)
  const BackgroundImg = style?.background_image_home_page
  const Logo = style?.logo



  return {
    Color,
    BackgroundColor,
    BackgroundImg,
    Logo
  };
};

export default useGetStyle;