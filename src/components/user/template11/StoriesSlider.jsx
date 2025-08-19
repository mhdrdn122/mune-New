import { useState, useEffect, useMemo } from "react";
import Stories from "react-insta-stories";
import { motion, AnimatePresence } from "framer-motion";
import SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import Slider from "react-slick";
import './style.css'
SwiperCore.use([Autoplay, Navigation]);

const StoriesSlider = ({  defaultDurationMs = 30000,advertisments }) => {
  const [currentCard, setCurrentCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [cards,setCards] = useState()

  useEffect(()=>{
    if(advertisments){  
      console.log(advertisments)
      const result = advertisments?.map((it)=>(
        {
          id: it?.id,
          title: it?.title,
          avatar: it?.image,
          items: [
            { url: it?.image},
          ],
        }
      ))
      setCards(result)
    }
  },[advertisments])

  

  useEffect(() => {
    if (currentCard) setActiveIdx(0);
  }, [currentCard]);

  const storiesToShow = useMemo(
    () =>
      currentCard?.items.map((it) => ({
        url: it.url,
        type: "image",
        duration: it.duration ?? defaultDurationMs,
        header: {
          heading: currentCard?.title ?? "",
          profileImage: currentCard?.avatar ?? "",
        },
        styles:{
          width:'10px !important',
        }
      })) ?? [],
    [currentCard, defaultDurationMs]
  );

  const bgUrl =
    currentCard && storiesToShow[activeIdx]?.url
      ? storiesToShow[activeIdx].url
      : "";
  const settings = useMemo(() => {
    const count = cards?.length || 0;

    return {
      dots: false,
      speed: 700,
      slidesToShow: Math.min(count, 9), // never show more than the number of cards
      slidesToScroll: 2,
      autoplaySpeed: 2000,
      autoPlay:true,
      waitForAnimate: true,
      adaptiveHeight: true,
      infinite: count > 9, // infinite only if more than visible slides
      nextArrow: null,
      prevArrow: null,
      lazyLoad: "ondemand",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            infinite: count > 9,
            slidesToShow: Math.min(count, 9),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            infinite: count > 4,
            slidesToShow: Math.min(count, 4),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            infinite: count > 3,
            slidesToShow: Math.min(count, 3),
            slidesToScroll: 1,
          },
        },
      ],
    };
  }, [cards]);
  if (!cards || cards.length === 0) return null;
  return (
    <>
      <motion.div
        className="relative p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Slider {...settings}>
          {cards.map((card, index) => (
            <div key={card.id} className="!w-[90px] !h-[115px] md:!w-[130px] md:!h-[200px] p-[1px] ">
              <motion.div
                onClick={() => {
                  setCurrentCard(card);
                  setIsOpen(true);
                }}
                className="relative mx-auto rounded overflow-hidden cursor-pointer w-full h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={card.items[0].url}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 flex items-center gap-2 p-2">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white p-0.5">
                    <img
                      src={card.avatar || "https://via.placeholder.com/32"}
                      alt={card.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-white font-semibold text-sm truncate max-w-[100px]">
                    {card.title || "Story"}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </motion.div>

      <AnimatePresence>
        {isOpen && currentCard && (
          <motion.div
            className="fixed inset-0 w-full h-full z-[1050]"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                backgroundImage: bgUrl ? `url("${bgUrl}")` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px) brightness(50%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.button
              className="fixed top-4 right-4 text-white text-3xl z-[1060] bg-transparent border-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            <div className="relative flex justify-center items-center w-full h-full">
              <motion.div
                className="w-full sm:w-[90%] md:w-[500px] h-[600px] sm:h-[700px] max-h-screen"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Stories
                  stories={storiesToShow}
                  defaultInterval={defaultDurationMs}
                  width="100%"
                  height="100%"
                  startingIndex={activeIdx}
                  onStoryStart={(idx) => setActiveIdx(idx)}
                  onAllStoriesEnd={() => setIsOpen(false)}
                  loop={false}
                  keyboardNavigation
                  storyStyles={{
                    width:"500px"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesSlider;
