import { useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { useMediaQuery } from "@uidotdev/usehooks";
import StarIcon from "@mui/icons-material/Star";
/**
 * RatingCard Component
 * Displays a rating card with stars based on the rate value and user information.
 * @param {Object} props
 * @param {Object} props.data - Contains rating and user info
 * @param {Function} props.onClick - Function to handle card click
 */
const RatingCard = ({ data, onClick }) => {
  const [hoveredRate, setHoveredRate] = useState(0);
  const rate = data.rate || 0;
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const getStars = () => {
    const stars = [];
    for (let i = 1; i <= 3; i++) {
      stars.push(
        <StarIcon
          key={i}
          sx={{
            color: i <= (hoveredRate || rate) ? "#FFD700" : "#D9D9D9",
            fontSize: isSmallDevice ? 30 : 38,
          }}
        />
      );
    }
    return stars;
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        maxWidth: 300,
        width: "100%",
        margin: "10px auto",
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#E8F5E9",
        cursor: "pointer",
        padding: "20px 0",
        transition: "transform 0.2s",
        border: "1px solid  #2F4B26",

        "&:hover": { transform: "scale(1.02)" },
      }}
      className="w-full sm:w-72 md:w-80 lg:w-96 mx-auto"
    >
      <CardContent
        className="flex flex-col gap-3"
        sx={{ p: 2, textAlign: "right", direction: "rtl" }}
      >
        <div className="flex justify-center mb-2">{getStars()}</div>
        <div
          className="flex flex-col gap-3 fw-bold"
          style={{
            backgroundColor: "#BDD358",
            padding: "20px 10px",
            borderRadius: 4,
            minHeight: "150px",
            wordSpacing: "5px",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={800}
            color="#2F4B26"
            gutterBottom
          >
            الاسم : {data.name || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={800}
            color="#2F4B26"
            gutterBottom
          >
            الرقم : {data.phone || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={800}
            color="#2F4B26"
            gutterBottom
          >
            العمر : {data.birthday || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={800}
            color="#2F4B26"
            gutterBottom
          >
            الملاحظات : {data.note || "N/A"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingCard;
