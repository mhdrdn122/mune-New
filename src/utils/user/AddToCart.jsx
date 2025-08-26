import { Button, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { addOrder } from "../../redux/slice/user section/ordersSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useSelector } from "react-redux";
import notify from '../../utils/useNotification'
import { AdminContext } from "../../context/AdminProvider";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const AddToCart = ({ data , itemImage }) => {
  const [heSaidNo, setHeSaidNo] = useState(localStorage.getItem('heSaidNo')); 

  console.log('data22 :  ',data)
  const { adminDetails } = useContext(AdminContext);
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);
  const [quantity, setQuantity] = useState(1);
  let message_ar = 'تمت إضافة العنصر إلى السلة بنجاح'
  let message_en = 'Item has been successfully added to cart.'
  const handleSubmit = async (data) => {
      console.log('data , : ',data)
    if(data.price==0 || data.price==null){
      {language=='en' && notify('price is null', 'warn')}
      {language=='ar' && notify('لا يوجد سعر لهذا العنصر', 'warn')}
      return ;
    }
     // Remove commas from price and parse it into a number
    const cleanPrice = Number(data.price.toString().replace(/,/g, ''));
    

    await dispatch(
      addOrder({
        id: data.id,
        name: data.name,
        count: quantity,
        image: itemImage||data.image,
        price: cleanPrice,
      })
    );
    notify(language === 'en' ? message_en : message_ar, 'success')
  };

  const removeItem = () => {
    setQuantity((prev) => (prev <= 1 ? prev : prev - 1));
  };
  return (
    <div
    className="box_cart /*bgColor*/ p-3 "
      >
      <div className="d-flex justify-content-between"

      >
        {/* <div
          className={`d-flex justify-content-between align-items-center ${
            language === "ar" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <label htmlFor="quantity" className="mx-2 font  color">
            {" "}
            {language === "ar" ? ":الكمية" : "Quantity:"}
          </label>
          <div
            className={`d-flex justify-content-between align-items-center  rounded ${
              language === "ar" ? "flex-row-reverse" : "flex-row"
            }`}
            style={{ border: "1px solid", borderColor: "var(--color)" }}
          >
            <IconButton
              className={"color"}
              onClick={() => setQuantity((prev) => prev + 1)}
              size="small"
            >
              <AddCircleOutlineIcon size={10} />
            </IconButton>
            <p className="font p-1 color">{quantity}</p>
            <IconButton className={"color"} onClick={removeItem} size="small">
              <RemoveCircleOutlineOutlinedIcon />
            </IconButton>
          </div>
        </div> */}
      </div>
          <div
          >
           { /*(data?.price!==null && data?.price!==0) &&*/ <p className="m-2">
            {/* {data?.name} */}
            {localStorage.getItem('language')=="en"?data.name_en:data.name_ar}
            
            </p>}

            {data?.price ==0? <p></p>:<p className="m-2">{data?.price} {adminDetails.price_type=='syrian'?'S.P':'$'} </p> }
          </div>

        {adminDetails?.is_order === 1 && !heSaidNo &&    
        <Button
          variant="contained"
          size="large"
          className={"bgColorLikeColor font"}
          startIcon={<AddShoppingCartIcon />}
          onClick={() => handleSubmit(data)}
        >
                      {/* {localStorage.getItem('language')=="en"?cat.name_en:cat.name_ar} */}
          {localStorage.getItem('language') === "ar" ? "إضافة إلى السلة" : "Add to cart"}
        </Button>
}      
    </div>
  );
};

export default AddToCart;
