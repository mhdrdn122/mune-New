import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../utils/Breadcrumb";
import Header from "../../../utils/Header";
import RatesRestContainer from "../../../components/super_admin/ratesRest/RatesRestContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetRestsQuery } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import { downloadRatesExcel } from "../../../redux/slice/super_admin/ratesRest/ratesRestApi";
import notify from "../../../utils/useNotification";
import { SiMicrosoftexcel } from "react-icons/si";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";

const RatesRestPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const { cityId, resId } = useParams();
  const { cities } = useSelector((state) => state.citySuper);
  const res = cities?.data?.find((item) => item.id === parseInt(cityId));
  const { data: rests } = useGetRestsQuery({ page: 1, cityId, searchWord: "" });
  console.log(rests);
  const resp = rests?.data?.find((item) => item.id === parseInt(resId));
  console.log(resId);
  console.log(resp);
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
      label: resp?.translations?.ar?.name || "...",
      // to: `/super_admin/city/${cityId}/resturants`,
      to: localStorage.getItem('prevUrl'),
    },
    {
      label: "التقييمات",
    },
  ].reverse();

  const handleClick = async () => {
    await downloadRatesExcel(resId);
  };

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header
        heading={"التقييمات"}
        buttonText={"تنزيل كملف اكسل "}
        onButtonClick={handleClick}
        icon={<SiMicrosoftexcel />}
        requiredPermission={SuperPermissionsEnum.EXCEL}
        setRefresh={()=>{}}
        refreshRandomNumber={refreshRandomNumber}
      />
      <RatesRestContainer  randomNumber={randomNumber}/>
    </div>
  );
};

export default RatesRestPage;
