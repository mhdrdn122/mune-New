import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import ResturantsContainer from "../../../Containers/RestaurantsContainer/ResturantsContainer";
import "./ResturantPage.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchComponent from "../../../utils/super_admin/SearchInput";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import { useGetRestManagersQuery } from "../../../redux/slice/super_admin/restManagers/restManagerApi";
import { ToastContainer } from "react-toastify";
import useRandomNumber from "../../../hooks/useRandomNumber";
import { Grid } from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";

const ResturantsPage = () => {
  
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const navigate = useNavigate();
  const { cityId, managerId } = useParams();
  const { pathname } = useLocation();
  const { cities } = useSelector((state) => state.citySuper);
  const res = cities?.data?.find((item) => item.id === parseInt(cityId));
  const [searchWord, setSearchWord] = useState("");
  const { data: managers } = useGetRestManagersQuery({ page: "" });
  const res2 = managers?.data?.find((item) => item.id === parseInt(managerId));

  const breadcrumbs = [
    {
      label: "الرئيسية",
      to: "/super_admin",
    },
    pathname.includes("/super_admin/restaurants_managers")
      ? {
          label: res2?.name || "...",
          to: "/super_admin/restaurants_managers",
        }
      : {
          label: res?.translations?.ar?.name || "...",
          to: "/super_admin",
        },
    {
      label: "المطاعم",
    },
  ].reverse();

  console.log(pathname);
  if (pathname.includes("/super_admin/restaurants_managers")) {
    console.log("object");
    console.log(managerId);
  }
  useEffect(()=>{
    localStorage.setItem('cityId',cityId)
  },[cityId])
  return (
    <div>
      <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"المطاعم"}
        buttonText={"إضافة مطعم"}
        onButtonClick={() => navigate("/super_admin/resturants/add")}
        requiredPermission={SuperPermissionsEnum.RESTAURANT_ADD}
        setRefresh={() => {}}
        refreshRandomNumber={refreshRandomNumber}
      />
      <Grid
        container
        flexDirection={"row-reverse"}
        spacing={2}
        marginBottom={2}
      >
        <Grid item xs={12} sm={6} md={4}>
          <SearchComponent
            searchWord={searchWord}
            setSearchWord={setSearchWord}
          />
        </Grid>
      </Grid>
      <ResturantsContainer
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        randomNumber={randomNumber}
      />
      <ToastContainer />
    </div>
  );
};

export default ResturantsPage;
