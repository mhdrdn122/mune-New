import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Link, useParams } from "react-router-dom";
import whatss from "../../../assets/User/واتس.png";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import "./styleTemp6.css";

const HomeTemp6 = () => {
  const { adminDetails, updateUsername, updateTableId } =
    useContext(AdminContext);

  const [adminInfo, setAdminInfo] = useState("");
  const { username, table_id } = useParams();

  const handleUpdateUsername = () => {
    updateUsername(username);
  };

  useEffect(() => {
    handleUpdateUsername();
    updateTableId(table_id);
    if (table_id !== undefined) {
      localStorage.setItem("tableId", table_id);
    }
  }, [username]);

  useEffect(() => {
    setAdminInfo(adminDetails?.cover);
  }, [adminDetails]);


  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url('${adminInfo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="oreint_house_home"
    >
      <div className="social_media">
        <div
          className="w-100 d-flex justify-content-center"
          style={{ gap: "15px", paddingLeft: "0px" }}
        >
          {adminDetails.facebook_url && (
            <div
              className="d-flex align-items-center social"
              style={{
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              <Link target="_blank" to={adminDetails.facebook_url}>
                <FaFacebookF color="white" />
              </Link>
            </div>
          )}
          {adminDetails.instagram_url && (
            <div
              className="d-flex align-items-center social"
              style={{
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              <Link target="_blank" to={adminDetails.instagram_url}>
                <AiOutlineInstagram color="white" />
              </Link>
            </div>
          )}
          {adminDetails.whatsapp_phone && (
            <div
              className="d-flex align-items-center justify-content-center  social"
              style={{
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              <Link
                target="_blank"
                to={`https://wa.me/+963${adminDetails.whatsapp_phone.substring(
                  0
                )}`}
              >
                <img src={whatss} alt="whatsapp" />
              </Link>
            </div>
          )}
        </div>

        {adminDetails && adminDetails.menu_template_id && (
          <Link
            to={`/${username}/template/${
              adminDetails && adminDetails.menu_template_id
            }/home`}
          >
            <button
              style={{
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              menu
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeTemp6;
