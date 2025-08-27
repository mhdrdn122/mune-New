import { useContext, useEffect, useState } from "react";
import NavBarUser from "../../utils/user/NavBarUser";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminProvider";
import { Spinner } from "react-bootstrap";
import { LanguageContext } from "../../context/LanguageProvider";
import { IoMdArrowRoundBack } from "react-icons/io";
import ButtonWithLoading from "../../utils/ButtonWithLoading";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import {
  addOrder,
  deleteCount,
  resetOrdersState,
  resetSendOrdersState,
  sendOrdersAction,
} from "../../redux/slice/user section/ordersSlice";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import notify from "../../utils/useNotification";
import { ToastContainer } from "react-toastify";
import ShowInvoice from "../../components/user/template1/ShowInvoice";
import { UserContext } from "../../context/UserProvider";
import AddAddressModal from "./AddAddressModal";
import LoginUserModal from "../../utils/user/LoginUserModal";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import ItemModal from "../../components/user/template11/Items/ItemModal";

const MyOrdersPage = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { userToken,setUserToken } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { username } = useParams();
  const dispatch = useDispatch();
  const [toggleTextBtton, setToggleTextButton] = useState(true);
  const [showInv, setShowInv] = useState(false);
  const [showTables,setShowTables]=useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [tableId,setTableId]=useState(null);
  const [loadingSubmit,setLoadingSubmit]=useState(false)
  const [showAddAddressModal,setShowAddAddressModal]=useState(false);
  const [address,setAddress]=useState('')
  const [isSelectedAddress,setIsSelectedAddress]=useState(false);
  const [isDelivery,setIsDelivery]=useState(true);
  const [isDeliveryModal,setIsDeliveryModal]=useState(false);
  const [longitude,setLongitude]=useState('');
  const [latitude,setLatitude]=useState('');
  const [coupon,setCoupon]=useState('');
  const [friend_address,setFriend_address]=useState('');
  const [delivery_price,setDelivery_price]=useState(0)
  const [disCountObj,setDisCountObj]=useState({})
  const isTable_id = localStorage.getItem('tableId')
  const [showEdit,setShowEdit] = useState()
  const [itemToEdit,setItemToEdit]  =useState()
  const [isInRestaurant,setIsInRestaurant] = useState(true)
  useEffect(()=>{
    (async()=>{
      const result =await localStorage.getItem('heSaidNo')
      const takeOut = await localStorage.getItem('isTakeout')
      if(result ==='true' || takeOut === 'true') setIsInRestaurant(false)
      console.log('takeout',takeOut)
    })()
  },[])
  const handleEnterId = async (e) => {
    e.preventDefault();
    setTableId(selectedOption);
    setLoadingSubmit(true)
    const data = new FormData();
    data.append('table_id', selectedOption);
    data.append('id', adminDetails.id);

    try {
      let response = await fetch("https://medical-clinic.serv00.net/customer_api/choose_table" ,{
        method:"POST",
        body:data
      })
      response = await response.json()
      localStorage.setItem('userToken',response?.data?.token)
      setUserToken(response?.data?.token)
      notify('لقد تم تحديد رقم الطاولة بنجاح','success')
      setShowTables(false)
    } catch (error) {
        console.error('error from enter Id : ',error)
    }finally{
      setLoadingSubmit(false)
    }
    localStorage.setItem('tableId',selectedOption)
  };
  const handleSendCode= async()=>{
    if(!userToken){
      setShowLoginModal(true)
      return;
    }
    setLoadingSubmit(true)
    try {
      const response = await axios.post(`${baseURLLocalPublic}/user_api/check_coupon`,{
        code:coupon,
        total:totalPrice
      },{
        headers:{
          'Authorization':`Bearer ${userToken}`
        }
      })
      console.log('res of code : ',response)
      if(response?.data?.status==true){
        setDisCountObj(response?.data?.data)
        notify(response?.data?.message,'success')
      }
    } catch (error) {
      notify(error?.response?.data?.message,'error')
      console.log('error : ',error)
    }finally{
      setLoadingSubmit(false)
      console.log('disCountObj : ',disCountObj)
    }
    console.log('response of send coupon ')
  }
  const handleShowShow = () => {
    setToggleTextButton(false);
    setShowInv(true);
  };
  const handleCloseShow = () => {
    setShowInv(false);
  };
  const handleCloseAddAddressModal = () => {
    setShowAddAddressModal(false);
  };
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    setTimeout(() => {
      handleUpdateUsername();
    }, 300);
    setIsSelectedAddress(false)
  }, []);

  const { orders: ordersState } = useSelector((state) => state.orders);
  
  const { loading, error, data } = useSelector(
    (state) => state.orders.sendOrders
  );

  const {
    showInvoice
  } = useSelector((state) => state.orders.ordersInvoice);

  const totalPrice = ordersState.reduce((acc, current) => {
    const itemPrice = current.price; 
    return acc + itemPrice * current.count;
  }, 0) 

  const handleAddQunatity = async (item) => {
    await dispatch(
      addOrder({
        ...item,
        count: 1,
      })
    );
  };

  const handleDeleteQunatity = async (id) => {
    await dispatch(deleteCount(id));
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  const handleSendOrders = async () => {
    const takeOut = await localStorage.getItem('isTakeout')
    if(isInRestaurant && !isTable_id){
      notify("Please select a table","warn")
      setShowTables(true)
      return;
    }
    if (!userToken) {
      notify(language=="en"?"please login or Register":"الرجاء تسجيل الدخول مرة أخرى","warn");
      setShowLoginModal(true);
      return;
    }
    if(isSelectedAddress==false && !isTable_id){
      console.log("testAdd")
    setShowAddAddressModal(true)
    }
    console.log(ordersState)
    
    let payload = ordersState.map((i) => {
      return {
        item_id:i?.id,
        size_id:i?.size_id?i?.size_id : null,
        components:i?.components?.length > 0 ? i.components.map((comp)=>({component_id:comp})):[{component_id:null}],
        toppings:i?.toppings?.length > 0 ? i.toppings.map((topping)=>({topping_id:topping})):[{topping_id:null}],
        count:i?.count,
        price:i?.price
      };
    });
    const res = {
      data: payload,
      userToken, 
      address,
      longitude,
      latitude,
      isDelivery:isDelivery,
      delivery_price:delivery_price,
      code:coupon,
      friend_address:friend_address
    };
    console.log('res of order : ',res)
    if((isSelectedAddress || isDelivery==false) ||isTable_id ){
    console.log('res  of order  after edit: ',res)
    const result =   await dispatch(sendOrdersAction(res));
    console.log("result",result)
  }
  if(adminDetails?.table_id){
    console.log('res  of order table_Id  after edit: ',res)
    await dispatch(sendOrdersAction(res));
  }
  };


  useEffect(() => {
    if (!loading) {
      if (data) {
        notify(data?.message, "success");
        dispatch(resetOrdersState());
      }
      if (error) {
        notify(error?.message, "error");
      }
      dispatch(resetSendOrdersState());
    }
  }, [loading, data, error] );

  useEffect(()=>console.log(adminDetails?.menu_template_id),[])
  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "en-US" /*"ar-EG"*/).format(price);
  };

  return (
    <div style={{ minHeight: "100vh" }} className="bgColor pt-20  md:p-0 ">
      <NavBarUser />
      <div className="flex justify-between items-center px-2  mt-3 md:mt-4">
        <div className="text-[#111] text-[30px] p-0 color cursor-pointer" onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack />
        </div>
        
      </div>  
     <div className="px-2">
       <div
      style={{
        border:`2px solid ${`#${adminDetails?.color?.substring(10, 16) ?? "000000"}`}`
      }} className="flex flex-col rounded-2xl gap-2 p-4 m-auto sm:!w-full px-3 md:!w-[50%] ">
        {
          ordersState?.length > 0 ? (
            ordersState.map((item)=>(
              <>
                <div className="flex w-full justify-between items-center " dir = {language === 'ar' && 'rtl'} key={item?.id}>
                  <div className="flex gap-2" dir = {language === 'ar' && 'rtl'}>
                    <img src={item?.image} alt="" className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] rounded-2xl"/>
                    <div className="flex flex-col gap-2 md:gap-4 w-full">
                      <p className="text-sm md:text-2xl text-[#111] font-extrabold">{item?.name}</p>
                      <p className={`color font`} >
                        {language === "en" 
                        ? `${formatPrice(item.price)} ${adminDetails.price_type=='syrian'?'S.P':'$'}` 
                        : `${formatPrice(item.price)} ${adminDetails.price_type=='syrian'?'S.P':'$'}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 rounded-4xl bg-white shadow-4xl shadow-gray-500 p-2">
                    <button className=" hover:bg-gray-400 rounded-full color font" onClick={() => handleAddQunatity(item)}>
                      <AddIcon />
                    </button>
                    <p>{item.count}</p>
                    <button className=" hover:bg-gray-400 rounded-full  text-gray-700" onClick={() => handleDeleteQunatity(item)}>
                      {item.count==1 ?<DeleteIcon sx={{fontSize:20}} /> : <RemoveIcon sx={{ fontSize: 20,width:'16px' }}/> 
                        
                      }
                    </button>
                    
                  </div>
                </div>
                <hr />
              </>
            ))
          ):(
            !showInvoice && 
            <div className="flex justify-center items-center">
              <h6 className="color font">
                  {language === "en"
                  ? `سلة المشتريات فارغة`
                  : `Your shopping cart is empty`}
              </h6>
            </div>
            
          )
        }
        {
          ordersState?.length > 0 && 
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`flex ${language === "en" ? "justify-start":"justify-end"} w-full`}>
              <div className="w-full flex justify-between" dir = {language=="en"?"ltr":"rtl"}>
                <p>
                  {
                    language === "en"
                      ? ` price: `
                      : ` المبلغ : `
                  }
                </p>
                <p className="color font font-bold" dir = {language=="en"?"ltr":"rtl"}>
                  {`${formatPrice(totalPrice)} ${language === "en" ? adminDetails.price_type=='syrian'?'S.P':'$' :adminDetails.price_type=='syrian'?'ل.س':'$'}`}
                </p>
              </div>
            </div>
          </div>
        }
        {delivery_price !== 0 && ordersState?.length>0 && (
          <div className={`w-full flex ${language === "en" ? "justify-start" : "justify-end"}`}>
            <div
              className={`w-full flex justify-between gap-2 ${language === "en" ? "ltr" : "rtl"}`}
              dir={language === "en" ? "ltr" : "rtl"}
            >
              <p>{language === "en" ? "delivery price:" : "أجرة التوصيل :"}</p>
              <p
                className="font-bold"
                style={{
                  color: `#${adminDetails?.color?.substring(10, 16) ?? "000000"}`,
                }}
                dir={language === "en" ? "ltr" : "rtl"}
              >
                {`${formatPrice(delivery_price)} ${
                  language === "en"
                    ? adminDetails.price_type === "syrian"
                      ? "S.P"
                      : "$"
                    : adminDetails.price_type === "syrian"
                    ? "ل.س"
                    : "$"
                }`}
              </p>
            </div>
          </div>
        )}
        {
          !isInRestaurant && ordersState?.length > 0 &&
          <div className="flex flex-col gap-1 w-full justify-center items-center">
            <div className="flex items-center" dir='rtl'>
              <input
                className="bg-transparent border border-[#ccc] rounded-s-[8px] px-3 py-2 w-[150px] appearance-none outline-none text-right"
                type="text"
                placeholder="كود الخصم"
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                onClick={handleSendCode}
                style={{
                  backgroundColor: `#${
                    adminDetails &&
                    adminDetails?.color &&
                    adminDetails?.color?.substring(10, 16)
                  }`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px 0 0 8px",
                  padding: "9px 16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease",
                }}
              >
                {loadingSubmit ? <Spinner size="sm" /> : "تأكيد"}
              </button>
              
            </div>
            {Object.keys(disCountObj).length > 0 && (
              <span className="ms-5 fw-bold">{`${disCountObj?.percent} %`} : قيمة الخصم</span>
            )}
            {
              Object.keys(disCountObj).length > 0 &&
              <div
                className={`w-full flex justify-between gap-[5px] ${
                  language === "en" ? "ltr" : "rtl"
                }`}
                dir={language === "en" ? "ltr" : "rtl"}
              >
                <p>
                  {language === "en"
                    ? ` total price: `
                    : ` السعر الكلي بعد الخصم  :   `}
                </p>

                <p
                  className={`color font-[50px]`}
                  dir={language === "en" ? "ltr" : "rtl"}
                >
                  {` ${formatPrice(disCountObj?.total + delivery_price)} ${
                    language === "en"
                      ? adminDetails.price_type === "syrian"
                        ? "S.P"
                        : "$"
                      : adminDetails.price_type === "syrian"
                      ? "ل.س"
                      : "$"
                  } `}
                </p>
              </div>
            }
            

          </div>
        }
        
        {ordersState.length > 0 && (
          <div>
            <hr/>
            {delivery_price !== 0 && (
              <div className={`w-full flex ${language === "en" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`w-full flex justify-between gap-2 ${language === "en" ? "ltr" : "rtl"}`}
                  dir={language === "en" ? "ltr" : "rtl"}
                >
                  <p>{language === "en" ? "total price:" : "السعر الكلي :"}</p>
                  <p
                    className="font-bold"
                    style={{
                      color: `#${adminDetails?.color?.substring(10, 16) ?? "000000"}`,
                    }}
                    dir={language === "en" ? "ltr" : "rtl"}
                  >
                    {`${formatPrice(delivery_price + (disCountObj?.total? disCountObj?.total:totalPrice))} ${
                      language === "en" ? "S.P" : "ل.س"
                    }`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {Object.keys(ordersState).length > 0 ? (
          <div className="w-full flex justify-center   py-[15px]">
            <ButtonWithLoading
              loading={loading}
              text={language === "en" ? "submit" : "إتمام الشراء"}
              handleClick={handleSendOrders}
              style={{
                background: `#${adminDetails?.color?.substring(10, 16) ?? "000000"}`,
                position: "fixed",
                width: "50%",
                bottom: "100px",
              }}
            />
          </div>
        ) : (
          showInvoice &&
          (toggleTextBtton ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <ButtonWithLoading
                loading={loading}
                text={language === "en" ? "Request the Bill" : "طلب الفاتورة"}
                handleClick={handleShowShow}
                style={{
                  background: `#${adminDetails?.color?.substring(10, 16) ?? "000000"}`,
                }}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[50vh]">
              <ButtonWithLoading
                loading={loading}
                text={language === "en" ? "Show the Bill" : "عرض الفاتورة"}
                handleClick={handleShowShow}
                style={{
                  background: `#${adminDetails?.color?.substring(10, 16) ?? "000000"}`,
                }}
              />
            </div>
          ))
        )}


      </div>
     </div>
      {
        showInv && <ShowInvoice userToken={userToken} show={showInv} handleClose={handleCloseShow} />
      }

      { 
        showAddAddressModal&&
        <AddAddressModal 
          show={showAddAddressModal} 
          handleClose={handleCloseAddAddressModal} 
          address={address} 
          setAddress={setAddress} 
          isSelectedAddress={isSelectedAddress} 
          setIsSelectedAddress={setIsSelectedAddress}
          setLongitude={setLongitude} 
          setLatitude={setLatitude} 
          longitude={longitude} 
          latitude={latitude} 
          isDeliveryModal={isDeliveryModal} 
          setIsDeliveryModal={setIsDeliveryModal} 
          setDelivery_price={setDelivery_price}
          friend_address={friend_address} 
          setFriend_address={setFriend_address} 
          isDelivery={isDelivery} 
          setIsDelivery={setIsDelivery} 
        />
      }
      {
        showLoginModal &&
        <LoginUserModal
          show={showLoginModal}
          handleClose={handleCloseLoginModal}
        />
      }
      {showTables && 
        <nav
          className="navbar_bottom2"
          style={{
            background: `#${adminDetails?.color?.substring(10, 16)}`,
          }}
        >
          {
            <div className="relative w-full max-w-md mx-auto text-center">
              <form  onSubmit={handleEnterId} className="space-y-4 ">
                <select
                  id="table-select"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  required
                  style={{
                    backgroundColor: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                    border:'none'
                    
                  }}
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled selected>{language=='en'?<>Enter your table id</>:<>أدخل رقم الطاولة</>}</option>
                  {adminDetails?.available_tables?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.number_table}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full font-bold mb-30 md:py-2  px-4 rounded m-2 outline-none"
                  disabled={!selectedOption}
                  style={{
                    backgroundColor: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                    border:'1px solid #999'
                  }}
                >
                  {loadingSubmit?<Spinner size="sm" />:
                  language =='en'?
                    <>Submit</>:<>تأكيد</>
                  }
                </button>
              </form>
            </div>
          }
        </nav>
      }
      <ItemModal item={itemToEdit} show={showEdit} adminDetails={adminDetails} onHide={()=>setShowEdit(false)}/>
      <ToastContainer />
    </div>
  );
};
export default MyOrdersPage;