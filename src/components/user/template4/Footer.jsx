import { useContext } from 'react'
import { CategoriesContext } from '../../../context/CategoriesProvider';
import {  useMediaQuery as MQ } from "@mui/material";
import { LanguageContext } from '../../../context/LanguageProvider';
import { AdminContext } from '../../../context/AdminProvider';
import { Link, useParams } from 'react-router-dom';

const Footer = () => {
    const { adminDetails } = useContext(AdminContext);
    const { categories} =useContext(CategoriesContext);
    const isSmallDevice = MQ("only screen and (max-width : 760px)");
    const { language } = useContext(LanguageContext);
    const { username } = useParams();
    
    return (
        <div
            className="bottom_section_categories_temp4 !rounded-none"
            style={{
            background: `#${
                adminDetails &&
                adminDetails.color &&
                adminDetails.color.substring(10, 16)
            }`,
            flexDirection: language === "en" ? "row" : "row-reverse",
            }}
        >
            {categories?.slice(0, isSmallDevice ? 3 : 7).map((cat) => {
                return (
                    <Link
                        to={`${
                            cat.content === 0
                            ? ""
                            : cat.content === 1
                            ? `/${username}/template/4/category/${cat.id}`
                            : `/${username}/template/4/category/${cat.id}/sub-category/0`
                        }`}
                        key={cat.id}
                        className="d-flex flex-column align-items-center justify-content-center"
                    >
                        <img src={cat.image} alt="" />
                        <p className="text-capitalize categoryColor font text-truncate text-center">
                            {language ==="en"?cat.name_en:cat.name_ar}
                        </p>
                    </Link>
                );
            })}
            <Link to={`/${username}/template/4/home`} className="align-self-end">
                {" "}
                <p className="text-capitalize categoryColor font  text-center">
                    {language === "en" ? "More..." : "...المزيد"}
                </p>
            </Link>
        </div>
  )
}

export default Footer
