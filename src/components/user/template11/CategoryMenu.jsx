import { useState, useEffect, useContext } from "react";
import ItemCard from "./Items/ItemCard";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { AdminContext } from "../../../context/AdminProvider";
import { Spinner, ToastContainer } from "react-bootstrap";
import { GiSuperMushroom } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import notify from '../../../utils/useNotification'
import { baseURLLocal } from "../../../Api/baseURLLocal";
import { baseURLPublicName } from "../../../Api/baseURL";
const CategoryMenu = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [get, setGet] = useState(false);
  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);
  const [categories,setCategories] = useState()
  const [subCategories,setSubCategories] = useState()
  const [page, setPage] = useState(1);
  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);

  const [items,setItems] = useState()
  const [itemsLoading,setItemLoading] = useState()

  useEffect(()=>{
    (async()=>{
      try {
        if(adminDetails){
          setItemLoading(true)
          const response = await fetch(`${baseURLPublicName}/customer_api/show_category_subs_items?restaurant_id=${adminDetails?.id}`)
          const data = await response.json()
          console.log('data',data)
          if(data.data.length > 0){
            setCategories(data.data)
            setActiveCatId(data.data[0].id)
            if(data.data[0].content === 2){
              setItems(data.data[0].items)
            }else{
              setSubCategories(data.data[0].sub_category)
              setActiveSubCatId(data.data[0].sub_category[0].id)
              setItems(data.data[0].sub_category[0].items)
            }
            
          }
          setItemLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  },[adminDetails])
  useEffect(()=>{
    console.log('active cat is',activeCatId)
    const newCategory = categories?.find((cat)=>cat.id === activeCatId);
    console.log('newCategory',newCategory)
    if(newCategory?.content === 2){
      setItems(newCategory.items)
      setSubCategories([])
    }else{
      setSubCategories(newCategory?.sub_category)
      setActiveSubCatId(newCategory?.sub_category[0].id)
      setItems(newCategory?.sub_category[0].items)
    }
  },[activeCatId])
  useEffect(()=>{
    const newSubCategory = subCategories?.find((sub)=>sub.id === activeSubCatId);
    setItems(newSubCategory?.items)
  },[activeSubCatId])
  useEffect(() => {
    window.scrollTo({ top: 150, behavior: "smooth" });
  }, [activeCatId, activeSubCatId]);
  if (!categories) return <Spinner className="p-3 self-center" />;
  
  return (
    <div className="w-full min-h-[100vh] ">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="categoryColor font flex p-3  gap-2  h-fit hide-scrollbar !sticky !top-[70px] !z-[800] bgColor">
        {categories?.map((cat) => {
          if(cat.is_active )
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCatId(cat?.id);
                }}
                className={`${
                  cat.id === activeCatId?"opacity-100":"opacity-50"
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <img src={cat.image} className="w-[50px] h-[50px] hover:w-[55px] hover:h-[55px] md:w-[75px] md:h-[75px] rounded-full md:hover:w-[77px] md:hover:h-[77px]  " alt="" />
                  <span className="">{cat.name_ar}</span>
                </div>
              </button>
            )
        })}
      </div>
      <div className="subCatColor font flex p-3 mb-2  gap-2  h-[50px] md:h-[60px] hide-scrollbar !sticky !top-[168px] md:!top-[195px] !z-[800] bgColor ">
        {subCategories && subCategories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveSubCatId(cat?.id);
            }}
            className={`  ${
              cat.id === activeSubCatId
                ? ""
                : ""
            }`}
          >
            <span 
              className={`rounded-4xl p-2 h-[50px] md:w-[100px] text-xs md:text-lg ${cat.id===activeSubCatId ? "opacity-100":"opacity-50" }`}
              style={{
                background: `#${adminDetails?.color?.substring(10, 16)}`,
              }}
            >{ cat.name_ar}</span>
          </button>
        ))}
      </div>

      {!itemsLoading && items ? (
        <div className="text-center w-full h-full">
          <div className="!flex !flex-wrap items-start w-full gap-2 p-0 justify-center  md:p-5">
            {items.length > 0 ? (
              items.map((item) => (
                <ItemCard
                  item={item}
                  key={item.id}
                  imgsrc={item.icon}
                  title={item.name_en}
                  price={item.price}
                  replace={item.replace || []}
                  removeTrue={item.removeTrue || []}
                  removeFalse={item.removeFalse || []}
                  aboutProduct={item.aboutProduct || []}
                  adds={item.adds || []}
                  sizes={item.sizes || []}
                  adminDetails={adminDetails}
                />
              ))
            ) : (
              <p className="self-cente itemColor">no items</p>
            )}
          </div>
        </div>
      ):(
        <motion.div  
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, repeatDelay:0.1}} 
          className="w-full flex justify-center items-center mt-5 "
        >
          <GiSuperMushroom 
            className={`text-[50px]`}
            style={{
              color: `#${adminDetails?.color?.substring(10, 16)}`,
            }}
          />
        </motion.div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default CategoryMenu;