import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowDown, FaArrowUp, FaCheck } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { addOrder } from '../../../../redux/slice/user section/ordersSlice'
import notify from '../../../../utils/useNotification'
import { ToastContainer } from 'react-toastify'
import { CloseOutlined } from '@mui/icons-material'

const DetailedItemModal = ({ show, onHide, item,adminDetails }) => {
  const [selectedSize, setSelectedSize] = useState(item?.sizes[0])
  const [showOverlay, setShowOverlay] = useState(false)
  const scrollRef = useRef(null)
  const [total,setTotal] = useState(item?.price)
  const [removed,setRemoved] = useState(item?.removed || [])
  const [selectedExtras,setSelectedExtras]=useState(item?.extras || [])
  const [language,setLanguage] = useState()
  useEffect(()=>{
    const res = localStorage.getItem('language')
    setLanguage(res)
  },[])
  const handleRemove = (comp) => {
    setRemoved(prevRemoved => {
    const exists = prevRemoved.find(item => item.id === comp.id);

    if (exists) {
      return prevRemoved.filter(item => item.id !== comp.id);
    } else {
      return [...prevRemoved, comp];
    }
  });
  }
  useEffect(()=>{
    setTotal(parseInt(item?.price) || item?.price)
    setRemoved(item?.removed || [])
    setSelectedExtras(item?.selectedExtras || [])
    setSelectedSize(item?.sizes[0])
  },[show,item])


  useEffect(()=>{
    console.log(removed)
    console.log(removed?.find((rem)=>rem.name==='component'))
  },[removed])
  const dispatch = useDispatch()
  const handleSubmit = async () => {
    await dispatch(
      addOrder({
        id: item.id,
        name: item.name,
        count: 1,
        image: null||item.image,
        price: total,
        size_id:selectedSize?.id,
        toppings:selectedExtras,
        components:removed.map(obj=>(obj?.id)),
      })
    );
    notify("تمت الإضافة بنجاح ", 'success')
  };
  return (
    <Modal show={show} onHide={onHide} centered className='overflow-y-hidden'>
      <Modal.Header
        style={{
          background: `#${adminDetails?.color?.substring(10, 16)}`,
        }}
      >
        <span className='itemColor cursor-pointer' onClick={onHide}><CloseOutlined /></span>
      </Modal.Header>
      <Modal.Body
        ref={scrollRef}
        className='font relative flex flex-col md:flex-row justify-between max-h-[500px] md:max-h-[500px] !min-w-fit  pt-36 !gap-3'
        style={{
          background: `#${adminDetails?.color?.substring(10, 16)}`,
        }}
      >

        <div className='w-full flex flex-col justify-center items-center rounded-full'>
          <img src={selectedSize?.image?.length ? selectedSize?.image : item?.image } alt="" className='w-[200px] h-[200px] md:!w-[150px] md:!h-[150px]  rounded-full' />
        </div>

        {/* Right content */}
        <div className='w-full flex flex-col justify-center items-center gap-3'>
          <AnimatePresence >
            {showOverlay && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 min-w-full h-full z-20 flex flex-col justify-center items-center"
              >
                
                <div className='relative bg-black max-h-full min-h-[500px] md:min-h-[500px]  min-w-full flex flex-col justify-between h-full  items-center p-3 overflow-y-auto rounded-t-2xl gap-5' style={{opacity:.9}}>
                  <div
                    className=' sticky top-2 text-center text-white bg-black bg-opacity-50 rounded-full p-2 self-start hover:cursor-pointer h-[50px] w-[50px]'
                    onClick={()=>setShowOverlay(false)}
                  >
                    <CloseOutlined />
                  </div>
                  {
                    item?.toppings.length > 0 &&
                    <div className='w-full flex flex-col  gap-2 justify-center' dir='rtl'>
                      <div className='text-white text-2xl w-full'>
                        <p>أضف الى الطبق</p>
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {
                          item.toppings.length>0 && item.toppings?.map((extra, index) => {
                          const isSelected = selectedExtras.includes(extra?.id);
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedExtras(selectedExtras.filter(id => id !== extra?.id));
                                  setTotal(total - extra.price);
                                } else {
                                  setSelectedExtras([...selectedExtras, extra?.id]);
                                  setTotal(total + extra.price);
                                }
                              }}
                              className={`relative flex flex-col p-3 w-[75px] h-[110px] bg-white rounded-lg justify-center items-center hover:cursor-pointer border-2 ${
                                isSelected ? "border-green-500" : "border-transparent"
                              }`}
                            >
                              <img src={extra.icon} alt="" />
                              <p className='text-sm'>{language === 'ar' ? extra.name_ar: extra?.name_en}</p>
                              <p>{extra.price}</p>

                              {/* ✅ Check icon on top-right if selected */}
                              {isSelected && (
                                <FaCheck className="absolute top-1 right-1 text-green-600 bg-white rounded-full" />
                              )}
                            </div>
                          );
                        })
                        }
                      </div>
                    </div>
                  }
                  {
                    item?.components?.length>0 && 
                    <div className='w-full flex flex-col gap-2 items-center' dir='rtl'>
                      <div className='w-full text-2xl text-white'>
                        إزالة عناصر
                      </div>
                      <div className='flex flex-wrap gap-2 justify-start items-center w-full' dir='rtl'>
                        {
                          item?.components?.length >0 && item?.components?.map((comp,i)=>(
                            <div key={comp+i} className={`flex gap-3 p-2 bg-gray-500 rounded-2xl `}>
                              <p className={`${removed?.find((rem)=>rem.name ===comp.name ) ? "text-gray-200  line-through" : "text-white "}`}>{language === 'ar'? comp.name_ar: comp?.name_en}</p>
                              {
                                comp.status === 1 && <span className='text-white hover:cursor-pointer' onClick={()=>handleRemove(comp)}>X</span>
                              }
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  }
                  {
                    item?.nutrition &&
                    <div className='w-full self-center itemColor  flex flex-col gap-2' dir='rtl'>
                      <p className='text-2xl text-white' >حول المنتج</p>
                      <div className='w-full bg-gray-500 rounded-2xl flex  justify-between  items-center p-3 opacity-100'>
                        <div className='flex flex-col justify-center items-center'>
                          <p className='text-xl'>{item?.nutrition?.kcal}</p>
                          <p className='text-sm font-extralight'>Kcal</p>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                          <p className='text-xl'>{item?.nutrition?.protein}</p>
                          <p className='text-sm font-extralight'>protein</p>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                          <p className='text-xl'>{item?.nutrition?.fat}</p>
                          <p className='text-sm font-extralight'>fat</p>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                          <p className='text-xl'>{item?.nutrition?.carbs}</p>
                          <p className='text-sm font-extralight'>carbs</p>
                        </div>
                      </div>

                    </div>
                  }
                  <span onClick={handleSubmit} className='sticky bottom-1 w-[60%] text-center py-1 rounded-3xl self-center hover:cursor-pointer bg-orange-400 border-2 border-gray-600'>+{total}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className='text-center'>
            <p className='itemColor font text-[35px]'>{language==='ar' ? item?.name_ar : item?.name}</p>
            <p className='text-[20px] font-light ' dir='rtl'>
              {language==='ar' ? selectedSize?.description_ar?.length? selectedSize?.description_ar : item?.description_ar : selectedSize?.description_en?.length? selectedSize?.description_en : item?.description_en }
            </p>
          </div>

          {
            item?.sizes?.length>0 && <div className='flex rounded-3xl bg-gray-400 justify-center items-center p-1 '>
            {item?.sizes?.map((size) => (
              <span
                key={size.name_ar}
                className={`hover:cursor-pointer py-2 px-4  ${selectedSize?.name_ar === size.name_ar && "bg-gray-100  rounded-3xl"}`}
                onClick={() =>{
                  setTotal(total-selectedSize?.price + size.price)
                  setSelectedSize(size)
                  
                }}
              >
                {language==='ar'?size.name_ar:size?.name_en}
              </span>
            ))}
          </div>
          }
          {!showOverlay&&<span onClick={handleSubmit} className='border-2 border-gray-500 sticky bottom-1 w-[80%] text-center py-1 rounded-3xl self-center hover:cursor-pointer bg-orange-400'>+{total}</span>}

          

          {/* 👇 Scroll-up animated icon (visible now) */}
          {
            (item?.components?.length || item?.toppings?.length || item?.nutrition) && 
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className='mt-6 text-gray-400'
            >
              <FaArrowUp size={24} onClick={()=>setShowOverlay(true)} />
            </motion.div>
          }
        </div>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  )
}

export default DetailedItemModal
