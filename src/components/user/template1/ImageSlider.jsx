import { useState } from "react";
import { SliderData } from "../SliderData ";
import arrLeft from "../assets/Arrow 4.png";
import arrRight from "../assets/Arrow 5.png";

const ImageSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="sliderrr">
      <div className="left-arrow" onClick={prevSlide} >
        <img src={arrLeft} alt="" />
      </div>
      {SliderData.map((slide, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && (
              <img src={slide.image} alt="travel image" className="image" />
            )}
          </div>
        );
      })}

      <div className="right-arrow" onClick={nextSlide}>
        <img src={arrRight} alt="" />
      </div>
    </section>
  );
};

export default ImageSlider;
