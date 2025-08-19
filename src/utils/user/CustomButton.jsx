import React from "react";
import useGetStyle from "../../hooks/useGetStyle";

const CustomButton = ({
  children,
  onClick,
  loading = false,
  className = "",
  style = {},
  type,
}) => {
  const { Color, BackgroundColor } = useGetStyle();
   return (
    <button
      onClick={onClick}
      type={type || ""}
      className={`w-full font-bold py-2 text-[#2F4B26]
                           border-[#818360]   hover:opacity-90 transition ${className}`}
      style={{
        backgroundColor: `#${BackgroundColor || "BDD358"}`,
        color: Color ?  ("#" + Color) : "#000",
        borderRadius: "50px",
        border: "1px solid #2F4B26 ",
        ...style,
      }}
      disabled={loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-[#fff] mx-auto"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
