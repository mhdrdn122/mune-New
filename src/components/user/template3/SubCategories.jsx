import { Link, useNavigate, useParams } from "react-router-dom";
// import search from "../../../assets/User/icon _search outline_.png";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../../context/AdminProvider";
import { Dropdown, Form, Modal, Spinner } from "react-bootstrap";
// import { CategoriesContext } from '../../../context/CategoriesProvider';
import Pagination from "../template1/Pagination";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import Search from "../template6/Search";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCatsQuery } from "../../../redux/slice/user section/subCatsApi";
import PlusButton from "../../../utils/user/PlusButton";

const SubCategories = () => {
  const [subCat, setSubCat] = useState([]);
  // const [error, setError] = useState("");
  // const [pending, setPending] = useState(true);
  const { id, username } = useParams();
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [searchWord, setSearchWord] = useState("");
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const pageCountSub = useRef();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const handleClick = (sub) => {
    if(sub.content === 1){
      navigate(`/${username}/template/3/category/${sub.id}`);
    }else {
      navigate(`/${username}/template/3/category/${id}/sub-category/${sub.id}`);
    }
  };


  const {
    data: subCategories,
    isError,
    isSuccess,
    error,
    isLoading: pending,
  } = useGetSubCatsQuery(
    {
      resId: adminDetails && adminDetails.id,
      catId: id,
      word: debouncedSearch,
      page,
      language,
    },
    { skip: !get }
  );

  console.log(subCategories);

  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);

  useEffect(() => {
    if (!pending && isSuccess) {
      setSubCat(subCategories.data);
      pageCountSub.current = subCategories.meta.total_pages;
    }
  }, [pending, isSuccess, subCategories]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  const onPress = (page) => {
    setPage(page);
  };

  return (
    <div style={{ minHeight: "100vh", background: "" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      <div
        style={{
          textDecoration: "none",
          color: "#111",
          // backgroundColor: "",
          fontSize: "24px",
          padding: "10px 20px",
          borderRadius: "5px",
          display: "inline-block",
          cursor: "pointer",
        }}
        className="color"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
      </div>
    
      {isError && <h3 className="text-center mt-5">{error?.data?.message}</h3>}

      {pending && (
        <p className="text-center mt-5 color">
          <Spinner className="m-auto" animation="border" />
        </p>
      )}

      <div
        className="pagin_tem3 d-flex flex-column align-items-center justify-content-start"
        style={{ minHeight: "calc(100vh - 126px)" }}
      >
        <div className="template3_items" >
          {subCat
          .map((sub) => {
            return (
              <div
                className="template3_item "
                style={{
                  backgroundColor: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                }}
                key={sub.id}
                onClick={() => handleClick(sub)}
              >
                <img src={sub.image}
                
                style={{
                    boxShadow:adminDetails.is_sub_move?'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset':'',
                    borderRadius:adminDetails.is_sub_move?'10px':''
                }}
                alt="" className="template3_S_U_b_item" />
                <h5 className="mt-5 subCatColor font font-weight-bold">
                  {sub.name}
                </h5>
              </div>
            );
          })}
        </div>
        <PlusButton />
        {pageCountSub.current > 1 ? (
          <div className="mb-2" style={{ flex: "1" , display: 'flex', alignItems:'end'}}>
            <Pagination pageCount={pageCountSub.current} onPress={onPress} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SubCategories;
