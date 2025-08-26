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
import SubAppBar from "../../../utils/SubAppBar";

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

  if (pathname.includes("/super_admin/restaurants_managers")) {
    console.log("object");
    console.log(managerId);
  }
  useEffect(() => {
    localStorage.setItem("cityId", cityId);
  }, [cityId]);
  return (
    <div>
      <SubAppBar
        title=" المطاعم "
        showAddButton={true}
        showSearch={true}
        onSearch={(word) => setSearchWord(word)}
        onAdd={() => navigate("/super_admin/resturants/add")}
        requiredPermission={{
          Add: SuperPermissionsEnum.RESTAURANT_ADD,
        }}
      />

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
