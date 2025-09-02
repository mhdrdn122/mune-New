// Optimized and cleaned-up version of NavBarUser with a responsive design
import { useContext, useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { AdminContext } from "../../context/AdminProvider";
import { LanguageContext } from "../../context/LanguageProvider";
import Search from "../../components/user/template6/Search";

import { MdAddShoppingCart, MdHome, MdLanguage } from "react-icons/md";
import { FaUserCircle, FaStar, FaShoppingBag } from "react-icons/fa";

const NavBarUser = ({ handleShow, searchWord, setSearchWord, withRatings }) => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { orders: ordersState } = useSelector((state) => state.orders);
  const { username } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isTakeout = localStorage.getItem("isTakeout");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [heSaidNo, setHeSaidNo] = useState(localStorage.getItem("heSaidNo"));


  useEffect(() => {
    updateUsername(username);
  }, [username]);

  useEffect(() => {
    const syncStorage = () => setHeSaidNo(localStorage.getItem("heSaidNo"));
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);



  const badgeCount = ordersState.length > 10 ? "9+" : ordersState.length;
  const backgroundColor = adminDetails?.color?.substring(10, 16) || "ffffff";

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  const getBackgroundColor = () => `#${backgroundColor}`;

  // Conditionally render the cart icon based on the order status and heSaidNo
  const renderCartIcon = () =>
    ((adminDetails?.is_order === 1 && heSaidNo !== "true") ||
      adminDetails?.is_takeout === 1) && (
      <Link to={`/${username}/orders`} className="relative">
        <MdAddShoppingCart size={24} className="text-white" />
        {badgeCount > 0 && (
          <span className="absolute top-[-5px] right-[-10px] bg-white text-primary-500 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
            {badgeCount}
          </span>
        )}
      </Link>
    );

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className="hidden md:flex justify-between items-center px-4 py-3 shadow-md"
        style={{
          backgroundColor: getBackgroundColor(),
          borderRadius: "0 0 20px 20px"
        }}
      >
        {/* Left Section - Logo */}
        <div className="flex items-center">


          <Link to={`/${username}`}>
            <img
              src={adminDetails?.logo_home_page}
              alt="logo"
              className="w-12 h-12 rounded-full"
            />
          </Link>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-6">
          <Link to={`/${adminDetails?.name_url}/takeout`}>
            <MdHome size={24} className="text-white" />
          </Link>

          {renderCartIcon()}

          <Link to={`/${adminDetails?.name_url}/rating`}>
            <FaStar size={24} className="text-white" />
          </Link>

          {
            isTakeout && (
              <>
                <Link to={`/${adminDetails?.name_url}/my-orders`}>
                  <FaShoppingBag size={24} className="text-white" />
                </Link>
                <Link to={`/${adminDetails?.name_url}/profile`}>
                  <FaUserCircle size={24} className="text-white" />
                </Link>
              </>
            )
          }

        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Navbar */}
        <nav
          className="flex justify-between items-center px-4 py-2 shadow-md fixed top-0 left-0 right-0 z-50"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          <Link to={`/${username}`} className="w-1/3 flex  ">
            <img
              src={adminDetails?.logo_home_page}
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
          </Link>

          {
            isTakeout && (
              <Link to={`/${adminDetails?.name_url}/profile`}>
                <FaUserCircle size={24} className="text-white" />
              </Link>
            )
          }



        </nav>

        {/* Bottom Navbar */}
        <nav
          className="flex justify-around items-center px-4 py-3 shadow-md fixed bottom-0 left-0 right-0 z-50"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          <Link to={`/${adminDetails?.name_url}/takeout`}>
            <MdHome size={24} className="text-white" />
          </Link>
          <Link to={`/${adminDetails?.name_url}/rating`}>
            <FaStar size={24} className="text-white" />
          </Link>



          {
            isTakeout && (
              <>
                <Link to={`/${adminDetails?.name_url}/my-orders`}>
                  <FaShoppingBag size={24} className="text-white" />
                </Link>

              </>
            )

          }

          <div>{renderCartIcon()}</div>
        </nav>
      </div>
    </>
  );
};

export default NavBarUser;
