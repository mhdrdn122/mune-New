import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import DetailedItemModal from './ItemModal';



const ItemCard = ({
  item,
  imgsrc,
  title,
  description,
  price,
  adminDetails,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImgSrc, setCurrentImgSrc] = useState(imgsrc);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      const modal = document.getElementById("modal-content");
      if (modal && !modal.contains(e.target)) {
        // resetReplacement(setCurrentImgSrc, setSelectedReplacement, setShowReplacements, imgsrc);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, imgsrc]);
  return (
    <>
      {/* Card item  */}
      <motion.div
        initial={{ opacity: 0, position: "relative", top: "30px" }}
        animate={{ opacity: 1, position: "relative", top: "0" }}
        transition={{ duration: 0.4 }}
        className='w-full md:w-[250px]'
      >
        <div
          onClick={() => {
            setIsModalOpen(true);
            setTimeout(() => setLoading(false), 2000)
            setCurrentImgSrc(imgsrc);
          }}
          className={`itemColor font  w-full h-full  md:w-[250px] md:h-[280px]  hover:shadow-2xl  cursor-pointer shadow-md overflow-hidden flex md:flex-col gap-1 items-start justify-start md:justify-center md:items-center  transition border-b-2 md:border-2 border-b-gray-500 md:border-gray-500 py-3 rounded-lg`}
          style={{
            background: `#${adminDetails?.color?.substring(10, 16)}`,
          }}
        >
          <div className="self-center rounded-full ml-2">

            <img
              loading="lazy"
              src={imgsrc}
              alt={title}
              className="w-[100px] h-[100px] rounded-full  object-contain transition-transform duration-300 transform hover:scale-105"
            />
          </div>

          <div className="w-[70%]  flex flex-col gap-1 justify-start items-start md:items-center self-center">
            <div className="flex-grow">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{item?.description_ar}</p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm  font-bold text-orange-600 bg-orange-300 rounded-2xl p-2 text-center">${price}</span>
            </div>
          </div>
        </div>
      </motion.div>
      <DetailedItemModal
        show={isModalOpen}
        onHide={()=>setIsModalOpen(false)}
        item={item}
        adminDetails={adminDetails}
      />
    </>
  );
};

export default ItemCard;
