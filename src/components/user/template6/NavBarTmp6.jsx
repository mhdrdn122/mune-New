import search from "../../../assets/User/icon _search outline_.png";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { Dropdown, Form, Modal } from "react-bootstrap";
 import axios from "axios";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import "./styleTemp6.css";
import Search from "./Search";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrLanguage } from "react-icons/gr";
import { Badge } from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";

const NavBarTmp6 = ({ searchWord, setSearchWord }) => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { orders: ordersState } = useSelector((state) => state.orders);
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const style = {
    "& .MuiBadge-badge": {
      backgroundColor: "rgba(255,255,255,0.9)",
      color: "var(--color)",
      fontFamily: "var(--fontFamily) !important",
      width: "20px",
      "&::after": {
        width: "100%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
      },
    },
  };

  return (
    <nav
      className="nav_bar_menu px-3"
      style={{
        backgroundColor: `#${
          adminDetails &&
          adminDetails.color &&
          adminDetails.color.substring(10, 16)
        }`,
        // flexDirection: language === "en" ? "row-reverse" : "row",
      }}
    >
      <div
        className="nav_bar_menu_left"
        // style={{ flexDirection: language === "en" ? "row-reverse" : "row" }}
      >

        {adminDetails?.is_order === 1 && (
          <Link to={`/${username}/orders`}>
            <Badge
              badgeContent={ordersState.length > 10 ? "9+" : ordersState.length}
              className={"text-white"}
              sx={style}
              showZero
            >
              <MdAddShoppingCart
                onClick={() => {}}
                style={{
                  color: "white",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              />
            </Badge>
          </Link>
        )}

        <Dropdown>
          <Dropdown.Toggle variant="" id="dropdown-basic" className="px-0 mx-0">
            <GrLanguage className="icon_language" />
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="drop_down py-1"
            style={{
              backgroundColor: `#${
                adminDetails &&
                adminDetails.color &&
                adminDetails.color.substring(10, 16)
              }`,
            }}
          >
            <Dropdown.Item
              href=""
              target="_blank"
              // disabled={language === "en"}
              disabled={localStorage.getItem('language') === "en"}
              className="dorp_down_item "
            >
              <p className="toggle_language" onClick={()=>toggleLanguage("en")}>
                {"EN"}
              </p>
            </Dropdown.Item>
            <Dropdown.Item
              href=""
              target="_blank"
              // disabled={language === "ar"}
              disabled={localStorage.getItem('language') === "ar"}
              className="dorp_down_item "
            >
              <p className="toggle_language" onClick={()=>toggleLanguage("ar")}>
                {"AR"}
              </p>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div>
          <Search
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            language={language}
          />
        </div>
      </div>

      <div className="orient_logo d-flex align-items-center">
        <Link
        //  to={`/${username}/home`}
         >
          <LazyLoadImage
            src={adminDetails && adminDetails.logo}
            alt="logo"
            effect="blur"
            style={{
              top:'0px',
              height:'100%'
            }}
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavBarTmp6;
