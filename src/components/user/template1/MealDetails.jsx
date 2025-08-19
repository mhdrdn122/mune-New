import { Link, useParams } from "react-router-dom";
import logo2 from "../../assets/dsfsf 3.png";
import arrow1 from "../../assets/Arrow 1.png";
import slider from "../../assets/new.png";
import icon_home from "../../assets/icon _home.png";
import arrLeft from "../../assets/Arrow 4.png";
import arrRight from "../../assets/Arrow 5.png";
import NavBarMenu from "./NavBarMenu";

export default function MealDetails() {
  const { id } = useParams();
  console.log(id);

  return (
    <div className="" style={{ height: "100vh" }}>
      <NavBarMenu />
      <div
        style={{
          height: "92px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="list_food">
          <div className="list_menu" onClick={""}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <p>القائمة</p>
        </div>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">
                <img src={icon_home} alt="" />
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <Link to="/list">الفطور</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              فول مدمس
            </li>
          </ol>
        </nav>
      </div>

      <div className="slider">
        <img src={slider} alt="" />
      </div>
      <div className="details">
        <div className="line"></div>
        <p>فطور لشخصين</p>
        <p className="price">100.000</p>
        <div className="line"></div>
        <p>منتجات ذات صلة</p>
      </div>
      <div className="meals pt-2" style={{ flexWrap: "nowrap" }}>
        <div className="arrow">
          <img src={arrLeft} alt="" />
        </div>

        <div className="meal">
          <div className="section_bottom">
            <p className="para">فول مدمس</p>
            <p>10.000</p>
          </div>
        </div>
        <div className="meal">
          <div className="section_bottom">
            <p className="para">تسقية</p>
            <p>10.000</p>
          </div>
        </div>

        <div className="arrow ">
          <img src={arrRight} alt="" />
        </div>
      </div>
    </div>
  );
}
