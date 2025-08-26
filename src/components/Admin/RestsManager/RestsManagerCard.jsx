// This file defines a card component used to display individual restaurant information within a list.
// It supports lazy loading of images and user interaction through card click.

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./RestsManagerCard.css";

/**
 * RestsManagerCard displays the logo and name of a restaurant and triggers a callback when clicked.
 * It uses lazy loading for the image to optimize performance.
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - Restaurant object containing `name`, `logo`, and `id`
 * @param {Function} props.handleClick - Callback function when a card is clicked
 *
 * @returns {JSX.Element} A single restaurant card
 */
const RestsManagerCard = ({ item, handleClick }) => {
  const [visible, setVisible] = useState(false); // Controls image visibility via lazy loading
  const [imageLoading, setImageLoading] = useState(true); // Shows loader while image loads
  const placeholderRef = useRef(null); // Ref for IntersectionObserver

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Uses IntersectionObserver to load the image only when it's in the viewport.
   */
  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio > 0) {
          setVisible(true);
        }
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible, placeholderRef]);

  return (
    <Card sx={{ width: 260, padding: 0 }} className="cardRest">
      <Link style={{ color: "inherit" }} onClick={() => handleClick(item)}>
        {/* If image is visible (in viewport), load it */}
        {visible ? (
          <CardMedia
            sx={{
              boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            {imageLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Loading...
              </div>
            )}
            <img
              src={item?.logo}
              alt="Product Image"
              onLoad={() => setImageLoading(false)}
              style={{
                width: "100%",
                height: "100%",
                visibility: imageLoading ? "hidden" : "visible",
              }}
            />
          </CardMedia>
        ) : (
          // Placeholder div to occupy space until image becomes visible
          <div
            style={{ height: 260, backgroundColor: "#EEE" }}
            aria-label="Product Image"
            ref={placeholderRef}
          />
        )}

        {/* Restaurant Name */}
        <CardContent className="pb-3">
          <Typography gutterBottom variant="h5" component="div" dir="rtl">
            {item?.name}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RestsManagerCard;
