import { useContext, useEffect } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Link, useParams } from "react-router-dom";
import facebook from "../../../assets/User/pngegg.png";
import insta from "../../../assets/User/insta.png";
import whatss from '../../../assets/User/واتس.png'


const HomePage = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  

  return (
    <div style={{ height: "100vh" }} className="bgColor"> 
  
      <div className="banner">
        <Link to={adminDetails.cover}>
          <img
            src={adminDetails.cover}
            alt=""
          />
        </Link>
      </div>
      <div className="Details_home_page">
        <Link   to={`/${username}`}>
          <img
            src={adminDetails.logo}
            alt="logo"
          />
        </Link>
        <p style={{ color: `#${adminDetails.color &&adminDetails?.color.substring(10,16)}` }}>
          {adminDetails.menu_name}
        </p>
        {
          adminDetails.facebook_url && (
            <div className="d-flex align-items-center social">
            <Link target="_blank" to={adminDetails.facebook_url}>
            <img src={facebook} alt="" className="p-1" style={{ background: `#${adminDetails.color &&adminDetails?.color.substring(10,16)}` }} />
            </Link>
          </div>
          )
        }
        {
          adminDetails.instagram_url && (
            <div className="d-flex align-items-center social">
            <Link target="_blank" to={adminDetails.instagram_url}>
            <img src={insta} alt="" className="p-1" style={{ background: `#${adminDetails.color &&adminDetails?.color.substring(10,16)}` }}  />
            </Link>
          </div>
          )
        }
        {
          adminDetails.whatsapp_phone && (
            <div className="d-flex align-items-center justify-content-center  social">
            <Link target="_blank" to={`https://wa.me/+963${adminDetails.whatsapp_phone.substring(0)}`}>
            <img src={whatss} alt="" className="p-2" style={{ background: `#${adminDetails.color &&adminDetails?.color.substring(10,16)}` }} />
            </Link>
          </div>
          )
        }
        <Link to={`/${username}/template/2/categories`}>
          <button style={{ backgroundColor: `#${adminDetails.color &&adminDetails?.color.substring(10,16)}` }}>
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
