import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import { useLocation, useParams } from "react-router-dom";
import { useGetRestsQuery } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import { useSelector } from "react-redux";
import SubscriptionsContainer from "../../../components/super_admin/subscriptions/SubscriptionsContainer";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import { useDispatch } from "react-redux";
import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import useRandomNumber from "../../../hooks/useRandomNumber";

const ResSubscriptionsPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const location = useLocation();
  const dispatch = useDispatch();
  const { cityId, resId } = useParams();
  const { data: rests } = useGetRestsQuery({ page: 1, cityId, searchWord: "" });
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const handleShowAddAdmin = () => {
    setShowAddAdmin(true);
  };
  const handleCloseAddAdmin = () => {
    setShowAddAdmin(false);
  };
  const { cities, status } = useSelector((state) => state.citySuper);

  const fetchData = async () => {
    await dispatch(getAllCitiesAction(1));
  };
  useEffect(() => {
    if (status === "idle") {
      fetchData();
    }
  }, [status]);

  const res = cities?.data?.find((item) => item.id === parseInt(cityId));

  console.log(location);

  const res2 = rests?.data.find((item) => item.id === parseInt(resId));
  console.log(rests?.data);

  // console.log(res2.name)

  console.log(localStorage.getItem('prevUrl'))
  const breadcrumbs = [
    {
      label: "الرئيسية",
      to: "/super_admin",
    },
    // {
    //   label: res?.translations?.ar?.name || "...",
    //   to: "/super_admin",
    // },
    {
      label: res2?.translations?.ar?.name || "...",
      // to: `/super_admin/city/${cityId}/resturants`,
      to: localStorage.getItem('prevUrl'),
    },
    {
      label: "الاشتراكات",
    },
  ].reverse();
  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header
        heading={"الاشتراكات"}
        buttonText={"إضافة "}
        onButtonClick={handleShowAddAdmin}
        requiredPermission={SuperPermissionsEnum.PACKAGE_ADD_SUBSCRIPTION}
        setRefresh={()=>{}}
        refreshRandomNumber={refreshRandomNumber}
      />

      <SubscriptionsContainer
        show={showAddAdmin}
        handleClose={handleCloseAddAdmin}
        randomNumber={randomNumber}
      />
    </div>
  );
};

export default ResSubscriptionsPage;
