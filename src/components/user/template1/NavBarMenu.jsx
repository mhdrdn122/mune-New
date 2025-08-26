import logo2 from "../../assets/dsfsf 3.png";
import search from "../../../assets/User/icon _search outline_.png";
import vector from "../../../assets/User/Vector.png";
import vector2 from "../../assets/Vector (1).png";
import facebook from "../../assets/face 1.png";
import insta from "../../assets/insta 1.png";
import { Link } from "react-router-dom";

export default function NavBarMenu() {
  return (
    <nav className="nav_bar_menu">
      <div className="nav_bar_menu_left">
        <img src={vector} alt="" />
        <Link to="">
          <img src={search} alt="" />
        </Link>
      </div>
      <div className="nav_bar_menu_center">
        <img src={logo2} alt="logo" />
      </div>
      
    </nav>
  );
}
